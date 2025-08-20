import "./rank.css";
import { useState } from "react";
import { usuariosRank } from "./rankDados"; // substitua pelo caminho correto
import UsuarioRank from "./usuarioRank"; // componente individual

export function Rank() {
  const [pesquisa, setPesquisa] = useState("");

  const usuariosFiltrados = usuariosRank.filter((usuario) =>
    usuario.usuarioRank.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <>
      <div className="prf-rank-header">
        <div className="prf-container3">
          <span>ASTRONAUTAS</span>
          <div className="prf-pesquisa-usuario">
            <input
              name="pesquisa"
              type="text"
              placeholder="Pesquisar usuário..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="prf-container-rank">
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map((user) => (
            <div
              key={user.posicaoRank}
              className={
                user.usuarioRank === "Luiz Tavares" ? "prf-sticky-user" : ""
              }
            >
              <UsuarioRank
                fotoRank={user.fotoRank}
                usuarioRank={user.usuarioRank}
                pontosRank={user.pontosRank}
                posicaoRank={user.posicaoRank}
              />
            </div>
          ))
        ) : (
          <div className="prf-container-rank-nao-encontrado">
            <p className="prf-sem-resultado">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>
    </>
  );
}
