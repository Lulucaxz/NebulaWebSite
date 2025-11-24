import React, { useState } from "react";
import "./ModalSeguidores.css";
import imagemPerfilExemplo from '../../../../public/icones-usuarios/FotoPerfil1.jpg';

interface ModalSeguidoresProps {
  onCloseSeguidores: () => void;
  onOpenSeguindo: () => void;
  seguidores: { nome: string; usuario: string }[]; 
  seguindo: { nome: string; usuario: string }[];
  removerSeguidor: (usuario: string) => void; // Adicionada a propriedade removerSeguidor
}

const ModalSeguidores: React.FC<ModalSeguidoresProps> = ({
  onCloseSeguidores,
  onOpenSeguindo,
  seguidores,
  seguindo,
  removerSeguidor, // Recebendo a função removerSeguidor
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSeguidores = seguidores.filter((seguidor) =>
    seguidor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="prf-modal-backdrop" onClick={onCloseSeguidores}>
      <div className="aba-segui" onClick={(e) => e.stopPropagation()}>
        <input
          className="prf-editor-banner-btn"
          type="button"
          value="Fechar"
          onClick={onCloseSeguidores}
        />
        <div className="seguidores-header">
          <div
            className="prf-segui-op"
            id="prf-segui-op-seguidores"
            style={{ backgroundColor: "var(--roxo1)" }}
          >
            <span>SEGUIDORES: {seguidores.length}</span>
          </div>
          <div
            className="prf-segui-op"
            id="prf-segui-op-seguindo"
            onClick={(e) => {
              e.stopPropagation();
              onCloseSeguidores();
              onOpenSeguindo();
            }}
          >
            <span>SEGUINDO: {seguindo.length}</span>
          </div>
        </div>
        <div className="prf-segui-pesquisar">
          <input
            className="seguidores-search"
            type="text"
            placeholder="Pesquise aqui..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="prf-segui-lista">
          {filteredSeguidores.length > 0 ? (
            filteredSeguidores.map((seguidor, index) => (
              <div
                key={index}
                className={`seguidor-item ${index % 2 === 0 ? "seguidor-item-par" : "seguidor-item-impar"}`}
              >
                <img className="seguidor-foto" src={imagemPerfilExemplo} alt="FotoPerfil" />
                <div className="seguidor-info">
                  <span className="seguidor-nome">{seguidor.nome}</span>
                  <span className="seguidor-usuario">{seguidor.usuario}</span>
                </div>
                <button
                  className="seguidor-botao"
                  onClick={() => removerSeguidor(seguidor.usuario)} // Chama a função removerSeguidor
                >
                  Remover
                </button>
              </div>
            ))
          ) : (
            <div className="perfil-nao-encontrado">Perfil não encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalSeguidores;
