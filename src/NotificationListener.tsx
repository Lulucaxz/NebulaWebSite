import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { getSocket } from "./socket";
import { ChatMessage } from "./pages/chat/chatData";
import { showAlert } from "./Alert";

function NotificationListener() {
  const location = useLocation();
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
      showAlert(`Nova mensagem em ${title}`);
    };

    socket.on("notification:new-message", handler);

    return () => {
      socket.off("notification:new-message", handler);
    };
  }, [location.pathname]);

  return null;
}

export default NotificationListener;
