import "./perfil.css";
import "../../index.css";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CropImageModal } from "./CropImageModal";
import { Menu } from "../../components/Menu";
import { Rank } from "./components/rank";
import { BarraDeProgresso } from "./components/barraProgresso";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalEditar from "./components/ModalEditar";
import ModalSeguidores from "./components/ModalSeguidores";
import ModalSeguindo from "./components/ModalSeguindo";
import ModalDenunciar from "./components/ModalDenunciar";

type User = {
  name: string;
  bio: string;
  prf_user: string;
  rank: number;
  photo: string;
  curso: string;
  idioma: string;
  tema: string;
  progresso1: number;
  progresso2: number;
  progresso3: number;
};

function Perfil2() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Adicionado para controle de carregamento

  // Estados dos dados do usuário
  const [nome, setNome] = useState("");
  const [biografia, setBiografia] = useState("");
  const [usuario, setUsuario] = useState("");
  const [rank, setRank] = useState("0025");
  const [fotoUrl, setFotoUrl] = useState("");
  const [curso, setCurso] = useState("");
  const [idioma, setIdioma] = useState("pt-br");
  const [tema, setTema] = useState("escuro");
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

  // Para controlar o objeto URL e liberar memória depois
  const fotoPreviewUrlRef = useRef<string | null>(null);

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
        setRank(userData.colocacao);
        setFotoUrl(userData.icon);
        setCurso(userData.curso || "");
        const idiomaNormalizado = (userData.idioma || "").toLowerCase();
        setIdioma(idiomaNormalizado === "en-us" ? "en-us" : "pt-br");
        const temaNormalizado = (userData.tema || "").toLowerCase();
        setTema(temaNormalizado === "claro" ? "claro" : "escuro");
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

  const salvarEdicao = () => {
    setMostrarEditor(false);
    const formData = new FormData();
    formData.append("name", nomeEditado);
    formData.append("bio", bioEditada);
    formData.append("idUser", usuario);
    if (fotoEditada) {
      formData.append("photo", fotoEditada);
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

  const [bioCharCount, setBioCharCount] = useState(0);
  const [mostrarSeguidores, setMostrarSeguidores] = useState(false);
  const [mostrarSeguindo, setMostrarSeguindo] = useState(false);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [seguindoConta, setSeguindoConta] = useState(false); // Estado para controlar o botão
  const [mostrarModalDenunciar, setMostrarModalDenunciar] = useState(false); // Estado para controlar o modal

  const toggleSeguirConta = () => {
    setSeguindoConta((prev) => !prev);
  };

  const [seguidores, setSeguidores] = useState([
    { nome: "NomeLegal", usuario: "@nomelegal" },
    { nome: "Lucas Leite de Souza", usuario: "@lucasleitedesouza" },
    { nome: "Samuel Oliveira", usuario: "@samumu" },
    { nome: "João Marcelo", usuario: "@sheldon" },
    { nome: "Marcos Rocha", usuario: "@mtrouxa" },
    { nome: "Luiz Henrique", usuario: "@luizhenriquetavares" },
  ]);

  const [seguindo, setSeguindo] = useState([
    { nome: "Ana Clara", usuario: "@anaclara" },
    { nome: "Pedro Silva", usuario: "@pedrosilva" },
    { nome: "Maria Oliveira", usuario: "@mariaoliveira" },
    { nome: "João Souza", usuario: "@joaosouza" },
    { nome: "Carla Mendes", usuario: "@carlamendes" },
    { nome: "Lucas Pereira", usuario: "@lucaspereira" },
    { nome: "Lucas Pereira", usuario: "@lucaspereira" },
    { nome: "Lucas Pereira", usuario: "@lucaspereira" },
    { nome: "Lucas Pereira", usuario: "@lucaspereira" },
    { nome: "Lucas Pereira", usuario: "@lucaspereira" },
    { nome: "Lucas Pereira", usuario: "@lucaspereira" },
  ]);

  const removerSeguidor = (usuario: string) => {
    setSeguidores((prev) => prev.filter((seguidor) => seguidor.usuario !== usuario));
  };

  const pararDeSeguir = (usuario: string) => {
    setSeguindo((prev) => prev.filter((pessoa) => pessoa.usuario !== usuario));
  };

  if (loading) {
    return (
      <div
        style={{ background: "#070209", width: "100vw", height: "100vh" }}
      ></div>
    ); // Ou um spinner
  }

  return (
    <div className="container">
      <div className="container-perfil">
        <Menu />

        <div id="prf-containerAll">
          <div className="prf-banner"></div>

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
                    <span>#{rank}</span>
                  </div>
                </div>
              </div>

              <div className="prf-social-header">
                <span
                  onClick={() => setMostrarSeguidores(true)}
                  style={{ cursor: "pointer" }}
                >
                  Seguidores: {seguidores.length}
                </span>
                <span
                  onClick={() => setMostrarSeguindo(true)}
                  style={{ cursor: "pointer" }}
                >
                  Seguindo: {seguindo.length}
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
                  onClick={toggleSeguirConta}
                  style={{
                    backgroundColor: seguindoConta ? "var(--roxo1)" : "",
                    cursor: "pointer",
                  }}
                >
                  {seguindoConta ? "Seguindo" : "Seguir conta"}
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

      {mostrarModalDenunciar && (
        <ModalDenunciar onClose={() => setMostrarModalDenunciar(false)} />
      )}
    </div>
  );
}

export default Perfil2;
