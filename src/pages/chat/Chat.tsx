import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "../../components/Menu";
import "./chat.css";
import { useNavigate } from "react-router-dom";
import { API_BASE, fetchWithCredentials } from "../../api";
import { ConversationSummary, FollowedUser } from "./chatData";

function Chat() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [followers, setFollowers] = useState<FollowedUser[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [followersError, setFollowersError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    setConversationsError(null);
    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/chat/conversations`);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `HTTP ${response.status}`);
      }
      const data: ConversationSummary[] = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
      setConversationsError(t("Não foi possível carregar as conversas."));
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [t]);

  const loadFollowers = useCallback(async () => {
    setLoadingFollowers(true);
    setFollowersError(null);
    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/chat/following`);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `HTTP ${response.status}`);
      }
      const data: FollowedUser[] = await response.json();
      setFollowers(data);
    } catch (error) {
      console.error("Failed to fetch followers", error);
      setFollowersError(t("Não foi possível carregar seus contatos."));
      setFollowers([]);
    } finally {
      setLoadingFollowers(false);
    }
  }, [t]);

  useEffect(() => {
    void loadConversations();
    void loadFollowers();
  }, [loadConversations, loadFollowers]);

  useEffect(() => {
    if (conversations.length === 0) {
      setSelectedConversationId(null);
      return;
    }
    const exists = selectedConversationId !== null && conversations.some((conversation) => conversation.id === selectedConversationId);
    if (!exists) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return conversations;
    }
    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(term) ||
      conversation.tag.toLowerCase().includes(term) ||
      (conversation.lastMessagePreview ?? "").toLowerCase().includes(term)
    );
  }, [conversations, search]);

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
    setCreateError(null);
  };

  const selectedCount = selectedUserIds.length;
  const isGroup = selectedCount > 1;
  const trimmedGroupName = groupName.trim();
  const isCreateDisabled = selectedCount === 0 || (isGroup && trimmedGroupName.length === 0) || isCreatingConversation;

  const formatLastActivity = (value: string | null) => {
    if (!value) {
      return t("Sem mensagens recentes");
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit"
    }).format(date);
  };

  const handleCreateConversation = async () => {
    if (isCreateDisabled) {
      return;
    }

    setIsCreatingConversation(true);
    setCreateError(null);
    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantIds: selectedUserIds,
          name: isGroup ? trimmedGroupName : undefined
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? t("Não foi possível criar a conversa."));
      }

      const created: ConversationSummary = await response.json();
      await loadConversations();
      closeCreateModal();
      setSelectedConversationId(created.id);
      navigate(`/chat/${created.id}`);
    } catch (error) {
      console.error("Failed to create conversation", error);
      setCreateError(error instanceof Error ? error.message : t("Não foi possível criar a conversa."));
    } finally {
      setIsCreatingConversation(false);
    }
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
            {loadingConversations && (
              <div className="chat-empty-list">{t("Carregando conversas...")}</div>
            )}
            {!loadingConversations && conversationsError && (
              <div className="chat-empty-list">{conversationsError}</div>
            )}
            {!loadingConversations && !conversationsError && filteredConversations.length === 0 && (
              <div className="chat-empty-list">{t("Nenhum canal encontrado.")}</div>
            )}
            {!loadingConversations && !conversationsError && filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`chat-conversation ${conversation.id === selectedConversationId ? "active" : ""}`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="chat-conversation-header">
                  <strong>{conversation.name}</strong>
                  {!conversation.isGroup && (
                    <span className="chat-conversation-tag">{t("Chat privado")}</span>
                  )}
                </div>
                <p className="chat-conversation-preview">
                  {conversation.lastMessagePreview ?? t("Conversa iniciada agora.")}
                </p>
                <small className="chat-conversation-meta">{formatLastActivity(conversation.lastMessageAt)}</small>
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
                  {loadingFollowers && <div className="chat-modal-empty">{t("Carregando seguidores...")}</div>}
                  {!loadingFollowers && followersError && <div className="chat-modal-empty">{followersError}</div>}
                  {!loadingFollowers && !followersError && followers.length === 0 && (
                    <div className="chat-modal-empty">{t("Nenhum seguidor disponível.")}</div>
                  )}
                  {!loadingFollowers && !followersError && followers.map((user) => {
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
                {createError && <p className="chat-modal-error">{createError}</p>}
              </div>
              <div className="chat-modal-footer">
                <button type="button" className="chat-modal-secondary" onClick={closeCreateModal}>
                  {t("Cancelar")}
                </button>
                <button type="button" className="chat-modal-primary" disabled={isCreateDisabled} onClick={handleCreateConversation}>
                  {isCreatingConversation ? t("Criando...") : t("Criar")}
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
