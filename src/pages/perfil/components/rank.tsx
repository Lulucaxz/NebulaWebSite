import "./rank.css";

import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import UsuarioRank from "./usuarioRank";
import axios from "axios";

export function Rank() {
  const { t } = useTranslation();
  const [pesquisa, setPesquisa] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState<string>("");

  useEffect(() => {
    // Busca ranking
    axios.get("http://localhost:4000/api/rank")
      .then(res => setUsuarios(res.data))
      .catch(() => setUsuarios([]));
    // Busca usuário logado
    axios.get("http://localhost:4000/auth/me", { withCredentials: true })
      .then(res => setUsuarioLogado(res.data.user))
      .catch(() => setUsuarioLogado(""));
  }, []);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.user.toLowerCase().includes(pesquisa.toLowerCase()) ||
    usuario.username.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <>
    <div id="prf-rank-container">

      <div className="prf-rank-header">
        <div className="prf-container3">
          <span style={{display:"flex"}}><svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
              style={{"marginRight":"10px"}}
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>{t('Pesquise por outros alunos')}</span>
          <div className="prf-pesquisa-usuario">
            <input
              name="pesquisa"
              type="text"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="prf-header-informacoes"
        style={
          {
            backgroundColor: "#481A6B",
            padding: "10px 25px",
            fontFamily: "'Questrial', sans-serif",
            fontSize: "20px",
            color: "var(--branco)",
            position: "relative",
            height: "45px",
            boxSizing: "border-box"
          }
        }>
          <span style={{marginRight: "200px"}}>{t('Perfil')}</span>
          <span>{t('Pontos')}</span>
          <span style={{position:"absolute", right: "25px"}}>{t('Posição')}</span>
        </div>

      <div className="prf-container-rank">
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map((user, idx) => (
            <div
              key={user.id}
              className={
                user.user === usuarioLogado ? "prf-sticky-user" : ""
              }
            >
              <UsuarioRank
                fotoRank={user.icon}
                nomeRank={user.username}
                pontosRank={user.pontos}
                posicaoRank={(idx + 1).toString()}
              />
            </div>
          ))
        ) : (
          <div className="prf-container-rank-nao-encontrado">
            <p className="prf-sem-resultado">{t('Nenhum usuário encontrado.')}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
