import { Router, Request, Response } from "express";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { pool } from "../db";
import { asyncHandler } from "../utils";

const router = Router();

const DEFAULT_PALETTES = [
  { label: "Nebula Preto & Roxo", base: "preto" as const, primary: "#7e28c0", baseTone: 0 },
  { label: "Nebula Branco & Roxo", base: "branco" as const, primary: "#7e28c0", baseTone: 1 },
];

const MAX_CUSTOM_PALETTES = 12;

type AuthenticatedRequest = Request & {
  user?: { id: number };
  isAuthenticated?: () => boolean;
};

type ThemeBase = "preto" | "branco";

type PaletteRow = RowDataPacket & {
  id: number;
  label: string;
  base: ThemeBase;
  primary_hex: string;
  metadata: string | null;
  is_default: number;
};

type PaletteMetadata = {
  baseTone?: number;
};

const clamp01 = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

const parseMetadata = (payload: string | null): PaletteMetadata => {
  if (!payload) return {};
  try {
    const parsed = JSON.parse(payload);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as PaletteMetadata;
    }
  } catch (error) {
    console.warn("Não foi possível converter metadata de paleta", error);
  }
  return {};
};

const serializeMetadata = (meta: PaletteMetadata): string => JSON.stringify(meta);

const toneFromRow = (row: PaletteRow): number => {
  const meta = parseMetadata(row.metadata);
  if (typeof meta.baseTone === "number") {
    return clamp01(meta.baseTone);
  }
  return row.base === "branco" ? 1 : 0;
};

const toneToBase = (tone: number): ThemeBase => (tone >= 0.5 ? "branco" : "preto");

const normalizeHex = (value: string | undefined): string => {
  if (!value) return "#7e28c0";
  let hex = value.trim();
  if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  return match ? `#${match[1].toLowerCase()}` : "#7e28c0";
};

const mapPalette = (row: PaletteRow) => ({
  id: row.id,
  label: row.label,
  base: row.base === "branco" ? "branco" : "preto",
  baseTone: toneFromRow(row),
  primaryHex: normalizeHex(row.primary_hex),
  isDefault: Boolean(row.is_default),
});

const ensureAuthenticated = (req: Request, res: Response): number | null => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.isAuthenticated || !authReq.isAuthenticated() || !authReq.user) {
    res.status(401).json({ error: "Não autenticado" });
    return null;
  }
  return authReq.user.id;
};

const setActivePalette = async (
  connection: PoolConnection,
  userId: number,
  paletteId: number
) => {
  const [[paletteRow]] = await connection.query<RowDataPacket[]>(
    `SELECT id, base, metadata FROM usuario_palette WHERE id = ? AND usuario_id = ? LIMIT 1`,
    [paletteId, userId]
  );

  if (!paletteRow) {
    throw new Error("Paleta não encontrada para este usuário");
  }

  const tone = toneFromRow(paletteRow as PaletteRow);
  const tema = tone >= 0.5 ? "light" : "dark";
  await connection.query(
    `UPDATE usuario SET active_palette_id = ?, tema = ? WHERE id = ?`,
    [paletteRow.id, tema, userId]
  );
};

const ensureDefaultPalettes = async (connection: PoolConnection, userId: number) => {
  await connection.query(`SELECT id FROM usuario WHERE id = ? FOR UPDATE`, [userId]);

  for (const def of DEFAULT_PALETTES) {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM usuario_palette WHERE usuario_id = ? AND is_default = 1 AND base = ? LIMIT 1`,
      [userId, def.base]
    );

    if (!rows.length) {
      await connection.query<ResultSetHeader>(
        `INSERT INTO usuario_palette (usuario_id, label, base, primary_hex, metadata, is_default)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [
          userId,
          def.label,
          def.base,
          def.primary,
          serializeMetadata({ baseTone: clamp01(def.baseTone ?? (def.base === "branco" ? 1 : 0)) }),
        ]
      );
    }
  }

  const [[userRow]] = await connection.query<RowDataPacket[]>(
    `SELECT active_palette_id FROM usuario WHERE id = ?`,
    [userId]
  );

  if (!userRow) {
    throw new Error("Usuário não encontrado durante sincronização de paletas");
  }

  if (!userRow.active_palette_id) {
    const [prefersDarkRows] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM usuario_palette WHERE usuario_id = ? AND base = 'preto'
       ORDER BY is_default DESC, id ASC LIMIT 1`,
      [userId]
    );
    const fallbackId = prefersDarkRows[0]?.id as number | undefined;

    if (fallbackId) {
      await setActivePalette(connection, userId, fallbackId);
    } else {
      const [anyPaletteRows] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM usuario_palette WHERE usuario_id = ? ORDER BY id ASC LIMIT 1`,
        [userId]
      );
      const anyPaletteId = anyPaletteRows[0]?.id as number | undefined;
      if (anyPaletteId) {
        await setActivePalette(connection, userId, anyPaletteId);
      }
    }
  }
};

const composePayload = async (connection: PoolConnection, userId: number) => {
  const [paletteRows] = await connection.query<PaletteRow[]>(
    `SELECT id, label, base, primary_hex, metadata, is_default
       FROM usuario_palette
      WHERE usuario_id = ?
   ORDER BY is_default DESC, created_at ASC`,
    [userId]
  );

  const [[userRow]] = await connection.query<RowDataPacket[]>(
    `SELECT active_palette_id FROM usuario WHERE id = ?`,
    [userId]
  );

  return {
    palettes: paletteRows.map(mapPalette),
    activePaletteId: userRow?.active_palette_id ?? null,
  };
};

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await ensureDefaultPalettes(connection, userId);
      const payload = await composePayload(connection, userId);
      await connection.commit();
      res.json(payload);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  })
);

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const { label, base, primaryHex, baseTone, setActive } = req.body as {
      label?: string;
      base?: ThemeBase;
      primaryHex?: string;
      baseTone?: number;
      setActive?: boolean;
    };

    const trimmedLabel = (label || "").trim();
    if (!trimmedLabel || trimmedLabel.length < 3 || trimmedLabel.length > 60) {
      res.status(400).json({ error: "Informe um nome entre 3 e 60 caracteres" });
      return;
    }

    const normalizedBase: ThemeBase = base === "branco" ? "branco" : base === "preto" ? "preto" : "preto";
    const normalizedHex = normalizeHex(primaryHex);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await ensureDefaultPalettes(connection, userId);

      const [[countRow]] = await connection.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM usuario_palette WHERE usuario_id = ? AND is_default = 0`,
        [userId]
      );
      if ((countRow?.total ?? 0) >= MAX_CUSTOM_PALETTES) {
        await connection.rollback();
        res.status(400).json({ error: "Limite de paletas personalizadas atingido" });
        return;
      }

      const normalizedTone = clamp01(
        typeof baseTone === "number" ? baseTone : normalizedBase === "branco" ? 1 : 0
      );

      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO usuario_palette (usuario_id, label, base, primary_hex, metadata, is_default)
         VALUES (?, ?, ?, ?, ?, 0)`,
        [
          userId,
          trimmedLabel,
          toneToBase(normalizedTone),
          normalizedHex,
          serializeMetadata({ baseTone: normalizedTone }),
        ]
      );

      if (setActive !== false) {
        await setActivePalette(connection, userId, result.insertId);
      }

      const payload = await composePayload(connection, userId);
      await connection.commit();
      res.status(201).json(payload);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  })
);

router.post(
  "/:paletteId/select",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const paletteId = Number(req.params.paletteId);
    if (!Number.isFinite(paletteId)) {
      res.status(400).json({ error: "Paleta inválida" });
      return;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await ensureDefaultPalettes(connection, userId);
      await setActivePalette(connection, userId, paletteId);
      const payload = await composePayload(connection, userId);
      await connection.commit();
      res.json(payload);
    } catch (err) {
      await connection.rollback();
      res.status(404).json({ error: "Não foi possível selecionar esta paleta" });
    } finally {
      connection.release();
    }
  })
);

router.delete(
  "/:paletteId",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req, res);
    if (!userId) return;

    const paletteId = Number(req.params.paletteId);
    if (!Number.isFinite(paletteId)) {
      res.status(400).json({ error: "Paleta inválida" });
      return;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [[paletteRow]] = await connection.query<RowDataPacket[]>(
        `SELECT id, is_default FROM usuario_palette WHERE id = ? AND usuario_id = ? LIMIT 1`,
        [paletteId, userId]
      );

      if (!paletteRow) {
        await connection.rollback();
        res.status(404).json({ error: "Paleta não encontrada" });
        return;
      }

      if (paletteRow.is_default) {
        await connection.rollback();
        res.status(400).json({ error: "Paletas padrão não podem ser removidas" });
        return;
      }

      const [[userRow]] = await connection.query<RowDataPacket[]>(
        `SELECT active_palette_id FROM usuario WHERE id = ?`,
        [userId]
      );

      const wasActive = userRow?.active_palette_id === paletteId;

      await connection.query(`DELETE FROM usuario_palette WHERE id = ? AND usuario_id = ?`, [paletteId, userId]);

      if (wasActive) {
        await connection.query(`UPDATE usuario SET active_palette_id = NULL WHERE id = ?`, [userId]);
      }

      await ensureDefaultPalettes(connection, userId);
      const payload = await composePayload(connection, userId);
      await connection.commit();
      res.json(payload);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  })
);

export default router;
