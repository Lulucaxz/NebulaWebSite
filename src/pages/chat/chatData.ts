export interface ConversationSummary {
  id: number;
  name: string;
  tag: string;
  isGroup: boolean;
  participantCount: number;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
}

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  isMine: boolean;
  roomId: number;
}

export interface FollowedUser {
  id: number;
  name: string;
  handle: string;
  tag: string;
}

export interface CreateConversationPayload {
  participantIds: number[];
  name?: string;
}

export type ConversationMessageResponse = ChatMessage[];
