import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { API_BASE, fetchWithCredentials } from "./api";

interface ConversationUnreadEntry {
  conversationId: number;
  unreadCount: number;
}

interface RefreshSnapshot {
  conversations?: ConversationUnreadEntry[];
  notificationsTotal?: number;
}

interface UnreadContextValue {
  conversationUnread: Record<number, number>;
  chatUnreadTotal: number;
  notificationsUnreadTotal: number;
  refreshUnread: (snapshot?: RefreshSnapshot) => Promise<void>;
  incrementConversationUnread: (conversationId: number, amount?: number) => void;
  markConversationRead: (conversationId: number) => void;
  setNotificationsUnreadTotal: (total: number) => void;
  incrementNotificationsUnread: (amount?: number) => void;
  clearNotificationsUnread: () => void;
  clearAllUnread: () => void;
}

const UnreadContext = createContext<UnreadContextValue | undefined>(undefined);

export const useUnread = () => {
  const context = useContext(UnreadContext);
  if (!context) {
    throw new Error("useUnread must be used within an UnreadProvider");
  }
  return context;
};

export const UnreadProvider = ({ children }: { children: ReactNode }) => {
  const [conversationUnread, setConversationUnread] = useState<Record<number, number>>({});
  const [notificationsUnreadTotal, setNotificationsUnreadTotal] = useState(0);

  const applyConversationSnapshot = useCallback((entries: ConversationUnreadEntry[] = []) => {
    setConversationUnread(() => {
      if (entries.length === 0) {
        return {};
      }
      const next: Record<number, number> = {};
      for (const entry of entries) {
        const conversationId = Number(entry.conversationId);
        const unreadCount = Number(entry.unreadCount);
        if (!Number.isFinite(conversationId) || conversationId <= 0) {
          continue;
        }
        const normalizedCount = Number.isFinite(unreadCount) ? unreadCount : 0;
        if (normalizedCount > 0) {
          next[conversationId] = normalizedCount;
        }
      }
      return next;
    });
  }, []);

  const applyNotificationsTotal = useCallback((total: number) => {
    const normalized = Number(total);
    if (!Number.isFinite(normalized) || normalized <= 0) {
      setNotificationsUnreadTotal(0);
      return;
    }
    setNotificationsUnreadTotal(Math.floor(normalized));
  }, []);

  const refreshUnread = useCallback(async (snapshot?: RefreshSnapshot) => {
    if (snapshot) {
      if (snapshot.conversations) {
        applyConversationSnapshot(snapshot.conversations);
      }
      if (Object.prototype.hasOwnProperty.call(snapshot, "notificationsTotal") && snapshot.notificationsTotal !== undefined) {
        applyNotificationsTotal(snapshot.notificationsTotal);
      }
      return;
    }

    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/chat/unread`);
      if (!response.ok) {
        if (response.status === 401) {
          applyConversationSnapshot([]);
          applyNotificationsTotal(0);
          return;
        }
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `HTTP ${response.status}`);
      }
      const data = await response.json() as { conversations?: ConversationUnreadEntry[]; notificationsTotal?: number };
      applyConversationSnapshot(data.conversations ?? []);
      if (Object.prototype.hasOwnProperty.call(data, "notificationsTotal") && data.notificationsTotal !== undefined) {
        applyNotificationsTotal(data.notificationsTotal);
      }
    } catch (error) {
      console.error("Failed to refresh unread counters", error);
    }
  }, [applyConversationSnapshot, applyNotificationsTotal]);

  useEffect(() => {
    void refreshUnread();
  }, [refreshUnread]);

  const incrementConversationUnread = useCallback((conversationId: number, amount = 1) => {
    const normalizedId = Number(conversationId);
    const normalizedAmount = Number(amount);
    if (!Number.isFinite(normalizedId) || normalizedId <= 0 || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return;
    }
    setConversationUnread((prev) => {
      const next = { ...prev };
      next[normalizedId] = (next[normalizedId] ?? 0) + normalizedAmount;
      return next;
    });
  }, []);

  const markConversationRead = useCallback((conversationId: number) => {
    const normalizedId = Number(conversationId);
    if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
      return;
    }
    setConversationUnread((prev) => {
      if (!prev[normalizedId]) {
        return prev;
      }
      const next = { ...prev };
      delete next[normalizedId];
      return next;
    });
  }, []);

  const clearAllUnread = useCallback(() => {
    setConversationUnread({});
    setNotificationsUnreadTotal(0);
  }, []);

  const setNotificationsUnreadTotalSafe = useCallback((total: number) => {
    applyNotificationsTotal(total);
  }, [applyNotificationsTotal]);

  const incrementNotificationsUnread = useCallback((amount = 1) => {
    const normalized = Number(amount);
    if (!Number.isFinite(normalized) || normalized <= 0) {
      return;
    }
    setNotificationsUnreadTotal((prev) => prev + Math.floor(normalized));
  }, []);

  const clearNotificationsUnread = useCallback(() => {
    setNotificationsUnreadTotal(0);
  }, []);

  const chatUnreadTotal = useMemo(() =>
    Object.values(conversationUnread).reduce((sum, value) => sum + value, 0),
  [conversationUnread]);

  const value: UnreadContextValue = useMemo(() => ({
    conversationUnread,
    chatUnreadTotal,
    notificationsUnreadTotal,
    refreshUnread,
    incrementConversationUnread,
    markConversationRead,
    setNotificationsUnreadTotal: setNotificationsUnreadTotalSafe,
    incrementNotificationsUnread,
    clearNotificationsUnread,
    clearAllUnread,
  }), [conversationUnread, chatUnreadTotal, notificationsUnreadTotal, refreshUnread, incrementConversationUnread, markConversationRead, setNotificationsUnreadTotalSafe, incrementNotificationsUnread, clearNotificationsUnread, clearAllUnread]);

  return (
    <UnreadContext.Provider value={value}>
      {children}
    </UnreadContext.Provider>
  );
};
