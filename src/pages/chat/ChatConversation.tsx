import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "../../components/Menu";
import "./chat.css";
import { API_BASE, fetchWithCredentials } from "../../api";
import { ChatMessage, ConversationSummary } from "./chatData";
import { io as createSocket, Socket } from "socket.io-client";

interface AuthUserResponse {
  id?: number | string;
}

function ChatConversation() {
  const { chatId } = useParams();
  const conversationId = Number(chatId);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ConversationSummary | null>(null);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const hasAutoScrolledRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  const isInvalidConversation = Number.isNaN(conversationId);

  const formatMessageTime = useCallback((value: string) => {
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

  const loadConversation = useCallback(async () => {
    if (isInvalidConversation) {
      return;
    }
    setLoadingConversation(true);
    setConversationError(null);
    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/chat/conversations/${conversationId}`);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `HTTP ${response.status}`);
      }
      const data: ConversationSummary = await response.json();
      setConversation(data);
    } catch (error) {
      console.error("Failed to load conversation", error);
      setConversation(null);
      setConversationError(error instanceof Error ? error.message : t("Conversa não encontrada."));
    } finally {
      setLoadingConversation(false);
    }
  }, [conversationId, isInvalidConversation, t]);

  const loadMessages = useCallback(async () => {
    if (isInvalidConversation) {
      return;
    }
    setLoadingMessages(true);
    setMessagesError(null);
    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/chat/conversations/${conversationId}/messages`);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `HTTP ${response.status}`);
      }
      const data: ChatMessage[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages", error);
      setMessages([]);
      setMessagesError(error instanceof Error ? error.message : t("Não foi possível carregar as mensagens."));
    } finally {
      setLoadingMessages(false);
    }
  }, [conversationId, isInvalidConversation, t]);

  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const socket = createSocket(API_BASE, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error", error);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isInvalidConversation || !conversationId) {
      return;
    }
    const socket = socketRef.current;
    if (!socket) {
      return;
    }
    const payload = { conversationId };
    socket.emit("chat:join", payload);

    return () => {
      socket.emit("chat:leave", payload);
    };
  }, [conversationId, isInvalidConversation]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    const handleNewMessage = (incoming: ChatMessage) => {
      if (incoming.roomId !== conversationId) {
        return;
      }
      setMessages((prev) => {
        if (prev.some((existing) => existing.id === incoming.id)) {
          return prev;
        }
        return [...prev, incoming];
      });
    };

    socket.on("chat:new-message", handleNewMessage);

    return () => {
      socket.off("chat:new-message", handleNewMessage);
    };
  }, [conversationId]);

  useEffect(() => {
    hasAutoScrolledRef.current = false;
  }, [conversationId]);
  useEffect(() => {
    let cancelled = false;
    const loadCurrentUser = async () => {
      try {
        const response = await fetchWithCredentials(`${API_BASE}/auth/me`);
        if (!response.ok) {
          return;
        }
        const data: AuthUserResponse = await response.json();
        const parsedId = Number(data?.id);
        if (!cancelled) {
          setCurrentUserId(Number.isFinite(parsedId) ? parsedId : null);
        }
      } catch (error) {
        console.error("Failed to load current user", error);
        if (!cancelled) {
          setCurrentUserId(null);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollMessagesToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }
    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior });
    });
  }, []);

  useEffect(() => {
    if (loadingMessages) {
      return;
    }
    const behavior: ScrollBehavior = hasAutoScrolledRef.current ? "smooth" : "auto";
    scrollMessagesToBottom(behavior);
    hasAutoScrolledRef.current = true;
  }, [messages, loadingMessages, scrollMessagesToBottom]);

  const handleBackToList = () => navigate("/chat");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversation || isInvalidConversation) {
      return;
    }
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }
    setSendingMessage(true);
    setMessagesError(null);
    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/chat/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? t("Não foi possível enviar a mensagem."));
      }
      const created: ChatMessage = await response.json();
      setMessages((prev) => {
        if (prev.some((item) => item.id === created.id)) {
          return prev;
        }
        return [...prev, created];
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
      setMessagesError(error instanceof Error ? error.message : t("Não foi possível enviar a mensagem."));
    } finally {
      setSendingMessage(false);
    }
  };

  const conversationTitle = conversation?.name ?? t("Conversa");
  const conversationTag = conversation
    ? (conversation.isGroup ? (conversation.tag || t("Grupo")) : t("Chat privado"))
    : "";
  const participantCount = conversation?.participantCount ?? 0;

  const shouldShowFallback = isInvalidConversation || (!!conversationError && !loadingConversation);
  const fallbackMessage = isInvalidConversation ? t("Conversa não encontrada.") : conversationError ?? t("Conversa não encontrada.");

  if (shouldShowFallback) {
    return (
      <>
        <Menu />
        <div className="chat-fullscreen chat-fullscreen--with-menu">
          <section className="chat-panel chat-panel--full chat-room-empty">
            <button type="button" className="chat-back-button" onClick={handleBackToList}>
              {t("Voltar para conversas")}
            </button>
            <div className="chat-empty-messages">
              <strong>{fallbackMessage}</strong>
              <span>{t("Selecione um canal para começar.")}</span>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <div className="chat-fullscreen chat-fullscreen--with-menu">
        <section className="chat-panel chat-panel--full chat-room" aria-live="polite">
          <button type="button" className="chat-back-button" onClick={handleBackToList}>
            {t("Voltar para conversas")}
          </button>

          <header className="chat-room-header">
            <div className="chat-room-title">
              <span className="chat-room-tag">{conversationTag}</span>
              <h1>{conversationTitle}</h1>
            </div>
            <div className="chat-room-meta">
              <div>
                <span>{t("Integrantes")}</span>
                <strong>{participantCount}</strong>
              </div>
            </div>
          </header>

          <div className="chat-messages" ref={messagesContainerRef}>
            {(loadingConversation || loadingMessages) && (
              <div className="chat-empty-messages">
                <strong>{t("Carregando...")}</strong>
              </div>
            )}
            {!loadingMessages && messagesError && (
              <div className="chat-empty-messages">
                <strong>{messagesError}</strong>
              </div>
            )}
            {!loadingMessages && !messagesError && messages.length === 0 && (
              <div className="chat-empty-messages">
                <strong>{t("Nenhuma mensagem por aqui ainda.")}</strong>
                <span>{t("Compartilhe insights sobre sua rotina de estudos e incentive a tripulação!")}</span>
              </div>
            )}
            {!loadingMessages && !messagesError && messages.map((item) => {
              const isMine = currentUserId !== null
                ? item.authorId === currentUserId
                : Boolean(item.isMine);
              const variant = isMine ? "sent" : "received";
              return (
                <div key={item.id} className={`chat-message ${variant}`}>
                  <div className="chat-message-author">
                    <span>{isMine ? t("Você") : item.authorName}</span>
                    <span>{formatMessageTime(item.createdAt)}</span>
                  </div>
                  <p>{item.content}</p>
                </div>
              );
            })}
          </div>

          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={t("Digite sua mensagem...")}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={sendingMessage}
            />
            <button type="submit" disabled={sendingMessage}>
              {sendingMessage ? t("Enviando...") : t("Enviar")}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

export default ChatConversation;
