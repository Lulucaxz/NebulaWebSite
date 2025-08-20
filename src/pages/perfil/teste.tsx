import { useState } from "react";
import "./Perfil.css"; // Estilos, se você quiser

export default function Perfil() {
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("Luiz Tavares");
  const [usuario, setUsuario] = useState("luiztavares");
  const [rank, setRank] = useState("#0025");
  const [biografia, setBiografia] = useState(
    "Sou Luiz Tavares, um garoto apaixonado por física. Desde pequeno, sempre me intrigaram as perguntas sobre como o universo funciona. Gosto de aprender e descobrir os segredos das leis da natureza, e espero usar esse conhecimento para fazer a diferença no mundo. Estou sempre curioso e animado para explorar novos conceitos e desafios no campo da física."
  );
  const [fotoUrl, setFotoUrl] = useState("/icones-usuarios/FotoPerfil5.jpg");

  const [novaFoto, setNovaFoto] = useState("");

  return (
    <div className="perfil">
      <img className="prf-foto" src={fotoUrl} alt="Foto de perfil" />

      <div className="prf-informacoes">
        <div className="prf-nome-usuario">
          <span>{nome}</span>
        </div>

        <div className="prf-usuario-rank">
          <div className="prf-usuario">
            <span>{usuario}</span>
          </div>
          <div className="prf-rank">
            <span>{rank}</span>
          </div>
        </div>
      </div>

      <div className="prf-biografia">
        <span>{biografia}</span>
      </div>

      <button onClick={() => setEditando(!editando)}>
        {editando ? "Salvar" : "Editar"}
      </button>

      {editando && (
        <div className="prf-edicao">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
          />
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Usuário"
          />
          <input
            type="text"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="Rank"
          />
          <textarea
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            placeholder="Biografia"
            rows={5}
          />
          <input
            type="text"
            value={novaFoto}
            onChange={(e) => setNovaFoto(e.target.value)}
            placeholder="URL da nova foto"
          />
          <button
            onClick={() => {
              if (novaFoto.trim()) {
                setFotoUrl(novaFoto);
                setNovaFoto("");
              }
            }}
          >
            Alterar Foto
          </button>
        </div>
      )}
    </div>
  );
}
