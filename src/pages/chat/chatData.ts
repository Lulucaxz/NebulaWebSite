import type { TFunction } from "i18next";

export interface Conversation {
  id: number;
  title: string;
  tag: string;
  unread: number;
  status: "online" | "away" | "offline";
  statusLabel: string;
  lastMessage: string;
  lastActivity: string;
  participants: number;
  moderators: number;
}

export interface ChatMessage {
  id: number;
  author: string;
  content: string;
  time: string;
  type: "sent" | "received";
}

export interface FollowedUser {
  id: number;
  name: string;
  tag: string;
}

export type CustomMessagesMap = Record<number, ChatMessage[]>;

const CUSTOM_CONVERSATIONS_KEY = "nebula.chat.customConversations";
const CUSTOM_MESSAGES_KEY = "nebula.chat.customMessages";

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readStorage = <T>(key: string, fallback: T): T => {
  if (!isBrowser) {
    return fallback;
  }
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch (error) {
    console.error("Failed to read storage", error);
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T): void => {
  if (!isBrowser) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to write storage", error);
  }
};

export const buildConversations = (t: TFunction): Conversation[] => ([
  {
    id: 1,
    title: t("Sala principal"),
    tag: t("UNIVERSO"),
    unread: 2,
    status: "online",
    statusLabel: t("Ao vivo"),
    lastMessage: t("Equipe Nebula enviou uma atualização do cronograma."),
    lastActivity: "12:24",
    participants: 42,
    moderators: 3
  },
  {
    id: 2,
    title: t("Canal de dúvidas"),
    tag: t("GALÁXIA"),
    unread: 0,
    status: "away",
    statusLabel: t("Plantão de dúvidas"),
    lastMessage: t("Mentor Rafael liberou feedback da atividade 4."),
    lastActivity: "11:02",
    participants: 28,
    moderators: 2
  },
  {
    id: 3,
    title: t("Mentoria avançada"),
    tag: t("ÓRBITA"),
    unread: 5,
    status: "offline",
    statusLabel: t("Preparando material"),
    lastMessage: t("Nova live de revisão agendada para amanhã."),
    lastActivity: t("Ontem"),
    participants: 16,
    moderators: 4
  }
]);

export const buildMessages = (t: TFunction): Record<number, ChatMessage[]> => ({
  1: [
    { id: 11, author: "Sistema Nebula", content: t("Bem-vindo ao canal principal!"), time: "09:10", type: "received" },
    { id: 12, author: "Equipe", content: t("Fique à vontade para compartilhar resultados das atividades."), time: "09:12", type: "received" },
    { id: 13, author: "Ana", content: t("Acabei de finalizar a atividade 3, foi intensa!"), time: "11:41", type: "received" },
    { id: 14, author: "Mentor Hugo", content: t("Carregamos um novo anexo com mapa mental."), time: "12:21", type: "received" },
    { id: 15, author: "Você", content: t("Subi um arquivo de resumo na pasta compartilhada."), time: "12:23", type: "sent" }
  ],
  2: [
    { id: 21, author: "Rafael", content: t("Podemos revisar a dúvida sobre espectroscopia?"), time: "10:37", type: "received" },
    { id: 22, author: "Clara", content: t("Obrigada! vou conferir os ajustes agora."), time: "10:45", type: "received" }
  ],
  3: [
    { id: 31, author: "Mentoria", content: t("Estamos preparando slides extras para a mentoria."), time: t("Ontem"), type: "received" }
  ]
});

export const buildFollowers = (t: TFunction): FollowedUser[] => ([
  { id: 101, name: "Ana Costa", tag: t("UNIVERSO") },
  { id: 102, name: "Rafael Lima", tag: t("GALÁXIA") },
  { id: 103, name: "Clara Menezes", tag: t("ÓRBITA") },
  { id: 104, name: "Yasmin Duarte", tag: t("UNIVERSO") },
  { id: 105, name: "Lucas Prado", tag: t("GALÁXIA") }
]);

export const loadCustomConversations = (): Conversation[] => (
  readStorage<Conversation[]>(CUSTOM_CONVERSATIONS_KEY, [])
);

export const saveCustomConversations = (items: Conversation[]): void => {
  writeStorage(CUSTOM_CONVERSATIONS_KEY, items);
};

export const loadCustomMessages = (): CustomMessagesMap => (
  readStorage<CustomMessagesMap>(CUSTOM_MESSAGES_KEY, {})
);

export const saveCustomMessages = (items: CustomMessagesMap): void => {
  writeStorage(CUSTOM_MESSAGES_KEY, items);
};
