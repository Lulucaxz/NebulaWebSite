import { AssinaturaSlug } from './assinaturaAccess';

export type EffectivePlan = AssinaturaSlug | 'none';

export type PageAccessKey =
  | 'home'
  | 'perfil'
  | 'perfil2'
  | 'planos'
  | 'anotacoes'
  | 'cursos'
  | 'modulos'
  | 'atividades'
  | 'forum'
  | 'chat'
  | 'chatConversation'
  | 'notificacoes'
  | 'configuracoes'
  | 'professor';

const EFFECTIVE_PLAN_ORDER: EffectivePlan[] = ['none', 'orbita', 'galaxia', 'universo'];

const PAGE_ACCESS_MATRIX: Record<PageAccessKey, EffectivePlan[]> = {
  home: EFFECTIVE_PLAN_ORDER,
  perfil: EFFECTIVE_PLAN_ORDER,
  perfil2: EFFECTIVE_PLAN_ORDER,
  planos: EFFECTIVE_PLAN_ORDER,
  anotacoes: ['orbita', 'galaxia', 'universo'],
  cursos: ['orbita', 'galaxia', 'universo'],
  modulos: ['orbita', 'galaxia', 'universo'],
  atividades: ['orbita', 'galaxia', 'universo'],
  forum: ['galaxia', 'universo'],
  chat: ['galaxia', 'universo'],
  chatConversation: ['galaxia', 'universo'],
  notificacoes: ['galaxia', 'universo'],
  configuracoes: ['orbita', 'galaxia', 'universo'],
  professor: ['orbita', 'galaxia', 'universo'],
};

const PAGE_LABEL_KEY: Record<PageAccessKey, string> = {
  home: 'access.pages.home',
  perfil: 'access.pages.perfil',
  perfil2: 'access.pages.perfil2',
  planos: 'access.pages.planos',
  anotacoes: 'access.pages.anotacoes',
  cursos: 'access.pages.cursos',
  modulos: 'access.pages.modulos',
  atividades: 'access.pages.atividades',
  forum: 'access.pages.forum',
  chat: 'access.pages.chat',
  chatConversation: 'access.pages.chatConversation',
  notificacoes: 'access.pages.notificacoes',
  configuracoes: 'access.pages.configuracoes',
  professor: 'access.pages.professor',
};

const PLAN_LABEL_KEY: Record<EffectivePlan, string> = {
  none: 'access.plans.none',
  orbita: 'access.plans.orbita',
  galaxia: 'access.plans.galaxia',
  universo: 'access.plans.universo',
};

export const resolveEffectivePlan = (planSlug?: AssinaturaSlug | null): EffectivePlan =>
  planSlug ?? 'none';

export const hasAccessToPage = (
  planSlug: AssinaturaSlug | null | undefined,
  page: PageAccessKey,
): boolean => {
  const effectivePlan = resolveEffectivePlan(planSlug);
  const allowedPlans = PAGE_ACCESS_MATRIX[page];
  return allowedPlans.includes(effectivePlan);
};

export const getPageLabelKey = (page: PageAccessKey): string => PAGE_LABEL_KEY[page];

export const getPlanLabelKey = (planSlug?: AssinaturaSlug | null): string =>
  PLAN_LABEL_KEY[resolveEffectivePlan(planSlug)];

export const getRestrictedPagesForPlan = (planSlug?: AssinaturaSlug | null): PageAccessKey[] => {
  const effectivePlan = resolveEffectivePlan(planSlug);
  return (Object.keys(PAGE_ACCESS_MATRIX) as PageAccessKey[]).filter((page) => {
    const allowedPlans = PAGE_ACCESS_MATRIX[page];
    return !allowedPlans.includes(effectivePlan);
  });
};
