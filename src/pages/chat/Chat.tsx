import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "../../components/Menu";
import "./chat.css";
import { useNavigate } from "react-router-dom";
import {
  buildConversations,
  buildFollowers,
  loadCustomConversations,
  saveCustomConversations,
  loadCustomMessages,
  saveCustomMessages,
  type Conversation
} from "./chatData";

function Chat() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const baseConversations = useMemo(() => buildConversations(t), [t]);
  const followers = useMemo(() => buildFollowers(t), [t]);
  const [customConversations, setCustomConversations] = useState<Conversation[]>(() => loadCustomConversations());
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");

  const allConversations = useMemo(() => [...customConversations, ...baseConversations], [customConversations, baseConversations]);

  useEffect(() => {
    if (allConversations.length === 0) {
      setSelectedConversationId(null);
      return;
    }
    const exists = selectedConversationId !== null && allConversations.some((conversation) => conversation.id === selectedConversationId);
    if (!exists) {
      setSelectedConversationId(allConversations[0].id);
    }
  }, [allConversations, selectedConversationId]);

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return allConversations;
    }
    return allConversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(term) ||
      conversation.tag.toLowerCase().includes(term) ||
      conversation.lastMessage.toLowerCase().includes(term)
    );
  }, [allConversations, search]);

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    navigate(`/chat/${conversationId}`);
  };

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedUserIds([]);
    setGroupName("");
  };

  const selectedCount = selectedUserIds.length;
  const isGroup = selectedCount > 1;
  const isCreateDisabled = selectedCount === 0 || (isGroup && groupName.trim().length === 0);

  const handleCreateConversation = () => {
    if (isCreateDisabled) {
      return;
    }

    const participants = followers.filter((follower) => selectedUserIds.includes(follower.id));
    const now = Date.now();
    const newConversation: Conversation = {
      id: now,
      title: isGroup ? groupName.trim() : participants[0]?.name ?? t("Nova conversa"),
      tag: isGroup ? t("GRUPO") : participants[0]?.tag ?? t("UNIVERSO"),
      unread: 0,
      status: "online",
      statusLabel: t("Ao vivo"),
      lastMessage: t("Conversa iniciada agora."),
      lastActivity: t("Agora"),
      participants: selectedCount + 1,
      moderators: 1
    };

    setCustomConversations((prev) => {
      const updated = [newConversation, ...prev];
      saveCustomConversations(updated);
      return updated;
    });

    const existingMessages = loadCustomMessages();
    saveCustomMessages({
      ...existingMessages,
      [newConversation.id]: []
    });

    closeCreateModal();
    setSelectedConversationId(newConversation.id);
    navigate(`/chat/${newConversation.id}`);
  };

  return (
    <>
      <Menu />
      <div className="chat-fullscreen chat-fullscreen--with-menu">
        <aside className="chat-sidebar chat-panel chat-panel--full" aria-label={t("CHAT")}>
          <div className="chat-sidebar-search">
            <input
              type="text"
              placeholder={t("Pesquisar conversas...")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              type="button"
              className="chat-search-action"
              aria-label={t("Criar canal")}
              onClick={() => setIsCreateModalOpen(true)}
            >
              +
            </button>
          </div>
          <div className="chat-conversation-list chat-conversation-list--grow">
            {filteredConversations.length === 0 && (
              <div className="chat-empty-list">{t("Nenhum canal encontrado.")}</div>
            )}
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`chat-conversation ${conversation.id === selectedConversationId ? "active" : ""}`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="chat-conversation-header">
                  <strong>{conversation.title}</strong>
                  {conversation.unread > 0 && <span className="chat-badge">{conversation.unread}</span>}
                </div>
                <p className="chat-conversation-preview">{conversation.lastMessage}</p>
              </button>
            ))}
          </div>
        </aside>
        {isCreateModalOpen && (
          <div className="chat-modal-backdrop" role="dialog" aria-modal="true" aria-label={t("Criar nova conversa")}>
            <div className="chat-modal">
              <header className="chat-modal-header">
                <h2>{t("Criar nova conversa")}</h2>
                <button type="button" className="chat-modal-close" onClick={closeCreateModal} aria-label={t("Cancelar")}>×</button>
              </header>
              <div className="chat-modal-body">
                <p className="chat-modal-hint">{t("Selecione participantes")}</p>
                <div className="chat-modal-list">
                  {followers.length === 0 && (
                    <div className="chat-modal-empty">{t("Nenhum seguidor disponível.")}</div>
                  )}
                  {followers.map((user) => {
                    const isSelected = selectedUserIds.includes(user.id);
                    return (
                      <label key={user.id} className={`chat-modal-user ${isSelected ? "selected" : ""}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleUser(user.id)}
                        />
                        <span>
                          <strong>{user.name}</strong>
                          <small>{user.tag}</small>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {isGroup && (
                  <div className="chat-modal-group-name">
                    <label htmlFor="chat-group-name">{t("Nome do grupo")}</label>
                    <input
                      id="chat-group-name"
                      type="text"
                      value={groupName}
                      onChange={(event) => setGroupName(event.target.value)}
                      placeholder={t("Digite o nome do grupo")}
                    />
                  </div>
                )}
              </div>
              <div className="chat-modal-footer">
                <button type="button" className="chat-modal-secondary" onClick={closeCreateModal}>
                  {t("Cancelar")}
                </button>
                <button type="button" className="chat-modal-primary" disabled={isCreateDisabled} onClick={handleCreateConversation}>
                  {t("Criar")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
