import "./perfil.css";
import "../../index.css";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { CropImageModal } from "./CropImageModal";
import { Menu } from "../../components/Menu";
import { Rank } from "./components/rank";
import { BarraDeProgresso } from "./components/barraProgresso";
import Footer from "../../components/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";


type User = {
  name: string;
  bio: string;
  prf_user: string;
  colocacao: number | string;
  photo: string;
  banner: string;
  curso: string;
  idioma: string;
  tema: string;
  progresso1: number;
  progresso2: number;
  progresso3: number;
};

const DEFAULT_BANNER = "/img/nebulosaBanner.jpg";

function Perfil() {
  const { t } = useTranslation();
  const [, setUser] = useState<User | null>(null);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [loading, setLoading] = useState(true); // Adicionado para controle de carregamento

  // Estados dos dados do usuário
  const [nome, setNome] = useState("");
  const [biografia, setBiografia] = useState("");
  const [usuario, setUsuario] = useState("");
  const [rank, setRank] = useState<number | null>(null);
  const [fotoUrl, setFotoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState(DEFAULT_BANNER);
  const [, setCurso] = useState("");
  const [, setIdioma] = useState("");
  const [, setTema] = useState("");
  const [progresso1, setProgresso1] = useState(0);
  const [progresso2, setProgresso2] = useState(0);
  const [progresso3, setProgresso3] = useState(0);


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


  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/me", { withCredentials: true })
      .then((res) => {
        const userData = res.data;
        setUser(userData);
        setNome(userData.username);
        setBiografia(userData.biografia || "");
    setUsuario(userData.user);
    const colocacaoNumerica = Number(userData.colocacao);
    setRank(Number.isFinite(colocacaoNumerica) ? colocacaoNumerica : null);
  setFotoUrl(userData.icon);
  setBannerUrl(userData.banner || DEFAULT_BANNER);
        setCurso(userData.curso || "");
        setIdioma(userData.idioma || "");
        setTema(userData.tema || "");
        setProgresso1(userData.progresso1 || 0);
        setProgresso2(userData.progresso2 || 0);
        setProgresso3(userData.progresso3 || 0);
        setLoading(false); // Finaliza carregamento
      })
      .catch((err) => {
        console.error("Erro ao buscar usuário:", err);
        navigate("/cadastrar");
      });
  }, [navigate]);

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
    setFotoEditada(new File([croppedBlob], "profile.jpg", { type: "image/jpeg" }));
  };

  const handleBannerReset = () => {
    if (bannerPreviewUrlRef.current) {
      URL.revokeObjectURL(bannerPreviewUrlRef.current);
      bannerPreviewUrlRef.current = null;
    }
  setBannerPreview(DEFAULT_BANNER);
    setBannerEditada(null);
    setBannerResetToDefault(true);
  };

  if (loading) {
    return <div style={{ background: '#070209', width: '100vw', height: '100vh' }}></div>; // Ou um spinner
  }

  const bannerDisplay = bannerPreview || bannerUrl || DEFAULT_BANNER;

  return (
    <div className="container">
      <div className="container-perfil">
        <Menu />

        <div id="prf-containerAll">
          <div className="prf-banner" style={{ backgroundImage: `url(${bannerDisplay})` }}></div>

          <div className="prf-usuario-barra">
            <div className="prf-container">
              <img className="prf-foto" src={fotoUrl} alt="Foto de perfil" />

              <div className="prf-infomacoes">
                <div className="prf-nome-usuario">
                  <span>{nome}</span>
                </div>
                <div className="prf-usuario-rank">
                  <div className="prf-usuario">
                    <span>{usuario}</span>
                  </div>
                  <div className="prf-rank">
                    <span>{rank !== null ? `#${rank}` : '#-'}</span>
                  </div>
                </div>
              </div>

              <div
                className="prf-editar"
                onClick={() => {
                  setNomeEditado(nome);
                  setBioEditada(biografia);
                  setMostrarEditor(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
              </div>

              {mostrarEditor && (
                <div
                  className="prf-modal-backdrop"
                  onClick={() => setMostrarEditor(false)}
                >
                  <div
                    className="aba-editar"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="prf-edicao">
                      <input
                        className="prf-editar-nome"
                        type="text"
                        value={nomeEditado}
                        placeholder={t('Nome')}
                        onChange={(e) => setNomeEditado(e.target.value)}
                      />
                      <textarea
                        className="prf-editar-biografia"
                        value={bioEditada}
                        placeholder={t('Biografia')}
                        rows={5}
                        onChange={(e) => setBioEditada(e.target.value)}
                      />
                      <div className="prf-add-imagem">
                        <label htmlFor="prf-editar-imagem">
                          {t('ESCOLHA UMA IMAGEM')}
                        </label>
                        <input
                          id="prf-editar-imagem"
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={onFileChange}
                        />
                      </div>

                      {fotoPreview && (
                        <div className="prf-preview-imagem">
                          <img
                            src={fotoPreview}
                            alt={t('Prévia da imagem')}
                            className="prf-preview-img"
                          />
                        </div>
                      )}
                      <div className="prf-add-imagem">
                        <label htmlFor="prf-editar-banner">
                          {t('ESCOLHA UM BANNER')}
                        </label>
                        <input
                          id="prf-editar-banner"
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={onBannerChange}
                        />
                      </div>
                      <div className="prf-preview-banner">
                        <img
                          src={bannerPreview || bannerUrl || DEFAULT_BANNER}
                          alt={t('Prévia da imagem')}
                          className="prf-preview-banner-img"
                        />
                        <button
                          type="button"
                          className="prf-banner-reset"
                          onClick={handleBannerReset}
                        >
                          {t('USAR BANNER PADRÃO')}
                        </button>
                      </div>
                      {cropModalOpen && (
                        <CropImageModal
                          imageSrc={cropImageSrc}
                          onCancel={() => setCropModalOpen(false)}
                          onCropComplete={handleCropComplete}
                        />
                      )}

                      <button
                        className="prf-botao-editar-enviar"
                        onClick={salvarEdicao}
                      >
                        {t('ENVIAR')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="prf-container2">
            <div className="prf-colunas">
              <div className="prf-coluna1">
                <div className="prf-biografia">
                  <span>{biografia}</span>
                </div>
                <BarraDeProgresso
                  progresso1={progresso1}
                  progresso2={progresso2}
                  progresso3={progresso3}
                />
              </div>
              <div className="prf-coluna2">
                <Rank />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Perfil;
