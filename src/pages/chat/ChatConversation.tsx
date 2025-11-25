import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "../../components/Menu";
import "./chat.css";
import {
  buildConversations,
  buildMessages,
  loadCustomConversations,
  loadCustomMessages,
  saveCustomMessages,
  type Conversation,
  type CustomMessagesMap
} from "./chatData";

function ChatConversation() {
  const { chatId } = useParams();
  const conversationId = Number(chatId);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const baseConversations = useMemo(() => buildConversations(t), [t]);
  const [customConversations, setCustomConversations] = useState<Conversation[]>(() => loadCustomConversations());
  const [customMessages, setCustomMessages] = useState<CustomMessagesMap>(() => loadCustomMessages());

  useEffect(() => {
    setCustomConversations(loadCustomConversations());
    setCustomMessages(loadCustomMessages());
  }, [chatId]);

  const conversation = useMemo(() => {
    const merged = [...customConversations, ...baseConversations];
    return merged.find((item) => item.id === conversationId) ?? null;
  }, [customConversations, baseConversations, conversationId]);

  const messagesByConversation = useMemo(() => buildMessages(t), [t]);
  const isCustomConversation = conversation ? customConversations.some((item) => item.id === conversation.id) : false;
  const messages = conversation
    ? (isCustomConversation ? customMessages[conversation.id] ?? [] : messagesByConversation[conversation.id] ?? [])
    : [];

  const handleBackToList = () => navigate("/chat");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversation) {
      return;
    }
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }
    if (isCustomConversation) {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newMessage = { id: Date.now(), author: t("Você"), content: trimmed, time, type: "sent" as const };
      setCustomMessages((prev) => {
        const updates = { ...prev, [conversation.id]: [...(prev[conversation.id] ?? []), newMessage] };
        saveCustomMessages(updates);
        return updates;
      });
    }
    setMessage("");
  };

  if (!conversation || Number.isNaN(conversationId)) {
    return (
      <>
        <Menu />
        <div className="chat-fullscreen chat-fullscreen--with-menu">
          <section className="chat-panel chat-panel--full chat-room-empty">
            <button type="button" className="chat-back-button" onClick={handleBackToList}>
              {t("Voltar para conversas")}
            </button>
            <div className="chat-empty-messages">
              <strong>{t("Conversa não encontrada.")}</strong>
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
              <span className="chat-room-tag">{conversation.tag}</span>
              <h1>{conversation.title}</h1>
            </div>
            <div className="chat-room-meta">
              <div>
                <span>{t("Integrantes")}</span>
                <strong>{conversation.participants}</strong>
              </div>
              <div>
                <span>{t("Moderadores")}</span>
                <strong>{conversation.moderators}</strong>
              </div>
            </div>
          </header>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty-messages">
                <strong>{t("Nenhuma mensagem por aqui ainda.")}</strong>
                <span>{t("Compartilhe insights sobre sua rotina de estudos e incentive a tripulação!")}</span>
              </div>
            )}
            {messages.map((item) => (
              <div key={item.id} className={`chat-message ${item.type}`}>
                <div className="chat-message-author">
                  <span>{item.author}</span>
                  <span>{item.time}</span>
                </div>
                <p>{item.content}</p>
              </div>
            ))}
          </div>

          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={t("Digite sua mensagem...")}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button type="submit">{t("Enviar")}</button>
          </form>
        </section>
      </div>
    </>
  );
}

export default ChatConversation;
