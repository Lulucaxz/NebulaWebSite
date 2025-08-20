import "./menu.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  idsite: string;
  id: string;
  name: string;
  email: string;
  photo: string;
  provider: string;
  prf_user: string;
}

export function Menu() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      });
  }, []);

  const [temaClaro, setTemaClaro] = useState(false);

  const toggleTema = () => {
    setTemaClaro((prev) => !prev);
  };

  return (
    <div
      className={"menu-barra-lateral"}
    >
      <div id="menu-principais-icones">

        <Link to="/perfil">
          <div
            className={`menu-icones ${temaClaro ? "claro" : ""}`}
            id="perfil-icone"
          >
            {isAuthenticated ? (
              <img
                id="imgperfil_menu"
                src={user?.photo || "../c/assets/iconeUsuario.svg"}
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
            
            <span className="texto-barra">PERFIL</span>
          </div>
        </Link>

        <Link to="/anotacoes">
          <div
            className={`menu-icones ${temaClaro ? "claro" : ""}`}
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

            <span className="texto-barra">ANOTAÇÕES</span>
          </div>
        </Link>

        <Link to="/cursos">
          <div
            className={`menu-icones ${temaClaro ? "claro" : ""}`}
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

            <span className="texto-barra">CURSOS</span>
          </div>
        </Link>

        <Link to="/forum">
          <div
            className={`menu-icones ${temaClaro ? "claro" : ""}`}
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

            <span className="texto-barra">FÓRUM</span>
          </div>
        </Link>

        <Link to="/planos">
          <div
            className={`menu-icones ${temaClaro ? "claro" : ""}`}
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

            <span className="texto-barra">CARRINHO</span>
          </div>
        </Link>
      </div>

      <div>
        <Link to="/">
          <div
            className={`menu-icones ${temaClaro ? "claro" : ""}`}
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
            <span className="texto-barra">INÍCIO</span>
          </div>
        </Link>
        <Link to="/configuracoes">
          <div
            className={`menu-icones ${temaClaro ? "claro" : ""}`}
            id="configuracoes-icone"
            onClick={toggleTema}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
            </svg>

            <span className="texto-barra">CONFIGURAÇÕES</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
