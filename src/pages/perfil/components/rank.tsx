import "./rank.css";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import UsuarioRank from "./usuarioRank";
import axios from "axios";

type RankUsuario = {
  id: number;
  username: string;
  user: string;
  icon: string;
  pontos: number;
  colocacao: number | string;
};

type UsuarioLogado = {
  id: number;
  username: string;
  user: string;
  icon: string;
  pontos: number;
  colocacao?: number | string;
  role?: 'aluno' | 'professor';
};

type RankEntry = RankUsuario & { posicao: number };

export function Rank() {
  const { t } = useTranslation();
  const [pesquisa, setPesquisa] = useState("");
  const [usuarios, setUsuarios] = useState<RankUsuario[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    axios.get<RankUsuario[]>("http://localhost:4000/api/rank")
      .then(res => setUsuarios(res.data))
      .catch(() => setUsuarios([]));

    axios.get<UsuarioLogado>("http://localhost:4000/auth/me", { withCredentials: true })
      .then(res => setUsuarioLogado(res.data))
      .catch(() => setUsuarioLogado(null));
  }, []);

  const listaCompleta = useMemo(() => {
    const normalizados: RankEntry[] = usuarios.map((usuario, idx) => ({
      ...usuario,
      posicao: Number(usuario.colocacao ?? idx + 1) || idx + 1,
    }));

    if (!usuarioLogado) {
      return normalizados;
    }

    const isProfessor = (usuarioLogado.role || "").toLowerCase() === "professor";
    const baseList = isProfessor
      ? normalizados.filter((usuario) => usuario.user !== usuarioLogado.user)
      : normalizados;

    if (isProfessor) {
      return baseList;
    }

    const jaListada = baseList.some((usuario) => usuario.user === usuarioLogado.user);
    if (jaListada) {
      return baseList;
    }

    const posicaoLogadoRaw = Number(usuarioLogado.colocacao);
    const posicaoLogado = Number.isFinite(posicaoLogadoRaw) && posicaoLogadoRaw > 0
      ? posicaoLogadoRaw
      : normalizados.length + 1;

    return [
      ...baseList,
      {
        id: usuarioLogado.id,
        username: usuarioLogado.username,
        user: usuarioLogado.user,
        icon: usuarioLogado.icon,
        pontos: usuarioLogado.pontos,
        colocacao: posicaoLogado,
        posicao: posicaoLogado,
      },
    ].sort((a, b) => a.posicao - b.posicao);
  }, [usuarios, usuarioLogado]);

  const usuariosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    if (!termo) {
      return listaCompleta;
    }

    return listaCompleta.filter((usuario) =>
      usuario.user.toLowerCase().includes(termo) ||
      usuario.username.toLowerCase().includes(termo)
    );
  }, [listaCompleta, pesquisa]);

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
              fill="currentColor"
              style={{ marginRight: "10px" }}
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
            backgroundColor: "var(--roxo3)",
            padding: "10px 25px",
            fontFamily: "'Questrial', sans-serif",
            fontSize: "20px",
            color: "var(--text-on-primary)",
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
          usuariosFiltrados.map((user) => {
            const isCurrentUser = usuarioLogado && user.user === usuarioLogado.user;
            return (
              <div
                key={user.id}
                className={isCurrentUser ? "prf-sticky-user" : ""}
              >
                <UsuarioRank
                  fotoRank={user.icon}
                  nomeRank={user.username}
                  pontosRank={user.pontos}
                  posicaoRank={user.posicao.toString()}
                  userHandle={user.user}
                  userId={user.id}
                  isCurrentUser={Boolean(isCurrentUser)}
                />
              </div>
            );
          })
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
