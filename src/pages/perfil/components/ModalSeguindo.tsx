import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./ModalSeguidores.css";

const imagemPerfilExemplo = "/img/users/icones-usuarios/FotoPerfil1.jpg";

type FollowEntry = {
  nome: string;
  usuario: string;
  foto?: string;
};

interface ModalSeguindoProps {
  onCloseSeguindo: () => void;
  onOpenSeguidores: () => void;
  seguindo: FollowEntry[];
  seguidores: FollowEntry[];
  pararDeSeguir?: (usuario: string) => void;
  canManage?: boolean;
}

const ModalSeguindo: React.FC<ModalSeguindoProps> = ({
  onCloseSeguindo,
  onOpenSeguidores,
  seguindo,
  seguidores,
  pararDeSeguir,
  canManage = true,
}) => {
  const { t } = useTranslation();
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
          value={t("common.close")}
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
            <span>{t("perfil.followersCount", { count: seguidores.length })}</span>
          </div>
          <div
            className="prf-segui-op"
            id="prf-segui-op-seguindo"
            style={{ backgroundColor: "var(--roxo1)" }}
          >
            <span>{t("perfil.followingCount", { count: seguindo.length })}</span>
          </div>
        </div>
        <div className="prf-segui-pesquisar">
          <input
            className="seguidores-search"
            type="text"
            placeholder={t("common.searchHere")}
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
                <img
                  className="seguidor-foto"
                  src={pessoa.foto || imagemPerfilExemplo}
                  alt={t("perfil.followingModal.followingPhotoAlt")}
                />
                <div className="seguidor-info">
                  <span className="seguidor-nome">{pessoa.nome}</span>
                  <span className="seguidor-usuario">{pessoa.usuario}</span>
                </div>
                {canManage && pararDeSeguir && (
                  <button
                    className="seguidor-botao"
                    onClick={() => pararDeSeguir(pessoa.usuario)}
                  >
                    {t("perfil.followingModal.unfollow")}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="perfil-nao-encontrado">{t("perfil.profileNotFound")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalSeguindo;