import "./perfil.css";
import "../../index.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "../../components/Menu";
import { Rank } from "./components/rank";
import { BarraDeProgresso } from "./components/barraProgresso";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalEditar from "./components/ModalEditar";
import ModalSeguidores from "./components/ModalSeguidores";
import ModalSeguindo from "./components/ModalSeguindo";
import ModalAvaliarPlanos from "./components/ModalAvaliarPlanos";
import i18n from "i18next";
import { PalettePanel } from "./components/PalettePanel";
import { emitAuthLogout } from "../../utils/authEvents";

type User = {
  username: string;
  biografia: string;
  user: string;
  colocacao: number | string;
  icon: string;
  banner: string;
  curso?: string;
  idioma?: string;
  tema?: string;
  progresso1?: number;
  progresso2?: number;
  progresso3?: number;
  role?: string;
};

type FollowEntry = {
  nome: string;
  usuario: string;
  foto?: string;
};

const DEFAULT_BANNER = "/img/nebulosaBanner.jpg";
const DEFAULT_AVATAR = "/img/defaultUser.png";

function Perfil() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true); // Adicionado para controle de carregamento

  // Estados dos dados do usuário
  const [nome, setNome] = useState("");
  const [biografia, setBiografia] = useState("");
  const [usuario, setUsuario] = useState("");
  const [rank, setRank] = useState<number | null>(null);
  const [fotoUrl, setFotoUrl] = useState(DEFAULT_AVATAR);
  const [bannerUrl, setBannerUrl] = useState(DEFAULT_BANNER);
  const [idioma, setIdioma] = useState("pt-br");
  const [progresso1, setProgresso1] = useState(0);
  const [progresso2, setProgresso2] = useState(0);
  const [progresso3, setProgresso3] = useState(0);
  const [isProfessor, setIsProfessor] = useState(false);

  const [bioCharCount, setBioCharCount] = useState(0);
  const [mostrarSeguidores, setMostrarSeguidores] = useState(false);
  const [mostrarSeguindo, setMostrarSeguindo] = useState(false);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [mostrarAvaliarPlanos, setMostrarAvaliarPlanos] = useState(false);
  const [mostrarPaletaPanel, setMostrarPaletaPanel] = useState(false);

  // Estados para edição
  const [nomeEditado, setNomeEditado] = useState("");
  const [bioEditada, setBioEditada] = useState("");

  const [fotoEditada, setFotoEditada] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>("");
  const [bannerEditada, setBannerEditada] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [bannerResetToDefault, setBannerResetToDefault] = useState(false);

  // Para controlar o objeto URL e liberar memória depois
  const fotoPreviewUrlRef = useRef<string | null>(null);
  const bannerPreviewUrlRef = useRef<string | null>(null);

  const navigate = useNavigate();

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
    } catch (error) {
      console.error("Erro ao carregar seguidores:", error);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/me", { withCredentials: true })
      .then((res) => {
        const userData: User = res.data;
        setNome(userData.username);
        setBiografia(userData.biografia || "");
    setUsuario(userData.user);
    const colocacaoNumerica = Number(userData.colocacao);
    setRank(Number.isFinite(colocacaoNumerica) ? colocacaoNumerica : null);
  setFotoUrl(userData.icon || DEFAULT_AVATAR);
  setBannerUrl(userData.banner || DEFAULT_BANNER);
        const idiomaNormalizado = (userData.idioma || "").toLowerCase();
        setIdioma(idiomaNormalizado === "en-us" ? "en-us" : "pt-br");
        setProgresso1(userData.progresso1 || 0);
        setProgresso2(userData.progresso2 || 0);
        setProgresso3(userData.progresso3 || 0);
        setIsProfessor((userData.role || "").toLowerCase() === "professor");
        setLoading(false); // Finaliza carregamento
      })
      .catch((err) => {
        console.error("Erro ao buscar usuário:", err);
        navigate("/cadastrar");
      });
  }, [navigate]);

  useEffect(() => {
    if (usuario) {
      fetchFollowData(usuario);
    }
  }, [usuario, fetchFollowData]);

  useEffect(() => {
    if (!mostrarEditor) {
      if (bannerPreviewUrlRef.current) {
        URL.revokeObjectURL(bannerPreviewUrlRef.current);
        bannerPreviewUrlRef.current = null;
      }
      setBannerPreview("");
      setBannerEditada(null);
      setBannerResetToDefault(false);
    }
  }, [mostrarEditor]);

  useEffect(() => {
    return () => {
      if (bannerPreviewUrlRef.current) {
        URL.revokeObjectURL(bannerPreviewUrlRef.current);
      }
    };
  }, []);

  const salvarEdicao = () => {
    setMostrarEditor(false);
    const formData = new FormData();
    formData.append("name", nomeEditado);
    formData.append("bio", bioEditada);
    formData.append("idUser", usuario);
    if (fotoEditada) {
      formData.append("photo", fotoEditada);
    }
    if (bannerEditada) {
      formData.append("banner", bannerEditada);
    } else if (bannerResetToDefault) {
      formData.append("bannerUrl", DEFAULT_BANNER);
    }

    axios
      .put("http://localhost:4000/auth/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.error("Erro ao atualizar perfil:", err);
      });
  };

  // Função para lidar com seleção do arquivo e gerar preview
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Abre o modal de crop com a imagem selecionada
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCropImageSrc(ev.target?.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (bannerPreviewUrlRef.current) {
        URL.revokeObjectURL(bannerPreviewUrlRef.current);
      }
      const previewUrl = URL.createObjectURL(file);
      bannerPreviewUrlRef.current = previewUrl;
      setBannerPreview(previewUrl);
      setBannerEditada(file);
      setBannerResetToDefault(false);
    }
  };

  // Callback para receber a imagem croppada
  const handleCropComplete = (croppedBlob: Blob) => {
    setCropModalOpen(false);
    // Atualiza preview e arquivo para upload
    const previewUrl = URL.createObjectURL(croppedBlob);
    if (fotoPreviewUrlRef.current) {
      URL.revokeObjectURL(fotoPreviewUrlRef.current);
    }
    fotoPreviewUrlRef.current = previewUrl;
    setFotoPreview(previewUrl);
    setFotoEditada(
      new File([croppedBlob], "profile.jpg", { type: "image/jpeg" })
    );
  };

  const [seguidores, setSeguidores] = useState<FollowEntry[]>([]);
  const [seguindo, setSeguindo] = useState<FollowEntry[]>([]);

  const removerSeguidor = async (handle: string) => {
    if (!handle) {
      return;
    }
    try {
      await axios.post(
        "http://localhost:4000/api/follow/manage",
        { targetHandle: handle, action: "removeFollower" },
        { withCredentials: true }
      );
      if (usuario) {
        fetchFollowData(usuario);
      }
    } catch (error) {
      console.error("Erro ao remover seguidor:", error);
    }
  };

  const pararDeSeguir = async (handle: string) => {
    if (!handle) {
      return;
    }
    try {
      await axios.post(
        "http://localhost:4000/api/follow/manage",
        { targetHandle: handle, action: "unfollow" },
        { withCredentials: true }
      );
      if (usuario) {
        fetchFollowData(usuario);
      }
    } catch (error) {
      console.error("Erro ao deixar de seguir:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`http://localhost:4000/auth/logout`);
      emitAuthLogout();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setIdioma(language);
  };

  const handleBannerReset = () => {
    if (bannerPreviewUrlRef.current) {
      URL.revokeObjectURL(bannerPreviewUrlRef.current);
      bannerPreviewUrlRef.current = null;
    }
    setBannerPreview(DEFAULT_BANNER);
    setBannerEditada(null);
    setBannerResetToDefault(true);
    setBannerUrl(DEFAULT_BANNER);
  };

  if (loading) {
    return (
      <div style={{ background: "var(--preto)", width: "100vw", height: "100vh" }}></div>
    ); // Ou um spinner
  }

  const bannerDisplay = bannerPreview || bannerUrl || DEFAULT_BANNER;
  const isStudentView = !isProfessor;

  return (
    <div className="container">
      <div className="container-perfil">
        <Menu />

        <div id="prf-containerAll">
          <div className="prf-banner" style={{ backgroundImage: `url(${bannerDisplay})` }}></div>

          <div className="prf-usuario-barra">
            <div className="prf-container">
              <div className="prf-informacoes-header">
                <img className="prf-foto" src={fotoUrl || DEFAULT_AVATAR} alt="Foto de perfil" />

                <div className="prf-infomacoes">
                  <div className="prf-nome-usuario">
                    <span>{nome}</span>
                  </div>
                  <div className="prf-usuario">
                    <span>{usuario}</span>
                  </div>
                  {isStudentView && (
                    <div className="prf-rank">
                      <span>{rank !== null ? `#${rank}` : "#-"}</span>
                    </div>
                  )}
                </div>
              </div>

              {isStudentView && (
                <div className="prf-social-header">
                  <span
                    onClick={() => setMostrarSeguidores(true)}
                    style={{ cursor: "pointer" }}
                  >
                    {t("perfil.followersCount", { count: seguidores.length })}
                  </span>
                  <span
                    onClick={() => setMostrarSeguindo(true)}
                    style={{ cursor: "pointer" }}
                  >
                    {t("perfil.followingCount", { count: seguindo.length })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="prf-container2" style={{ color: "var(--branco)" }}>
            <div className="prf-colunas">
              <div
                className="prf-coluna1"
                style={{ color: "var(--branco)", minWidth: "300px" }}
              >
                {isStudentView && (
                  <span className="prf-titulo-informacoes">
                    {t("perfil.accountPreferences")}
                  </span>
                )}
                <div className="prf-linguagem">
                  <span>{t("perfil.language")}</span>
                  <div className="prf-option-group">
                    <label className="prf-option" htmlFor="idioma-ptbr">
                      <input
                        className="prf-option-input"
                        type="radio"
                        name="idioma"
                        id="idioma-ptbr"
                        value="pt-br"
                        checked={idioma === "pt-br"}
                        onChange={() => handleLanguageChange("pt-br")}
                      />
                      <span className="prf-option-text">
                        {t("perfil.languagePtBr")}
                      </span>
                    </label>
                    <label className="prf-option" htmlFor="idioma-en">
                      <input
                        className="prf-option-input"
                        type="radio"
                        name="idioma"
                        id="idioma-en"
                        value="en-us"
                        checked={idioma === "en-us"}
                        onChange={() => handleLanguageChange("en-us")}
                      />
                      <span className="prf-option-text">{t("perfil.languageEnUs")}</span>
                    </label>
                  </div>
                </div>
                <div
                  className="prf-btn-config"
                  onClick={() => setMostrarPaletaPanel(true)}
                >
                  {t("perfil.customizePalette")}
                </div>
                {isStudentView && (
                  <span className="prf-titulo-informacoes">{t("perfil.otherOptions")}</span>
                )}
                <div
                  className="prf-btn-config"
                  onClick={() => {
                    setNomeEditado(nome);
                    setBioEditada(biografia);
                    setMostrarEditor(true);
                  }}
                >
                  {t("perfil.editProfile")}
                </div>
                {isStudentView && (
                  <div
                    className="prf-btn-config"
                    onClick={() => setMostrarAvaliarPlanos(true)}
                  >
                    {t("perfil.reviewPlans")}
                  </div>
                )}
                <div className="prf-btn-config" onClick={logout}>{t("perfil.logout")}</div>
              </div>
              <hr />
              <div className="prf-coluna2">
                <span className="prf-titulo-informacoes">{t("perfil.biography")}</span>
                <div
                  className="prf-biografia"
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  <span>{biografia}</span>
                </div>
                {isStudentView && (
                  <>
                    <span className="prf-titulo-informacoes">{t("perfil.progress")}</span>
                    <BarraDeProgresso
                      progresso1={progresso1}
                      progresso2={progresso2}
                      progresso3={progresso3}
                    />
                  </>
                )}
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
          removerSeguidor={removerSeguidor}
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
          pararDeSeguir={pararDeSeguir}
        />
      )}

      {mostrarEditor && (
        <ModalEditar
          onClose={() => setMostrarEditor(false)}
          t={t}
          fotoPreview={fotoPreview}
          fotoUrl={fotoUrl}
          nomeEditado={nomeEditado}
          setNomeEditado={setNomeEditado}
          bioEditada={bioEditada}
          setBioEditada={setBioEditada}
          bioCharCount={bioCharCount}
          setBioCharCount={setBioCharCount}
          cropModalOpen={cropModalOpen}
          cropImageSrc={cropImageSrc}
          handleCropComplete={handleCropComplete}
          salvarEdicao={salvarEdicao}
          onFileChange={onFileChange}
          bannerDisplay={bannerDisplay}
          onBannerChange={onBannerChange}
          onBannerReset={handleBannerReset}
        />
      )}

      {isStudentView && mostrarAvaliarPlanos && (
        <ModalAvaliarPlanos onClose={() => setMostrarAvaliarPlanos(false)} />
      )}

      {mostrarPaletaPanel && (
        <PalettePanel
          onClose={() => setMostrarPaletaPanel(false)}
          onCommit={() => {}}
        />
      )}
    </div>
  );
}

export default Perfil;
