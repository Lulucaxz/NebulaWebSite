import { useContext } from "react";
import { ThemeContextRef } from "./ThemeProvider";

export type { ThemeContextValue, ThemePalette, ThemeBase, SavedPalette } from "./ThemeProvider";

export const useTheme = () => {
  const ctx = useContext(ThemeContextRef);
  if (!ctx) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return ctx;
};
