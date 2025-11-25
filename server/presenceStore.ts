const conversationPresence = new Map<number, Map<number, number>>();

const getConversationMap = (conversationId: number) => {
  let users = conversationPresence.get(conversationId);
  if (!users) {
    users = new Map<number, number>();
    conversationPresence.set(conversationId, users);
  }
  return users;
};

export const markUserInConversation = (userId: number, conversationId: number) => {
  const users = getConversationMap(conversationId);
  const current = users.get(userId) ?? 0;
  users.set(userId, current + 1);
};

export const markUserLeftConversation = (userId: number, conversationId: number, count = 1) => {
  if (count <= 0) {
    return;
  }
  const users = conversationPresence.get(conversationId);
  if (!users) {
    return;
  }
  const current = users.get(userId);
  if (!current) {
    return;
  }
  const next = current - count;
  if (next > 0) {
    users.set(userId, next);
  } else {
    users.delete(userId);
  }
  if (users.size === 0) {
    conversationPresence.delete(conversationId);
  }
};

export const clearUserPresence = (userId: number) => {
  for (const [conversationId, users] of conversationPresence.entries()) {
    if (users.delete(userId) && users.size === 0) {
      conversationPresence.delete(conversationId);
    }
  }
};

export const isUserActiveInConversation = (userId: number, conversationId: number) => {
  const users = conversationPresence.get(conversationId);
  return Boolean(users && users.get(userId));
};
