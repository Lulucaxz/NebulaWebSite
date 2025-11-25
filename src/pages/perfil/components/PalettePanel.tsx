import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import "./PalettePanel.css";
import { useTheme } from "../../../theme/useTheme";

interface PalettePanelProps {
  onClose: () => void;
  onCommit: () => void;
}

const clamp01 = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

const toneToHex = (tone: number) => {
  const normalized = clamp01(tone);
  const channel = Math.round(normalized * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${channel}${channel}${channel}`;
};

const hueToHex = (hue: number, saturation = 0.72, lightness = 0.45) => {
  const h = ((hue % 360) + 360) % 360;
  const s = clamp01(saturation);
  const l = clamp01(lightness);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
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

const hexToHue = (hex: string): number => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return 270;
  }
  const r = parseInt(normalized.substring(0, 2), 16) / 255;
  const g = parseInt(normalized.substring(2, 4), 16) / 255;
  const b = parseInt(normalized.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue = 0;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }
  return (Math.round(hue * 60) + 360) % 360;
};

const buildDefaultName = (count: number) => `Paleta ${count + 1}`;

export function PalettePanel({ onClose, onCommit }: PalettePanelProps) {
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

  const [draftBaseTone, setDraftBaseTone] = useState(() => clamp01(palette.baseTone));
  const [draftPrimaryHue, setDraftPrimaryHue] = useState(() => hexToHue(palette.primary));
  const [paletteName, setPaletteName] = useState(() => buildDefaultName(customCount));
  const [error, setError] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [selectingId, setSelectingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [wheelActive, setWheelActive] = useState(false);

  const primaryPreview = useMemo(() => hueToHex(draftPrimaryHue), [draftPrimaryHue]);
  const baseTonePercent = useMemo(() => Math.round(clamp01(draftBaseTone) * 100), [draftBaseTone]);

  useEffect(() => {
    setDraftBaseTone(clamp01(palette.baseTone));
    setDraftPrimaryHue(hexToHue(palette.primary));
  }, [palette.baseTone, palette.primary]);

  useEffect(() => {
    if (!paletteName) {
      setPaletteName(buildDefaultName(customCount));
    }
  }, [customCount, paletteName]);

  const handleBaseChange = (value: number) => {
    const normalized = clamp01(value / 100);
    setDraftBaseTone(normalized);
    setBaseTone(normalized);
  };

  const handleHueChange = (value: number) => {
    const normalized = ((value % 360) + 360) % 360;
    setDraftPrimaryHue(normalized);
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
    setCreating(true);
    setError("");
    try {
      const label = paletteName.trim() || buildDefaultName(customCount);
      await createPalette({ label, baseTone: draftBaseTone, primary: primaryPreview, setActive: true });
      onCommit();
      setPaletteName("");
      onClose();
    } catch {
      setError("Não foi possível salvar a paleta agora. Tente novamente.");
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
      setError("Falha ao aplicar a paleta selecionada.");
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
      setError("Não foi possível remover esta paleta.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="palette-panel-backdrop" onClick={onClose}>
      <div className="palette-panel" onClick={(event) => event.stopPropagation()}>
        <div className="palette-panel__header">
          <div>
            <p className="palette-panel__eyebrow">Personalizar cores</p>
            <h2>Construa a sua paleta</h2>
          </div>
          <button className="palette-panel__close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className="palette-panel__builder">
          <div className="palette-panel__control-group">
            <span className="palette-panel__label">Base</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(clamp01(draftBaseTone) * 100)}
              onChange={(event) => handleBaseChange(Number(event.target.value))}
              className="palette-panel__slider"
              style={{
                background: "linear-gradient(90deg, #070209 0%, #F8EFFF 100%)",
              }}
            />
            <div className="palette-panel__slider-labels">
              <span>Preto</span>
              <span>{baseTonePercent}%</span>
              <span>Branco</span>
            </div>
          </div>

          <div className="palette-panel__control-group">
            <span className="palette-panel__label">Cor primária</span>
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
              style={{"--wheel-angle": `${draftPrimaryHue}deg`} as CSSProperties}
            >
              <span
                className="palette-panel__wheel-indicator"
                style={{"--wheel-angle": `${draftPrimaryHue}deg`} as CSSProperties}
              />
              <span className="palette-panel__wheel-center" style={{ background: primaryPreview }} />
            </div>
          </div>

          <div className="palette-panel__control-group palette-panel__control-group--inline">
            <div className="palette-panel__input-wrapper">
              <label htmlFor="palette-name">Nome</label>
              <input
                id="palette-name"
                type="text"
                value={paletteName}
                onChange={(event) => setPaletteName(event.target.value)}
                maxLength={60}
                placeholder="Minha paleta"
              />
            </div>
            <button
              className="palette-panel__save"
              onClick={handleCreatePalette}
              disabled={creating}
            >
              {creating ? "Salvando..." : "Selecionar"}
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
                    style={{ background: toneToHex(item.baseTone) }}
                    aria-label={`Base ${item.base}`}
                  />
                  <span
                    style={{ background: item.primary }}
                    aria-label="Cor primária"
                  />
                </div>
                <div className="palette-card__info">
                  <strong>{item.label}</strong>
                  <small>{item.base === "preto" ? "Base escura" : "Base clara"}</small>
                </div>
                {!item.isDefault && (
                  <span
                    className="palette-card__delete"
                    role="button"
                    aria-label="Excluir paleta"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeletePalette(item.id);
                    }}
                  >
                    ×
                  </span>
                )}
                {isActive && <span className="palette-card__tag">Ativa</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
