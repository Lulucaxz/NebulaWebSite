import React, { useState } from "react";
import "./ModalSeguidores.css";
import imagemPerfilExemplo from '../../../../public/icones-usuarios/FotoPerfil1.jpg';

interface ModalSeguindoProps {
  onCloseSeguindo: () => void;
  onOpenSeguidores: () => void;
  seguindo: { nome: string; usuario: string }[];
  seguidores: { nome: string; usuario: string }[];
  pararDeSeguir: (usuario: string) => void; // Adicionada a propriedade pararDeSeguir
}

const ModalSeguindo: React.FC<ModalSeguindoProps> = ({
  onCloseSeguindo,
  onOpenSeguidores,
  seguindo,
  seguidores,
  pararDeSeguir, // Recebendo a função pararDeSeguir
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSeguindo = seguindo.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="prf-modal-backdrop" onClick={onCloseSeguindo}>
      <div className="aba-segui" onClick={(e) => e.stopPropagation()}>
        <input
          className="prf-editor-banner-btn"
          type="button"
          value="Fechar"
          onClick={onCloseSeguindo}
        />
        <div className="seguidores-header">
          <div
            className="prf-segui-op"
            id="prf-segui-op-seguidores"
            onClick={(e) => {
              e.stopPropagation();
              onCloseSeguindo();
              onOpenSeguidores();
            }}
          >
            <span>SEGUIDORES: {seguidores.length}</span>
          </div>
          <div
            className="prf-segui-op"
            id="prf-segui-op-seguindo"
            style={{ backgroundColor: "var(--roxo1)" }}
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
          {filteredSeguindo.length > 0 ? (
            filteredSeguindo.map((pessoa, index) => (
              <div
                key={index}
                className={`seguidor-item ${index % 2 === 0 ? "seguidor-item-par" : "seguidor-item-impar"}`}
              >
                <img className="seguidor-foto" src={imagemPerfilExemplo} alt="FotoPerfil" />
                <div className="seguidor-info">
                  <span className="seguidor-nome">{pessoa.nome}</span>
                  <span className="seguidor-usuario">{pessoa.usuario}</span>
                </div>
                <button
                  className="seguidor-botao"
                  onClick={() => pararDeSeguir(pessoa.usuario)} // Chama a função pararDeSeguir
                >
                  Deixar de seguir
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

export default ModalSeguindo;