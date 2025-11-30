# Color Mapping

This document ties the original Nebula color references to the CSS variables driven by the current `ThemeProvider`. Use it as the source of truth whenever you need a color value.

## Core Anchors

| Token | Reference Hex | Purpose | Notes |
| --- | --- | --- | --- |
| `--palette-base` | `#070209` (dark) / `#F8EFFF` (light) | Dynamic base tone written by `ThemeProvider` | Interpolates between the two anchors based on `palette.baseTone`.
| `--palette-contrast` | opposite of `--palette-base` | Primary text/background contrast | Always complements `--palette-base`.
| `--primary-500` | `#7E28C0` | Brand accent | Overridden when a user selects a custom primary.
| `--primary-400` | mix(`--primary-500`, `#ffffff`, 20%) | Lighter accent | Use for hover states.
| `--primary-600` | mix(`--primary-500`, `#000000`, 14%) | Darker accent | Use for pressed states.
| `--primary-soft` | mix(`--primary-500`, `--palette-contrast`, 68%) | Soft backgrounds/borders | Auto-adjusts with palette contrast.

## Neutral Surfaces & Text

| Token | Reference Hex | Usage |
| --- | --- | --- |
| `--surface-page` | `#141414` | Body background |
| `--surface-panel` | `#1D1D1D` | Panels, cards |
| `--surface-raised` | `#282828` | Elevated blocks |
| `--surface-muted` | `#4E4E4E` | Muted containers, dividers |
| `--border-subtle` | `#4E4E4E` | Quiet borders |
| `--border-strong` | `#F8EFFF` | High-contrast dividers |
| `--text-primary` | `#F8EFFF` | Base body text |
| `--text-secondary` | `#DBDBDB` | Secondary copy |
| `--text-muted` | `#B5B5B5` | Tertiary/placeholder |
| `--text-on-primary` | `#070209` | Text on buttons/primary chips |

`ThemeProvider` writes these values dynamically via `applyNeutralScale`, ensuring custom palettes keep the same relative balance.

## Legacy Aliases

The original project referenced `--branco`, `--preto`, `--cinza-*`, and `--roxo*`. These remain mapped to the core tokens, so existing CSS keeps working:

- `--branco` → `var(--text-primary)`
- `--preto` → `#070209`
- `--cinza-escuro1/2/3` → `--surface-raised/panel/page`
- `--cinza-claro1/2` → `--surface-muted` / `--text-secondary`
- `--roxo1..4` → derived from `--primary-500`

## Status & Semantic Colors

| Token | Reference Hex | Notes |
| --- | --- | --- |
| `--status-success` | `#57E38A` | Success backgrounds/badges (auto-adjusted for palette tone). |
| `--status-error` | `#FF7A7A` | Error/alert surfaces. |
| `--status-neutral` | `#CFC3D8` | Neutral info states/badges. |
| `--status-success-on` | `var(--preto)` | Text/icon color on success surfaces. |
| `--status-error-on` | `var(--preto)` | Text/icon color on error surfaces. |
| `--status-neutral-on` | `var(--preto)` | Text/icon color on neutral surfaces. |

The `ThemeProvider` sets the status fill tokens and blends them slightly with the current contrast color so they feel consistent in light/dark palettes.

## Usage Guidelines

1. **Never use raw hex values** in CSS/TSX. Reference the tokens above or derive new ones via `color-mix`.
2. **SVG icons** should rely on `fill="currentColor"` and inherit from the surrounding element. Apply a token class to the wrapper instead of editing the SVG.
3. **Inline styles** (when unavoidable) should pull from CSS variables: `style={{ color: 'var(--text-secondary)' }}`.
4. **New semantic needs** (warning, info, etc.) should be added here and exposed via `ThemeProvider` before use.
5. **Testing**: after touching colors, verify both the default palette and a custom palette (light base + custom primary) to ensure contrast and saturation hold up.
