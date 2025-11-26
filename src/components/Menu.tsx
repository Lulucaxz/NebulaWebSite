import "./menu.css";
import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useTheme } from "../theme/useTheme";
import { useUnread } from "../unreadContext";

interface User {
  idsite: string;
  id: string;
  name: string;
  email: string;
  icon: string; // Alterado de photo para icon
  provider: string;
  prf_user: string;
  tema?: string;
}

export function Menu() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { palette } = useTheme();
  const { chatUnreadTotal, notificationsUnreadTotal, refreshUnread, clearAllUnread } = useUnread();
  const temaClaro = palette.base === "branco";

  useEffect(() => {
    let isMounted = true;

    axios
      .get("http://localhost:4000/auth/me", { withCredentials: true })
      .then((res) => {
        if (!isMounted) return;
        setUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(null);
        setIsAuthenticated(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void refreshUnread();
    } else {
      clearAllUnread();
    }
  }, [isAuthenticated, refreshUnread, clearAllUnread]);

  const getMenuItemClass = (isActive: boolean) =>
    ["menu-icones", temaClaro ? "claro" : "", isActive ? "active" : ""]
      .filter(Boolean)
      .join(" ");

  const menuClassName = useMemo(
    () => ["menu-barra-lateral", temaClaro ? "claro" : ""].filter(Boolean).join(" "),
    [temaClaro]
  );

  const formatBadgeValue = (value: number) => (value > 99 ? "99+" : String(value));
  const chatBadge = chatUnreadTotal > 0 ? formatBadgeValue(chatUnreadTotal) : null;
  const notificationBadge = notificationsUnreadTotal > 0 ? formatBadgeValue(notificationsUnreadTotal) : null;

  return (
    <div className={menuClassName}>
      <div id="menu-principais-icones">
        <NavLink
          to="/perfil"
          className={({ isActive }) => getMenuItemClass(isActive)}
          id="perfil-icone"
        >
          {isAuthenticated ? (
            <img
              id="imgperfil_menu"
              src={user?.icon || "/img/fotoUsuario.png"}
              alt="perfil"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}

          <span className="texto-barra">{t("PERFIL")}</span>
        </NavLink>

        <NavLink
          to="/anotacoes"
          className={({ isActive }) => getMenuItemClass(isActive)}
          id="anotacoes-icone"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
          </svg>

          <span className="texto-barra">{t("ANOTAÇÕES")}</span>
        </NavLink>

        <NavLink
          to="/cursos"
          className={({ isActive }) => getMenuItemClass(isActive)}
          id="cursos-icone"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M300-80q-58 0-99-41t-41-99v-520q0-58 41-99t99-41h500v600q-25 0-42.5 17.5T740-220q0 25 17.5 42.5T800-160v80H300Zm-60-267q14-7 29-10t31-3h20v-440h-20q-25 0-42.5 17.5T240-740v393Zm160-13h320v-440H400v440Zm-160 13v-453 453Zm60 187h373q-6-14-9.5-28.5T660-220q0-16 3-31t10-29H300q-26 0-43 17.5T240-220q0 26 17 43t43 17Z" />
          </svg>

          <span className="texto-barra">{t("CURSOS")}</span>
        </NavLink>

        <NavLink
          to="/forum"
          className={({ isActive }) => getMenuItemClass(isActive)}
          id="forum-icone"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M880-80 720-240H320q-33 0-56.5-23.5T240-320v-40h440q33 0 56.5-23.5T760-440v-280h40q33 0 56.5 23.5T880-640v560ZM160-473l47-47h393v-280H160v327ZM80-280v-520q0-33 23.5-56.5T160-880h440q33 0 56.5 23.5T680-800v280q0 33-23.5 56.5T600-440H240L80-280Zm80-240v-280 280Z" />
          </svg>

          <span className="texto-barra">{t("FÓRUM")}</span>
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) => getMenuItemClass(isActive)}
          id="chat-icone"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M80-160v-560q0-33 23-56.5t57-23.5h640q33 0 56.5 23.5T880-720v400q0 33-23.5 56.5T800-240H240L80-160Zm160-240h480v-80H240v80Zm0-160h480v-80H240v80Z" />
          </svg>

          <span className="texto-barra">{t("CHAT")}</span>
          {chatBadge && (
            <span className="menu-badge" aria-label={t("Novas mensagens")}>{chatBadge}</span>
          )}
        </NavLink>

        <NavLink
          to="/planos"
          className={({ isActive }) => getMenuItemClass(isActive)}
          id="carrinho-icone"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
          </svg>

          <span className="texto-barra">{t("CARRINHO")}</span>
        </NavLink>
      </div>

      <div>
        <NavLink
          to="/notificacoes"
          className={({ isActive }) => getMenuItemClass(isActive)}
          id="notificacoes-icone"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M240-240h480v-280q0-100-70-170t-170-70q-100 0-170 70t-70 170v280Zm240 320q-33 0-56.5-23.5T400-0h160q0 33-23.5 56.5T480 80Zm-320-80v-120h-80v-80h80v-280q0-134 93-227t227-93q134 0 227 93t93 227v280h80v80h-80v120H160Z" />
          </svg>

          <span className="texto-barra">{t("Notificações")}</span>
          {notificationBadge && (
            <span className="menu-badge" aria-label={t("Novas notificações")}>{notificationBadge}</span>
          )}
        </NavLink>

        <NavLink
          to="/"
          end
          className={({ isActive }) => getMenuItemClass(isActive)}
          id="carrinho-icone"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#ffffff"
          >
            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
          </svg>
          <span className="texto-barra">{t("INÍCIO")}</span>
        </NavLink>
      </div>
    </div>
  );
}
