import { useEffect, useRef } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { getSocket } from "./socket";
import { ChatMessage } from "./pages/chat/chatData";
import { showAlert } from "./Alert";
import { useUnread } from "./unreadContext";

function NotificationListener() {
  const location = useLocation();
  const { incrementConversationUnread, incrementNotificationsUnread } = useUnread();
  const seenNotificationIdsRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    const socket = getSocket();

    const handler = (message: ChatMessage & { conversationName?: string }) => {
      const match = matchPath({ path: "/chat/:chatId" }, location.pathname);
      const activeChatId = match?.params?.chatId ? Number(match.params.chatId) : null;
      const viewingConversation = Number.isFinite(activeChatId) && activeChatId === message.roomId;

      if (viewingConversation || message.isMine) {
        return;
      }

      const title = message.conversationName ?? message.authorName;
      const notificationId = Number(message.notificationId);
      if (Number.isFinite(notificationId)) {
        const seenNotifications = seenNotificationIdsRef.current;
        if (seenNotifications.has(notificationId)) {
          return;
        }
        seenNotifications.add(notificationId);
        if (seenNotifications.size > 500) {
          const oldest = seenNotifications.values().next().value;
          if (typeof oldest === "number") {
            seenNotifications.delete(oldest);
          }
        }
      }

      incrementConversationUnread(message.roomId);
      incrementNotificationsUnread();
      showAlert(`Nova mensagem em ${title}`);
    };

    socket.on("notification:new-message", handler);

    return () => {
      socket.off("notification:new-message", handler);
    };
  }, [incrementConversationUnread, incrementNotificationsUnread, location.pathname]);

  return null;
}

export default NotificationListener;
