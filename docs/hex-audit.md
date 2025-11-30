# Hex Audit (2025-11-30)

## Method

```
Get-ChildItem -Path src -Recurse -File |
  Select-String -Pattern "#[0-9A-Fa-f]{3,6}" -AllMatches |
  Group-Object Path |
  Sort-Object Count -Descending
```

All files listed below still hold literal hexadecimal colors that bypass the palette tokens introduced in `src/index.css`. Counts include inline styles and SVG fills.

## Hotspots by Feature

| Feature / Scope | Files | Literal Count | Representative Colors | Notes |
| --- | --- | ---: | --- | --- |
| **Forum** | `pages/forum/Forum.css`, `pages/forum/components/{Comentario,respostas}.css` | 95 | `#363636`, `#4A4A4A`, `#A4A4A4`, `#D390FF`, `#c17ae6` | Largest cluster. Mixes gray backgrounds, tag colors, and accent purples; needs tokenized surfaces/borders + status tokens. |
| **Planos** | `pages/planos/{planos.css,planos.tsx,planos.backup.tsx}` | 54 | `#7e28c0`, `#9030eb`, `#610EA1`, `#7E7E7E`, `#f0f0f0` | Backup file alone carries 31 refs; live CSS/TSX still hard-code brand purple + grays for cards/buttons. |
| **Cursos** | `pages/cursos/{cursos.css,modulos.tsx,ProfessorWorkspace.css}`, `pages/cursos/components/moduloItem.{css,tsx}` | 40 | `#28a745`, `#dc3545`, `#323232`, `#636363`, `#F1D9FF` | Status badges reuse Bootstrap greens/reds; module cards set fixed grays rather than palette neutrals. |
| **Core Theme** | `src/index.css`, `src/theme/ThemeProvider.tsx` | 38 | `#070209`, `#F8EFFF`, `#7E28C0` | These are intentional anchor constants for palette math; leave as-is but document to avoid refactors later. |
| **Perfil** | `pages/perfil/components/{PalettePanel.css,.ts,rank.css,.ts,ModalSeguidores.css,ModalAvaliarPlanos.tsx}`, `pages/perfil/{CropImageModal.tsx,teste.tsx}` | 26 | `#ff6d3f`, `#c33bff`, `#ff8a8a`, `#481A6B`, `#fff` | Palette editor lists static swatches; rank widgets and modals use raw colors for gradients/borders. |
| **Home** | `pages/home/components/{sessaoPlanos.css,carrosselAulas.css,banner.css,avaliacoes.tsx,objetivos.tsx}` | 19 | `#3D3D3D`, `#3b393b`, `#fff`, `#9B3BD2` | Hero/plan sections fix their own grays and text colors; should align with `--surface-*` tokens. |
| **Logon** | `pages/logon/{login.tsx,login.css}` | 10 | `#fff`, `#eee`, `#ccc`, `#333` | Inline styles and CSS both hard-code form colors. |
| **Chat** | `pages/chat/chat.css` | 7 | `#4A4A4A`, `#ffffff`, `#4ee08d`, `#ffc857`, `#ff6b6b` | Status dots duplicate the new semantic success/warn/error colors; can swap to `--status-*`. |
| **Notificações** | `pages/notificacoes/notificacoes.css` | 3 | `#ffc857`, `#4ee08d`, `#5fa8f5` | Same status palette as chat; should read from tokens. |
| **Configurações** | `pages/configuracoes/configuracoes.css` | 2 | `#FFFFFF` | Straightforward text colors. |
| **Anotações** | `pages/anotacoes/{Anotacoes.tsx,components/AnotacoesColunas.tsx}` | 6 | `#FFFFFF`, `#fff` | SVGs + inline card backgrounds. |
| **404 Page** | `pages/404/components/{main_404.css,dusk.css}` | 5 | `#FFFFFF`, `#000000`, `#ffb3ff` | Static landing styling. |

Additional single-file occurrences:
- `src/components/Menu.tsx` and `src/components/menu.css` (10 combined) use white fills for SVG icons.
- `pages/notificacoes/notificacoes.css`, `pages/cursos/components/moduloItem.css`, and `pages/home/components/objetivos.tsx` each have three or fewer literals but should still migrate to tokens for consistency.
- `pages/forum/ImgComentarioTEMP/comentarioImg1.png` flagged once because its metadata stores a `#` string; ignore for refactor work.

## Next Steps

1. Prioritize Forum → Planos → Cursos pages, since they account for 70% of literals.
2. Replace duplicated status colors (chat, notificações, cursos badges) with `--status-{success,error,neutral}` tokens added in Step 1.
3. For palette editors/rank widgets, expose semantic helpers instead of raw swatch arrays so future themes inherit automatically.
4. After refactors, enforce a lint rule (`stylelint-declaration-strict-value` or a custom ESLint plugin) to block new `#xxxxxx` literals outside `docs/color-mapping.md`.
