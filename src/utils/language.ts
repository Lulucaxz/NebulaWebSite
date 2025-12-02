export type LanguagePreference = "pt-br" | "en-us";

export const normalizeLanguagePreference = (language?: string | null): LanguagePreference => {
  const normalized = (language || "").toLowerCase();
  return normalized.startsWith("en") ? "en-us" : "pt-br";
};

export const toI18nLanguage = (preference: LanguagePreference): "pt" | "en" => {
  return preference === "en-us" ? "en" : "pt";
};
