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
const DARK_BASE_HEX = "#070209";
const LIGHT_BASE_HEX = "#F8EFFF";

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

const GRAYSCALE_NEUTRALS: Record<string, string> = {
  "--surface-page": "#141414",
  "--surface-panel": "#1d1d1d",
  "--surface-raised": "#282828",
  "--surface-muted": "#4e4e4e",
  "--border-subtle": "#4e4e4e",
  "--text-secondary": "#dbdbdb",
  "--text-muted": "#b5b5b5",
};

const STATUS_BASE_COLORS: Record<string, string> = {
  "--status-success": "#57E38A",
  "--status-error": "#FF7A7A",
  "--status-neutral": "#CFC3D8",
  "--status-success-strong": "#28A745",
  "--status-success-muted": "#D4EDDA",
  "--status-error-strong": "#DC3545",
  "--status-error-muted": "#F8D7DA",
};

const clampWeight = (value: number) => Math.min(1, Math.max(0, value));

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return [r, g, b];
};

const rgbToHex = ([r, g, b]: [number, number, number]): string =>
  `#${[r, g, b]
    .map((channel) => Math.round(Math.max(0, Math.min(255, channel))))
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;

const mixHexColors = (hexA: string, hexB: string, weightB: number): string => {
  const ratio = clamp01(weightB);
  const colorA = hexToRgb(hexA);
  const colorB = hexToRgb(hexB);
  const mixed = colorA.map((value, index) => value * (1 - ratio) + colorB[index] * ratio) as [
    number,
    number,
    number,
  ];
  return rgbToHex(mixed);
};

const grayscaleValueFromHex = (hex: string): number => {
  const normalized = hex.replace("#", "");
  const channel = parseInt(normalized.slice(0, 2), 16);
  return clampWeight(channel / 255);
};

const grayscaleHexFromValue = (value: number): string => {
  const clamped = clampWeight(value);
  const channel = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${channel}${channel}${channel}`;
};

const neutralWeights = Object.fromEntries(
  Object.entries(GRAYSCALE_NEUTRALS).map(([variable, hex]) => [variable, grayscaleValueFromHex(hex)])
);

const clamp01 = (value: number): number => {
  if (!Number.isFinite(value)) return DEFAULT_BASE_TONE;
  return Math.min(1, Math.max(0, value));
};

const toneToBase = (tone: number): ThemeBase => (tone >= 0.5 ? "branco" : "preto");

const toneToBaseColor = (tone: number): string => mixHexColors(DARK_BASE_HEX, LIGHT_BASE_HEX, clamp01(tone));

const contrastFromTone = (tone: number): string => mixHexColors(LIGHT_BASE_HEX, DARK_BASE_HEX, clamp01(tone));

const applyNeutralScale = (tone: number, root: HTMLElement) => {
  const targetTone = clamp01(tone);
  Object.entries(neutralWeights).forEach(([variable, baseWeight]) => {
    const lightWeight = lerp(baseWeight, 1 - baseWeight, targetTone);
    root.style.setProperty(variable, grayscaleHexFromValue(lightWeight));
  });
};

const tintStatusColor = (hex: string, tone: number): string => {
  const contrast = contrastFromTone(tone);
  const adjustment = tone >= 0.5 ? 0.18 : 0.08;
  return mixHexColors(hex, contrast, adjustment);
};

const applyStatusColors = (tone: number, root: HTMLElement) => {
  Object.entries(STATUS_BASE_COLORS).forEach(([variable, hex]) => {
    root.style.setProperty(variable, tintStatusColor(hex, tone));
  });
};

const defaultPalette: ThemePalette = {
  base: DEFAULT_BASE,
  baseTone: DEFAULT_BASE_TONE,
  primary: DEFAULT_PRIMARY,
  source: "local",
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const readStoredPalette = (): ThemePalette => {
  if (typeof window === "undefined") {
    return { ...defaultPalette };
  }

  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return { ...defaultPalette };
    }
    const parsed = JSON.parse(serialized) as Partial<ThemePalette> & { baseTone?: number };
    const base: ThemeBase = parsed.base === "branco" ? "branco" : "preto";
    const baseTone = clamp01(typeof parsed.baseTone === "number" ? parsed.baseTone : base === "branco" ? 1 : 0);
    const primary = normalizeHex(parsed.primary || DEFAULT_PRIMARY);
    return { base, baseTone, primary, source: "local" };
  } catch {
    return { ...defaultPalette };
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
  root.style.setProperty("--palette-base", toneToBaseColor(tone));
  root.style.setProperty("--palette-contrast", contrastFromTone(tone));
  applyNeutralScale(tone, root);
  applyStatusColors(tone, root);
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