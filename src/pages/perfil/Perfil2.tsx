import "./perfil.css";
import "../../index.css";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams, useLocation } from "react-router-dom";
import { Menu } from "../../components/Menu";
import { Rank } from "./components/rank";
import { BarraDeProgresso } from "./components/barraProgresso";
import ModalSeguidores from "./components/ModalSeguidores";
import ModalSeguindo from "./components/ModalSeguindo";
import ModalDenunciar from "./components/ModalDenunciar";

const DEFAULT_BANNER = "/img/nebulosaBanner.jpg";

type PublicUser = {
  id: number;
  username: string;
  user: string;
  icon: string;
  banner: string;
  biografia: string | null;
  colocacao: number | null;
  pontos: number;
  progresso1?: number;
  progresso2?: number;
  progresso3?: number;
  seguidores?: number;
  seguindo?: number;
  isFollowing?: boolean;
  isSelf?: boolean;
};

type FollowEntry = {
  nome: string;
  usuario: string;
  foto?: string;
};

function Perfil2() {
  const [loading, setLoading] = useState(true);
  const [perfilErro, setPerfilErro] = useState<string | null>(null);

  // Estados dos dados do usuário
  const [nome, setNome] = useState("");
  const [biografia, setBiografia] = useState("");
  const [usuario, setUsuario] = useState("");
  const [rank, setRank] = useState<number | null>(null);
  const [fotoUrl, setFotoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState(DEFAULT_BANNER);
  const [progresso1, setProgresso1] = useState(0);
  const [progresso2, setProgresso2] = useState(0);
  const [progresso3, setProgresso3] = useState(0);
  const [seguidoresCount, setSeguidoresCount] = useState(0);
  const [seguindoCount, setSeguindoCount] = useState(0);

  const [mostrarSeguidores, setMostrarSeguidores] = useState(false);
  const [mostrarSeguindo, setMostrarSeguindo] = useState(false);
  const [seguindoConta, setSeguindoConta] = useState(false);
  const [mostrarModalDenunciar, setMostrarModalDenunciar] = useState(false);

  const [seguidores, setSeguidores] = useState<FollowEntry[]>([]);
  const [seguindo, setSeguindo] = useState<FollowEntry[]>([]);
  const [isSelfProfile, setIsSelfProfile] = useState(false);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const locationState = (location.state as { userTag?: string; userId?: number } | null) || null;
  const userHandleParam = searchParams.get("user") || locationState?.userTag || "";
  const userIdState = locationState?.userId;

  const fetchFollowData = useCallback(async (handle: string) => {
    if (!handle) {
      return;
    }

    const encodedHandle = encodeURIComponent(handle);

    try {
      const [followersRes, followingRes] = await Promise.all([
        axios.get<FollowEntry[]>(
          `http://localhost:4000/api/follow/${encodedHandle}/list`,
          {
            params: { type: "followers" },
            withCredentials: true,
          }
        ),
        axios.get<FollowEntry[]>(
          `http://localhost:4000/api/follow/${encodedHandle}/list`,
          {
            params: { type: "following" },
            withCredentials: true,
          }
        ),
      ]);

      setSeguidores(followersRes.data);
      setSeguindo(followingRes.data);
      setSeguidoresCount(followersRes.data.length);
      setSeguindoCount(followingRes.data.length);
    } catch (error) {
      console.error("Erro ao carregar dados de seguidores:", error);
    }
  }, []);

  useEffect(() => {
    if (!userHandleParam && !userIdState) {
      setPerfilErro("Selecione um usuário pelo ranking para visualizar o perfil.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setPerfilErro(null);

    const queryParams: Record<string, string | number> = userHandleParam
      ? { user: userHandleParam }
      : { id: userIdState as number };

    axios
      .get<PublicUser>("http://localhost:4000/api/rank/profile", {
        params: queryParams,
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        setNome(data.username);
        setBiografia(data.biografia || "");
        setUsuario(data.user);
        const colocacaoNumerica = Number(data.colocacao);
        setRank(Number.isFinite(colocacaoNumerica) ? colocacaoNumerica : null);
        setFotoUrl(data.icon);
        setBannerUrl(data.banner || DEFAULT_BANNER);
        setProgresso1(data.progresso1 || 0);
        setProgresso2(data.progresso2 || 0);
        setProgresso3(data.progresso3 || 0);
        setSeguidoresCount(data.seguidores ?? 0);
        setSeguindoCount(data.seguindo ?? 0);
        setSeguindoConta(Boolean(data.isFollowing));
        setIsSelfProfile(Boolean(data.isSelf));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar perfil público:", err);
        setPerfilErro("Não foi possível carregar o perfil selecionado.");
        setLoading(false);
      });
  }, [userHandleParam, userIdState]);

  useEffect(() => {
    if (usuario) {
      fetchFollowData(usuario);
    }
  }, [usuario, fetchFollowData]);

  const handleToggleFollow = async () => {
    if (!usuario || isSelfProfile) {
      return;
    }

    const action = seguindoConta ? "unfollow" : "follow";

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/follow/manage",
        { targetHandle: usuario, action },
        { withCredentials: true }
      );

      setSeguindoConta(Boolean(data.isFollowing));

      if (data.targetHandle === usuario) {
        setSeguidoresCount(data.targetCounts?.seguidores ?? seguidoresCount);
        setSeguindoCount(data.targetCounts?.seguindo ?? seguindoCount);
      }

      fetchFollowData(usuario);
    } catch (error) {
      console.error("Erro ao atualizar seguimento:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{ background: "#070209", width: "100vw", height: "100vh" }}
      ></div>
    ); // Ou um spinner
  }

  if (perfilErro) {
    return (
      <div className="container">
        <div className="container-perfil">
          <Menu />
          <div
            id="prf-containerAll"
            style={{
              color: "var(--branco)",
              padding: "40px",
              minHeight: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <p>{perfilErro}</p>
          </div>
        </div>
        <Rank />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="container-perfil">
        <Menu />

        <div id="prf-containerAll">
          <div
            className="prf-banner"
            style={{ backgroundImage: `url(${bannerUrl})` }}
          ></div>

          <div className="prf-usuario-barra">
            <div className="prf-container">
              <div className="prf-informacoes-header">
                <img className="prf-foto" src={fotoUrl} alt="Foto de perfil" />

                <div className="prf-infomacoes">
                  <div className="prf-nome-usuario">
                    <span>{nome}</span>
                  </div>
                  <div className="prf-usuario">
                    <span>{usuario}</span>
                  </div>
                  <div className="prf-rank">
                    <span>{rank !== null ? `#${rank}` : "#-"}</span>
                  </div>
                </div>
              </div>

              <div className="prf-social-header">
                <span
                  onClick={() => setMostrarSeguidores(true)}
                  style={{ cursor: "pointer" }}
                >
                  Seguidores: {seguidoresCount}
                </span>
                <span
                  onClick={() => setMostrarSeguindo(true)}
                  style={{ cursor: "pointer" }}
                >
                  Seguindo: {seguindoCount}
                </span>
              </div>
            </div>
          </div>

          <div className="prf-container2" style={{ color: "var(--branco)" }}>
            <div className="prf-colunas">
              <div
                className="prf-coluna1"
                style={{ color: "var(--branco)", minWidth: "300px" }}
              >
                <span className="prf-titulo-informacoes">
                  OPÇÕES PARA A CONTA
                </span>
                <div
                  className="prf-btn-config"
                  onClick={!isSelfProfile ? handleToggleFollow : undefined}
                  style={{
                    backgroundColor: seguindoConta ? "var(--roxo1)" : "",
                    cursor: isSelfProfile ? "not-allowed" : "pointer",
                    opacity: isSelfProfile ? 0.6 : 1,
                  }}
                >
                  {isSelfProfile
                    ? "Esta é a sua conta"
                    : seguindoConta
                      ? "Seguindo"
                      : "Seguir conta"}
                </div>
                <span className="prf-titulo-informacoes">OUTRAS OPÇÕES</span>
                <div
                  className="prf-btn-config"
                  onClick={() => setMostrarModalDenunciar(true)}
                  style={{ cursor: "pointer" }}
                >
                  Denunciar conta
                </div>
              </div>
              <hr />
              <div className="prf-coluna2">
                <span className="prf-titulo-informacoes">BIOGRAFIA</span>
                <div
                  className="prf-biografia"
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  <span>{biografia}</span>
                </div>
                <span className="prf-titulo-informacoes">PROGRESSO</span>
                <BarraDeProgresso
                  progresso1={progresso1}
                  progresso2={progresso2}
                  progresso3={progresso3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Rank />

      {mostrarSeguidores && (
        <ModalSeguidores
          onCloseSeguidores={() => setMostrarSeguidores(false)}
          onOpenSeguindo={() => {
            setMostrarSeguidores(false);
            setMostrarSeguindo(true);
          }}
          seguidores={seguidores}
          seguindo={seguindo}
          canManage={false}
        />
      )}

      {mostrarSeguindo && (
        <ModalSeguindo
          onCloseSeguindo={() => setMostrarSeguindo(false)}
          onOpenSeguidores={() => {
            setMostrarSeguindo(false);
            setMostrarSeguidores(true);
          }}
          seguindo={seguindo}
          seguidores={seguidores}
          canManage={false}
        />
      )}

      {mostrarModalDenunciar && (
        <ModalDenunciar onClose={() => setMostrarModalDenunciar(false)} />
      )}
    </div>
  );
}

export default Perfil2;
