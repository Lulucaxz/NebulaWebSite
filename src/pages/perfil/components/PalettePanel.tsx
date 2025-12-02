import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AxiosError } from "axios";
import "./PalettePanel.css";
import { useTheme } from "../../../theme/useTheme";
import { DEFAULT_THEME_PALETTE } from "../../../theme/ThemeProvider";
import { useTranslation } from "react-i18next";

interface PalettePanelProps {
  onClose: () => void;
  onCommit: () => void;
}

const clamp01 = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

const DARK_BASE_HEX = "#070209";
const LIGHT_BASE_HEX = "#F8EFFF";

const hexChannel = (hex: string, start: number) => parseInt(hex.slice(start, start + 2), 16);

const toneToHex = (tone: number) => {
  const normalized = clamp01(tone);
  const r = Math.round(hexChannel(DARK_BASE_HEX, 1) * (1 - normalized) + hexChannel(LIGHT_BASE_HEX, 1) * normalized)
    .toString(16)
    .padStart(2, "0");
  const g = Math.round(hexChannel(DARK_BASE_HEX, 3) * (1 - normalized) + hexChannel(LIGHT_BASE_HEX, 3) * normalized)
    .toString(16)
    .padStart(2, "0");
  const b = Math.round(hexChannel(DARK_BASE_HEX, 5) * (1 - normalized) + hexChannel(LIGHT_BASE_HEX, 5) * normalized)
    .toString(16)
    .padStart(2, "0");
  return `#${r}${g}${b}`;
};

const hexToHue = (hex: string): number => {
  const normalized = hex.replace("#", "").padEnd(6, "0");
  if (normalized.length !== 6) return 270;
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue = 0;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  return (Math.round(hue * 60) + 360) % 360;
};

const hueToHex = (hue: number, saturation = 0.75, lightness = 0.5) => {
  const h = ((hue % 360) + 360) % 360;
  const s = clamp01(saturation);
  const l = clamp01(lightness);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (value: number) => Math.round((value + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const TONE_DUPLICATE_EPSILON = 0.01;

export function PalettePanel({ onClose, onCommit }: PalettePanelProps) {
  const { t } = useTranslation();
  const {
    palette,
    palettes,
    activePaletteId,
    setBaseTone,
    setPrimary,
    selectPalette,
    createPalette,
    deletePalette,
  } = useTheme();

  const customCount = useMemo(() => palettes.filter((p) => !p.isDefault).length, [palettes]);
  const buildDefaultName = useCallback(
    (count: number) => t("palettePanel.defaultName", { index: count + 1 }),
    [t]
  );

  const [draftBaseTone, setDraftBaseTone] = useState(
    () => clamp01(palette.baseTone ?? (palette.base === "branco" ? 1 : 0))
  );
  const [draftHue, setDraftHue] = useState(() => hexToHue(palette.primary));
  const [paletteName, setPaletteName] = useState(() => buildDefaultName(customCount));
  const [error, setError] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [selectingId, setSelectingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [wheelActive, setWheelActive] = useState(false);

  const primaryPreview = useMemo(() => hueToHex(draftHue), [draftHue]);
  const baseTonePercent = useMemo(() => Math.round(clamp01(draftBaseTone) * 100), [draftBaseTone]);

  useEffect(() => {
    setDraftBaseTone(clamp01(palette.baseTone ?? (palette.base === "branco" ? 1 : 0)));
    setDraftHue(hexToHue(palette.primary));
  }, [palette.base, palette.baseTone, palette.primary]);

  const handleBaseChange = (value: number) => {
    const normalized = clamp01(value / 100);
    setDraftBaseTone(normalized);
    setBaseTone(normalized);
  };

  const handleHueChange = (value: number) => {
    const normalized = ((value % 360) + 360) % 360;
    setDraftHue(normalized);
    setPrimary(hueToHex(normalized));
  };

  const updateHueFromPointer = (clientX: number, clientY: number) => {
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    handleHueChange(angle);
  };

  const handleWheelPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateHueFromPointer(event.clientX, event.clientY);
    setWheelActive(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleWheelPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!wheelActive) return;
    updateHueFromPointer(event.clientX, event.clientY);
  };

  const handleWheelPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setWheelActive(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleCreatePalette = async () => {
    if (creating) return;
    setError("");

    const trimmedName = paletteName.trim();
    if (!trimmedName) {
      setError(t("palettePanel.errors.emptyName"));
      return;
    }

    const normalizedTone = clamp01(draftBaseTone);
    const normalizedPrimary = primaryPreview.toLowerCase();
    const paletteAlreadyExists = palettes.some((item) => {
      const toneDiff = Math.abs(clamp01(item.baseTone) - normalizedTone);
      return toneDiff <= TONE_DUPLICATE_EPSILON && item.primary.toLowerCase() === normalizedPrimary;
    });

    const matchesDefaultPalette =
      Math.abs(DEFAULT_THEME_PALETTE.baseTone - normalizedTone) <= TONE_DUPLICATE_EPSILON &&
      DEFAULT_THEME_PALETTE.primary.toLowerCase() === normalizedPrimary;

    if (paletteAlreadyExists || matchesDefaultPalette) {
      setError(t("palettePanel.errors.duplicate"));
      return;
    }

    setCreating(true);
    try {
      await createPalette({ label: trimmedName, baseTone: normalizedTone, primary: primaryPreview, setActive: true });
      onCommit();
      setPaletteName("");
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      const serverMessage = axiosError.response?.data?.error;
      setError(serverMessage || t("palettePanel.errors.save"));
    } finally {
      setCreating(false);
    }
  };

  const handleSelectPalette = async (id: number) => {
    if (selectingId === id) return;
    setSelectingId(id);
    setError("");
    try {
      await selectPalette(id);
      onCommit();
    } catch {
      setError(t("palettePanel.errors.apply"));
    } finally {
      setSelectingId(null);
    }
  };

  const handleDeletePalette = async (id: number) => {
    if (deletingId === id) return;
    setDeletingId(id);
    setError("");
    try {
      await deletePalette(id);
      onCommit();
    } catch {
      setError(t("palettePanel.errors.delete"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="palette-panel-backdrop" onClick={onClose}>
      <div className="palette-panel" onClick={(event) => event.stopPropagation()}>
        <div className="palette-panel__header">
          <div>
            <p className="palette-panel__eyebrow">{t("palettePanel.eyebrow")}</p>
            <h2>{t("palettePanel.heading")}</h2>
          </div>
          <button className="palette-panel__close" onClick={onClose} aria-label={t("common.close")}>
            ×
          </button>
        </div>

        <div className="palette-panel__builder">
          <div className="palette-panel__control-group">
            <span className="palette-panel__label">{t("palettePanel.baseLabel")}</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(clamp01(draftBaseTone) * 100)}
              onChange={(event) => handleBaseChange(Number(event.target.value))}
              className="palette-panel__slider"
              style={{
                background: "linear-gradient(90deg, var(--preto) 0%, var(--text-primary) 100%)",
              }}
            />
            <div className="palette-panel__slider-labels">
              <span>{t("palettePanel.dark")}</span>
              <span className="palette-panel__slider-value">{baseTonePercent}%</span>
              <span>{t("palettePanel.light")}</span>
            </div>
          </div>

          <div className="palette-panel__control-group">
            <span className="palette-panel__label">{t("palettePanel.primaryLabel")}</span>
            <div
              ref={wheelRef}
              className="palette-panel__wheel"
              onPointerDown={handleWheelPointerDown}
              onPointerMove={handleWheelPointerMove}
              onPointerUp={handleWheelPointerUp}
              onPointerLeave={(event) => {
                if (wheelActive && event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                setWheelActive(false);
              }}
              style={{ "--wheel-angle": `${draftHue}deg`, "--wheel-primary": primaryPreview } as CSSProperties}
            >
              <span
                className="palette-panel__wheel-indicator"
                style={{ "--wheel-angle": `${draftHue}deg` } as CSSProperties}
              />
            </div>
          </div>

          <div className="palette-panel__control-group palette-panel__control-group--inline">
            <div className="palette-panel__input-wrapper">
              <label htmlFor="palette-name">{t("palettePanel.nameLabel")}</label>
              <input
                id="palette-name"
                type="text"
                value={paletteName}
                onChange={(event) => setPaletteName(event.target.value)}
                maxLength={60}
                placeholder={t("palettePanel.namePlaceholder")}
              />
            </div>
            <button
              className="palette-panel__save"
              onClick={handleCreatePalette}
              disabled={creating || !paletteName.trim()}
            >
              {creating ? t("palettePanel.saving") : t("palettePanel.select")}
            </button>
          </div>
        </div>

        {error && <div className="palette-panel__error">{error}</div>}

        <div className="palette-panel__grid">
          {palettes.map((item) => {
            const isActive = item.id === activePaletteId;
            const isBusy = selectingId === item.id || deletingId === item.id;
            return (
              <button
                key={item.id}
                className={`palette-card ${isActive ? "palette-card--active" : ""}`}
                onClick={() => handleSelectPalette(item.id)}
                disabled={isBusy}
              >
                <div className="palette-card__swatch">
                  <span
                    style={{ background: toneToHex(item.baseTone ?? (item.base === "branco" ? 1 : 0)) }}
                    aria-label={t("palettePanel.baseSwatch", {
                      tone: item.base === "preto" ? t("palettePanel.darkBase") : t("palettePanel.lightBase"),
                    })}
                  />
                  <span
                    style={{ background: item.primary }}
                    aria-label={t("palettePanel.primarySwatch")}
                  />
                </div>
                <div className="palette-card__info">
                  <strong>{item.label}</strong>
                  <small>{item.base === "preto" ? t("palettePanel.darkBase") : t("palettePanel.lightBase")}</small>
                </div>
                {!item.isDefault && (
                  <span
                    className="palette-card__delete"
                    role="button"
                    aria-label={t("palettePanel.deleteLabel")}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeletePalette(item.id);
                    }}
                  >
                    ×
                  </span>
                )}
                {isActive && <span className="palette-card__tag">{t("palettePanel.activeTag")}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
