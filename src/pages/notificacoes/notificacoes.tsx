import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "../../components/Menu";
import "./notificacoes.css";
import { API_BASE, fetchWithCredentials } from "../../api";
import { ChatMessage } from "../chat/chatData";
import { getSocket } from "../../socket";

interface NotificationEntry {
  notificationId?: number;
  messageId: number;
  conversationId: number;
  conversationName: string;
  authorName: string;
  content: string;
  createdAt: string;
}

function Notificacoes() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatTime = useCallback((value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat(undefined, {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/chat/notifications`);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? t("Não foi possível carregar as notificações."));
      }
      const data = await response.json() as Array<{
        id: number;
        messageId: number;
        conversationId: number;
        conversationName: string;
        authorName: string;
        content: string;
        createdAt: string;
      }>;

      setNotifications(
        data.map((item) => ({
          notificationId: item.id,
          messageId: item.messageId,
          conversationId: item.conversationId,
          conversationName: item.conversationName,
          authorName: item.authorName,
          content: item.content,
          createdAt: item.createdAt,
        }))
      );
    } catch (err) {
      console.error("Failed to load notifications", err);
      setError(err instanceof Error ? err.message : t("Não foi possível carregar as notificações."));
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const socket = getSocket();
    const handler = (message: ChatMessage) => {
      const entry: NotificationEntry = {
        notificationId: message.notificationId,
        messageId: message.id,
        conversationId: message.roomId,
        conversationName: message.conversationName ?? message.authorName,
        authorName: message.authorName,
        content: message.content,
        createdAt: message.createdAt,
      };
      setNotifications((prev) => {
        if (prev.some((item) => item.messageId === entry.messageId)) {
          return prev;
        }
        return [entry, ...prev].slice(0, 25);
      });
    };

    socket.on("notification:new-message", handler);

    return () => {
      socket.off("notification:new-message", handler);
    };
  }, []);

  const handleClear = async () => {
    if (!notifications.length || clearing) {
      return;
    }

    setClearing(true);
    setError(null);
    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/chat/notifications/clear`, {
        method: "POST",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? t("Não foi possível limpar as notificações."));
      }
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
      setError(err instanceof Error ? err.message : t("Não foi possível limpar as notificações."));
    } finally {
      setClearing(false);
    }
  };

  const renderedNotifications = useMemo(
    () =>
      notifications.map((item) => {
        const createdTime = new Date(item.createdAt).getTime();
        const isRecent = Number.isFinite(createdTime) ? (Date.now() - createdTime) <= 5 * 60 * 1000 : false;
        return {
          ...item,
          time: formatTime(item.createdAt),
          isRecent,
        };
      }),
    [notifications, formatTime]
  );

  return (
    <>
      <Menu />
      <div className="notifications-fullscreen">
        <section className="notifications-panel" aria-live="polite">
          <header className="notifications-header">
            <div>
              <h1>{t("Notificações")}</h1>
            </div>
            <button
              type="button"
              className="notifications-clean"
              aria-label={t("Limpar notificações")}
              onClick={handleClear}
              disabled={!renderedNotifications.length || clearing}
            >
              {t("Limpar tudo")}
            </button>
          </header>

          <div className="notifications-list" role="list">
            {loading && (
              <div className="notifications-empty">{t("Carregando notificações...")}</div>
            )}
            {!loading && error && (
              <div className="notifications-empty">{error}</div>
            )}
            {!loading && !error && renderedNotifications.length === 0 && (
              <div className="notifications-empty">
                <strong>{t("Nenhuma notificação por aqui.")}</strong>
              </div>
            )}
            {!loading && !error && renderedNotifications.map((item) => (
              <article
                key={item.notificationId ?? item.messageId}
                className={`notification-card notification-card--chat ${item.isRecent ? "is-new" : ""}`}
                role="listitem"
              >
                <div className="notification-card-pill">
                  <span>{t("Chat")}</span>
                </div>
                <div className="notification-card-content">
                  <div className="notification-card-header">
                    <strong>{item.conversationName}</strong>
                    {item.isRecent && <span className="notification-dot" aria-label={t("Nova notificacão")}></span>}
                  </div>
                  <p>
                    <strong>{item.authorName}</strong>: {item.content}
                  </p>
                  <small>{item.time}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Notificacoes;
