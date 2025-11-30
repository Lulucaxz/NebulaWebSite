export type AssinaturaSlug = 'orbita' | 'galaxia' | 'universo';

const removeDiacritics = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const ASSINATURA_LABEL_BY_SLUG: Record<AssinaturaSlug, string> = {
  orbita: 'Órbita',
  galaxia: 'Galáxia',
  universo: 'Universo',
};

export const allowedAssinaturasByPlan: Record<AssinaturaSlug, AssinaturaSlug[]> = {
  orbita: ['orbita'],
  galaxia: ['galaxia', 'orbita'],
  universo: ['universo', 'galaxia', 'orbita'],
};

export const normalizeAssinaturaValue = (value?: string | null): AssinaturaSlug | null => {
  if (!value) {
    return null;
  }

  const normalized = removeDiacritics(String(value));

  if ((['orbita', 'galaxia', 'universo'] as const).includes(normalized as AssinaturaSlug)) {
    return normalized as AssinaturaSlug;
  }

  // Try matching against the known labels (e.g., "Órbita", "Galáxia", ...)
  const matchingEntry = (Object.entries(ASSINATURA_LABEL_BY_SLUG) as Array<[AssinaturaSlug, string]>)
    .find(([, label]) => removeDiacritics(label) === normalized);

  return matchingEntry ? matchingEntry[0] : null;
};

export const hasAccessToAssinatura = (
  userPlan: AssinaturaSlug | null | undefined,
  targetAssinatura: AssinaturaSlug,
): boolean => {
  if (!userPlan) {
    return false;
  }
  return allowedAssinaturasByPlan[userPlan].includes(targetAssinatura);
};
