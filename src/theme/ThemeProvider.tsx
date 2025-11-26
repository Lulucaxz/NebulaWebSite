import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";

export type ThemeBase = "preto" | "branco";

export type ThemePalette = {
  base: ThemeBase;
  baseTone: number;
  primary: string;
  source?: "server" | "local";
};

export type SavedPalette = {
  id: number;
  label: string;
  base: ThemeBase;
  baseTone: number;
  primary: string;
  isDefault: boolean;
};

type CreatePaletteInput = {
  label: string;
  baseTone: number;
  primary: string;
  setActive?: boolean;
};

export interface ThemeContextValue {
  palette: ThemePalette;
  palettes: SavedPalette[];
  activePaletteId: number | null;
  setBase: (base: ThemeBase) => void;
  setBaseTone: (tone: number) => void;
  setPrimary: (hexColor: string) => void;
  refreshPalette: () => Promise<void>;
  selectPalette: (paletteId: number) => Promise<void>;
  createPalette: (input: CreatePaletteInput) => Promise<void>;
  deletePalette: (paletteId: number) => Promise<void>;
  loading: boolean;
}

const DEFAULT_PRIMARY = "#7e28c0";
const DEFAULT_BASE: ThemeBase = "preto";
const DEFAULT_BASE_TONE = 0;
const STORAGE_KEY = "nebula.themePalette";

const clamp01 = (value: number): number => {
  if (!Number.isFinite(value)) return DEFAULT_BASE_TONE;
  return Math.min(1, Math.max(0, value));
};

const toneToHex = (tone: number): string => {
  const normalized = clamp01(tone);
  const value = Math.round(normalized * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${value}${value}${value}`;
};

const toneToBase = (tone: number): ThemeBase => (tone >= 0.5 ? "branco" : "preto");

const contrastFromTone = (tone: number): string => (tone >= 0.5 ? "#070209" : "#F8EFFF");

const defaultPalette: ThemePalette = {
  base: DEFAULT_BASE,
  baseTone: DEFAULT_BASE_TONE,
  primary: DEFAULT_PRIMARY,
  source: "local",
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const readStoredPalette = (): ThemePalette => {
  if (typeof window === "undefined") {
    return defaultPalette;
  }

  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return defaultPalette;
    }
    const parsed = JSON.parse(serialized) as Partial<ThemePalette> & { baseTone?: number };
    const base: ThemeBase = parsed.base === "branco" ? "branco" : "preto";
    const baseTone = clamp01(typeof parsed.baseTone === "number" ? parsed.baseTone : base === "branco" ? 1 : 0);
    const primary = normalizeHex(parsed.primary || DEFAULT_PRIMARY);
    return { base, baseTone, primary, source: "local" };
  } catch {
    return defaultPalette;
  }
};

const normalizeHex = (input: string): string => {
  if (!input) return DEFAULT_PRIMARY;
  let hex = input.trim();
  if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  return match ? `#${match[1].toLowerCase()}` : DEFAULT_PRIMARY;
};

const applyPaletteToDocument = (palette: ThemePalette) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const tone = clamp01(typeof palette.baseTone === "number" ? palette.baseTone : palette.base === "branco" ? 1 : 0);
  root.dataset.base = palette.base;
  root.style.setProperty("--primary-500", palette.primary);
  root.style.setProperty("--palette-base", toneToHex(tone));
  root.style.setProperty("--palette-contrast", contrastFromTone(tone));
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<ThemePalette>(() => readStoredPalette());
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [activePaletteId, setActivePaletteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  type PalettePayload = {
    palettes: Array<{
      id: number;
      label: string;
      base: ThemeBase;
      baseTone?: number;
      primaryHex: string;
      isDefault: boolean;
    }>;
    activePaletteId: number | null;
  };

  const mapServerPalette = useCallback(
    (row: {
      id: number;
      label: string;
      base: ThemeBase;
      baseTone?: number;
      primaryHex: string;
      isDefault: boolean;
    }): SavedPalette => ({
      id: row.id,
      label: row.label,
      base: row.base === "branco" ? "branco" : "preto",
      baseTone: clamp01(typeof row.baseTone === "number" ? row.baseTone : row.base === "branco" ? 1 : 0),
      primary: normalizeHex(row.primaryHex),
      isDefault: Boolean(row.isDefault),
    }),
    []
  );

  const applyServerPayload = useCallback(
    (payload?: PalettePayload) => {
      if (!payload) return;
      const mapped = payload.palettes.map(mapServerPalette);
      setPalettes(mapped);
      const activeId = payload.activePaletteId ?? null;
      setActivePaletteId(activeId);
      const activePalette = mapped.find((item) => item.id === activeId);
      if (activePalette) {
        setPalette({
          base: activePalette.base,
          baseTone: activePalette.baseTone,
          primary: activePalette.primary,
          source: "server",
        });
      }
    },
    [mapServerPalette]
  );

  const refreshPalette = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<PalettePayload>(`${API_BASE}/api/palettes`, {
        withCredentials: true,
      });
      applyServerPayload(data);
    } catch (error) {
      console.warn("Não foi possível carregar paletas personalizadas", error);
    } finally {
      setLoading(false);
    }
  }, [applyServerPayload]);

  const setBase = useCallback((base: ThemeBase) => {
    setPalette((prev) => ({ ...prev, base, baseTone: base === "branco" ? 1 : 0 }));
  }, []);

  const setBaseTone = useCallback((tone: number) => {
    const normalized = clamp01(tone);
    setPalette((prev) => ({
      ...prev,
      base: toneToBase(normalized),
      baseTone: normalized,
    }));
  }, []);

  const setPrimary = useCallback((hexColor: string) => {
    setPalette((prev) => ({ ...prev, primary: normalizeHex(hexColor) }));
  }, []);

  const selectPalette = useCallback(
    async (paletteId: number) => {
      try {
        const { data } = await axios.post<PalettePayload>(
          `${API_BASE}/api/palettes/${paletteId}/select`,
          {},
          { withCredentials: true }
        );
        applyServerPayload(data);
      } catch (error) {
        console.error("Erro ao selecionar paleta", error);
      }
    },
    [applyServerPayload]
  );

  const createPalette = useCallback(
    async ({ label, baseTone, primary, setActive = true }: CreatePaletteInput) => {
      try {
        const normalizedTone = clamp01(baseTone);
        const { data } = await axios.post<PalettePayload>(
          `${API_BASE}/api/palettes`,
          {
            label,
            base: toneToBase(normalizedTone),
            primaryHex: normalizeHex(primary),
            baseTone: normalizedTone,
            setActive,
          },
          { withCredentials: true }
        );
        applyServerPayload(data);
      } catch (error) {
        console.error("Erro ao criar paleta", error);
        throw error;
      }
    },
    [applyServerPayload]
  );

  const deletePalette = useCallback(
    async (paletteId: number) => {
      try {
        const { data } = await axios.delete<PalettePayload>(
          `${API_BASE}/api/palettes/${paletteId}`,
          { withCredentials: true }
        );
        applyServerPayload(data);
      } catch (error) {
        console.error("Erro ao remover paleta", error);
        throw error;
      }
    },
    [applyServerPayload]
  );

  useEffect(() => {
    applyPaletteToDocument(palette);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ base: palette.base, baseTone: palette.baseTone, primary: palette.primary })
        );
      } catch {
        // ignore storage failures
      }
    }
  }, [palette]);

  useEffect(() => {
    refreshPalette();
  }, [refreshPalette]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      palette,
      palettes,
      activePaletteId,
      setBase,
      setBaseTone,
      setPrimary,
      refreshPalette,
      selectPalette,
      createPalette,
      deletePalette,
      loading,
    }),
    [
      palette,
      palettes,
      activePaletteId,
      setBase,
      setBaseTone,
      setPrimary,
      refreshPalette,
      selectPalette,
      createPalette,
      deletePalette,
      loading,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const ThemeContextRef = ThemeContext;