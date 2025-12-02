import type { TFunction } from "i18next";

export const normalizeForumTag = (tag?: string | null): string => {
  return (tag ?? "").trim();
};

export const translateForumTag = (tag: string, t: TFunction, fallback?: string): string => {
  const normalizedTag = normalizeForumTag(tag);
  const resolvedFallback = fallback ?? tag ?? "";

  if (!normalizedTag) {
    return resolvedFallback;
  }

  const nestedKey = `forum.tags.${normalizedTag}`;
  const nestedTranslation = t(nestedKey);
  if (nestedTranslation !== nestedKey) {
    return nestedTranslation;
  }

  return t(normalizedTag, { defaultValue: resolvedFallback });
};
