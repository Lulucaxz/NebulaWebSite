import { Router, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { pool } from "./db";
import { asyncHandler } from "./utils";

type AuthenticatedRequest = Request & {
  user?: {
    id: number;
  };
};

interface FollowListRow extends RowDataPacket {
  username: string;
  user: string;
  icon: string;
}

const router = Router();

const normalizeHandle = (handle: string | undefined | null) =>
  (handle || "").trim();

const findUserByHandle = async (
  handle: string,
  executor?: PoolConnection
) => {
  const runner = executor ?? pool;
  const [rows] = await runner.query<RowDataPacket[]>(
    "SELECT id, user, username, icon FROM usuario WHERE user = ? LIMIT 1",
    [handle]
  );

  if (!rows.length) {
    return null;
  }

  return rows[0] as { id: number; user: string; username: string; icon: string };
};

const syncUserFollowCounts = async (connection: PoolConnection, userId: number) => {
  await connection.query(
    `UPDATE usuario
        SET seguidores = (
          SELECT COUNT(*) FROM usuario_follow WHERE seguido_id = ?
        ),
        seguindo = (
          SELECT COUNT(*) FROM usuario_follow WHERE seguidor_id = ?
        )
      WHERE id = ?`,
    [userId, userId, userId]
  );
};

router.get(
  "/:handle/list",
  asyncHandler(async (req: Request, res: Response) => {
    const handle = normalizeHandle(req.params.handle);
    const type = (req.query.type as string) === "following" ? "following" : "followers";

    if (!handle) {
      res.status(400).json({ error: "Usuário inválido" });
      return;
    }

    const targetUser = await findUserByHandle(handle);
    if (!targetUser) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    const query =
      type === "following"
        ? `SELECT u.username, u.user, u.icon
             FROM usuario_follow f
             JOIN usuario u ON u.id = f.seguido_id
            WHERE f.seguidor_id = ?
            ORDER BY u.username ASC`
        : `SELECT u.username, u.user, u.icon
             FROM usuario_follow f
             JOIN usuario u ON u.id = f.seguidor_id
            WHERE f.seguido_id = ?
            ORDER BY u.username ASC`;

    const [rows] = await pool.query<FollowListRow[]>(query, [targetUser.id]);

    const lista = rows.map((row) => ({
      nome: row.username,
      usuario: row.user,
      foto: row.icon,
    }));

    res.json(lista);
  })
);

router.post(
  "/manage",
  asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.isAuthenticated || !authReq.isAuthenticated() || !authReq.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }

    const { targetHandle, action } = req.body as {
      targetHandle?: string;
      action?: "follow" | "unfollow" | "removeFollower";
    };

    const normalizedTarget = normalizeHandle(targetHandle);
    if (!normalizedTarget) {
      res.status(400).json({ error: "Usuário alvo inválido" });
      return;
    }

    if (!action) {
      res.status(400).json({ error: "Ação não informada" });
      return;
    }

    const connection = await pool.getConnection();
    let targetUser: { id: number; user: string; username: string; icon: string } | null = null;

    try {
      await connection.beginTransaction();

      targetUser = await findUserByHandle(normalizedTarget, connection);
      if (!targetUser) {
        await connection.rollback();
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      if (action === "follow") {
        if (targetUser.id === authReq.user.id) {
          await connection.rollback();
          res.status(400).json({ error: "Não é possível seguir a própria conta" });
          return;
        }
        await connection.query(
          `INSERT IGNORE INTO usuario_follow (seguidor_id, seguido_id) VALUES (?, ?)`,
          [authReq.user.id, targetUser.id]
        );
      } else if (action === "unfollow") {
        await connection.query(
          `DELETE FROM usuario_follow WHERE seguidor_id = ? AND seguido_id = ?`,
          [authReq.user.id, targetUser.id]
        );
      } else if (action === "removeFollower") {
        await connection.query(
          `DELETE FROM usuario_follow WHERE seguidor_id = ? AND seguido_id = ?`,
          [targetUser.id, authReq.user.id]
        );
      } else {
        await connection.rollback();
        res.status(400).json({ error: "Ação inválida" });
        return;
      }

      await syncUserFollowCounts(connection, authReq.user.id);
      if (targetUser.id !== authReq.user.id) {
        await syncUserFollowCounts(connection, targetUser.id);
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    if (!targetUser) {
      res.status(500).json({ error: "Usuário alvo não localizado" });
      return;
    }

    const [[currentCounts]] = await pool.query<RowDataPacket[]>(
      "SELECT seguidores, seguindo FROM usuario WHERE id = ?",
      [authReq.user.id]
    );

    const [[targetCounts]] = await pool.query<RowDataPacket[]>(
      "SELECT seguidores, seguindo FROM usuario WHERE id = ?",
      [targetUser.id]
    );

    let isFollowing: boolean | undefined;
    if (action === "follow" || action === "unfollow") {
      const [relationRows] = await pool.query<RowDataPacket[]>(
        `SELECT 1 FROM usuario_follow WHERE seguidor_id = ? AND seguido_id = ? LIMIT 1`,
        [authReq.user.id, targetUser.id]
      );
      isFollowing = relationRows.length > 0;
    }

    res.json({
      action,
      targetHandle: normalizedTarget,
      isFollowing,
      currentCounts: {
        seguidores: currentCounts?.seguidores ?? 0,
        seguindo: currentCounts?.seguindo ?? 0,
      },
      targetCounts: {
        seguidores: targetCounts?.seguidores ?? 0,
        seguindo: targetCounts?.seguindo ?? 0,
      },
    });
  })
);

export default router;
