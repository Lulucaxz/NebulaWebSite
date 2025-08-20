import "./perfil.css";
import "../../index.css";
import { useEffect, useState, useRef } from "react";
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
  rank: number;
  photo: string;
};

function Perfil() {
  const [user, setUser] = useState<User | null>(null);
  const [mostrarEditor, setMostrarEditor] = useState(false);

  // Estados dos dados do usuário
  const [nome, setNome] = useState("");
  const [biografia, setBiografia] = useState("");
  const [usuario, setUsuario] = useState("");
  const [rank, setRank] = useState("0025");
  const [fotoUrl, setFotoUrl] = useState("");

  // Estados para edição
  const [nomeEditado, setNomeEditado] = useState("");
  const [bioEditada, setBioEditada] = useState("");
  const [fotoEditada, setFotoEditada] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");

  // Para controlar o objeto URL e liberar memória depois
  const fotoPreviewUrlRef = useRef<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/me", { withCredentials: true })
      .then((res) => {
        const data: User = res.data;
        setUser(data);

        setNome(data.name);
        setBiografia(data.bio || "");
        setUsuario(data.prf_user);
        setFotoUrl(data.photo);

        setNomeEditado(data.name);
        setBioEditada(data.bio || "");
        setFotoPreview(data.photo);
      })
      .catch(() => {
        setUser(null);
        navigate("/cadastrar");
      });
    return () => {
      if (fotoPreviewUrlRef.current) {
        URL.revokeObjectURL(fotoPreviewUrlRef.current);
        fotoPreviewUrlRef.current = null;
      }
    };
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
      .then((res) => {
        const updatedUser = res.data.user;
        setNome(updatedUser.name);
        setBiografia(updatedUser.bio || "");
        setFotoUrl(updatedUser.photo);
        setMostrarEditor(false);
        setFotoPreview(updatedUser.photo);
        setFotoEditada(null);

        // Limpa o preview antigo da imagem se foi um arquivo
        if (fotoPreviewUrlRef.current) {
          URL.revokeObjectURL(fotoPreviewUrlRef.current);
          fotoPreviewUrlRef.current = null;
        }
      })
      .catch((err) => {
        console.error("Erro ao atualizar perfil:", err);
      });
  };

  // Função para lidar com seleção do arquivo e gerar preview
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoEditada(file);

      // Revoga o preview antigo antes de criar um novo
      if (fotoPreviewUrlRef.current) {
        URL.revokeObjectURL(fotoPreviewUrlRef.current);
      }

      const previewUrl = URL.createObjectURL(file);
      fotoPreviewUrlRef.current = previewUrl;
      setFotoPreview(previewUrl);
    }
  };

  return (
    <div className="container">
      <div className="container-perfil">
        <Menu />

        <div id="prf-containerAll">
          <div className="prf-banner"></div>

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
                    <span>#{rank}</span>
                  </div>
                </div>
              </div>

              <div className="prf-editar" onClick={() => setMostrarEditor(true)}>
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
                        placeholder="Nome"
                        onChange={(e) => setNomeEditado(e.target.value)}
                      />
                      <textarea
                        className="prf-editar-biografia"
                        value={bioEditada}
                        placeholder="Biografia"
                        rows={5}
                        onChange={(e) => setBioEditada(e.target.value)}
                      />

                      <div className="prf-add-imagem">
                        <label htmlFor="prf-editar-imagem">
                          ESCOLHA UMA IMAGEM
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
                            alt="Prévia da imagem"
                            className="prf-preview-img"
                          />
                        </div>
                      )}

                      <button
                        className="prf-botao-editar-enviar"
                        onClick={salvarEdicao}
                      >
                        ENVIAR
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
                <BarraDeProgresso />
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
