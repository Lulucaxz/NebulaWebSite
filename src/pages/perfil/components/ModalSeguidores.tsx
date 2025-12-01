import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./ModalSeguidores.css";

const imagemPerfilExemplo = "/img/users/icones-usuarios/FotoPerfil1.jpg";

type FollowEntry = {
  nome: string;
  usuario: string;
  foto?: string;
};

interface ModalSeguidoresProps {
  onCloseSeguidores: () => void;
  onOpenSeguindo: () => void;
  seguidores: FollowEntry[];
  seguindo: FollowEntry[];
  removerSeguidor?: (usuario: string) => void;
  canManage?: boolean;
}

const ModalSeguidores: React.FC<ModalSeguidoresProps> = ({
  onCloseSeguidores,
  onOpenSeguindo,
  seguidores,
  seguindo,
  removerSeguidor,
  canManage = true,
}) => {
  const { t } = useTranslation();
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
          value={t("common.close")}
          onClick={onCloseSeguidores}
        />
        <div className="seguidores-header">
          <div
            className="prf-segui-op"
            id="prf-segui-op-seguidores"
            style={{ backgroundColor: "var(--roxo1)" }}
          >
            <span>{t("perfil.followersCount", { count: seguidores.length })}</span>
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
          {filteredSeguidores.length > 0 ? (
            filteredSeguidores.map((seguidor, index) => (
              <div
                key={index}
                className={`seguidor-item ${index % 2 === 0 ? "seguidor-item-par" : "seguidor-item-impar"}`}
              >
                <img
                  className="seguidor-foto"
                  src={seguidor.foto || imagemPerfilExemplo}
                  alt={t("perfil.followersModal.followerPhotoAlt")}
                />
                <div className="seguidor-info">
                  <span className="seguidor-nome">{seguidor.nome}</span>
                  <span className="seguidor-usuario">{seguidor.usuario}</span>
                </div>
                {canManage && removerSeguidor && (
                  <button
                    className="seguidor-botao"
                    onClick={() => removerSeguidor(seguidor.usuario)}
                  >
                    {t("common.remove")}
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

export default ModalSeguidores;
