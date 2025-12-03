import React from "react";
import "../perfil.css";
import { CropImageModal } from "../CropImageModal";

interface ModalEditarProps {
  onClose: () => void;
  t: (key: string) => string;
  fotoPreview: string;
  fotoUrl: string;
  nomeEditado: string;
  setNomeEditado: (value: string) => void;
  bioEditada: string;
  setBioEditada: (value: string) => void;
  bioCharCount: number;
  setBioCharCount: (value: number) => void;
  cropModalOpen: boolean;
  cropImageSrc: string;
  handleCropComplete: (croppedBlob: Blob) => void;
  salvarEdicao: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bannerDisplay: string;
  onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerReset: () => void;
}

const ModalEditar: React.FC<ModalEditarProps> = ({
  onClose,
  t,
  fotoPreview,
  fotoUrl,
  nomeEditado,
  setNomeEditado,
  bioEditada,
  setBioEditada,
  bioCharCount,
  setBioCharCount,
  cropModalOpen,
  cropImageSrc,
  handleCropComplete,
  salvarEdicao,
  onFileChange,
  bannerDisplay,
  onBannerChange,
  onBannerReset,
}) => {
  return (
    <div className="prf-modal-backdrop" onClick={onClose}>
      <div className="aba-editar" onClick={(e) => e.stopPropagation()}>
        <div
          className="prf-editor-banner"
          style={{
            height: "180px",
            backgroundImage: `url(${bannerDisplay})`,
            position: "relative",
          }}
        >
          <label className="prf-editor-banner-btn" htmlFor="prf-editar-banner">
            <span>{t("perfil.editor.changeBanner")}</span>
            <input
              id="prf-editar-banner"
              hidden
              type="file"
              accept="image/*"
              onChange={onBannerChange}
            />
          </label>
          <button
            type="button"
            className="prf-banner-reset"
            onClick={onBannerReset}
          >
            {t("Usar banner padrão")}
          </button>
        </div>

        <div
          className="aba-editar-informacoes-relevantes"
          style={{ padding: "25px" }}
        >
          <div className="prf-edicao-superior" style={{}}>
            <div
              className="prf-edicao-foto"
              style={{
                backgroundImage: `url(${fotoPreview ? fotoPreview : fotoUrl})`,
              }}
            ></div>
            <div className="prf-editor-foto-info">
<<<<<<< HEAD
              <span style={{ fontSize: "20px", color:"var(--branco)" }}>{t("Foto de perfil")}</span>
              <span
                style={{
                  fontSize: "16px",
                  color: "var(--cinza-claro1)",
                }}
              >
                {t("perfil.editor.choosePhoto")}
=======
              <span className="prf-sfi1">{t("Foto de perfil")}</span>
              <span className="prf-sfi2">
                {t("Escolha uma foto de perfil")}
>>>>>>> origin/responsividade-perfil
              </span>
              <label
                className="prf-editar-foto-label"
                htmlFor="prf-editar-foto"
              >
<<<<<<< HEAD
                <span>{t("perfil.editor.changePhoto")}</span>
=======
                <span className="prf-sfi3" >Alterar foto</span>
>>>>>>> origin/responsividade-perfil
                <input
                  hidden
                  id="prf-editar-foto"
                  className="prf-editar-foto-btn"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </label>
            </div>

            <div className="prf-editor-nome-info">
<<<<<<< HEAD
              <span style={{ fontSize: "20px", color:"var(--branco)"}}>{t("perfil.editor.nickname")}</span>
              <span
                style={{
                  fontSize: "16px",
                  color: "var(--cinza-claro1)",
                }}
              >
                {t("perfil.editor.nicknameHint")}
=======
              <span className="prf-sni1">{t("Apelido")}</span>
              <span className="prf-sni2">
                {t("Escolha seu apelido (usuário não pode ser alterado)")}
>>>>>>> origin/responsividade-perfil
              </span>
              <input
                className="prf-editar-nome"
                type="text"
                value={nomeEditado}
                placeholder={t("Nome")}
                onChange={(e) => setNomeEditado(e.target.value)}
              />
            </div>
          </div>

          <hr style={{margin:"25px 0"}}/>
          <div className="prf-editar-biografia-container" style={{marginBottom:"25px"}}>
            <span style={{ fontSize: "20px", color:"var(--branco)" }}>{t("Biografia")}</span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: bioCharCount === 1000 ? "red" : "var(--cinza-claro1)",
              }}
            >
              <span>{t("perfil.editor.bioHint")}</span>
              <span>{bioCharCount}/1000</span>
            </div>

            <textarea
              className="prf-editar-biografia"
              value={bioEditada}
              placeholder={t("Biografia")}
              rows={5}
              maxLength={1000}
              style={{ maxHeight: "400px", overflowY: "auto" }}
              onChange={(e) => {
                const value = e.target.value;
                setBioEditada(value);
                setBioCharCount(value.length);
              }}
            />
          </div>
          <div className="prf-editar-botoes">
          <button
            className="prf-botao-editar-enviar cancelar"
            onClick={onClose}
          >
            {t("common.cancel")}
          </button>
          <button
            className="prf-botao-editar-enviar"
            onClick={salvarEdicao}
          >
            {t("ENVIAR")}
          </button>
        </div>
        </div>

        {cropModalOpen && (
          <CropImageModal
            imageSrc={cropImageSrc}
            onCancel={() => onClose()}
            onCropComplete={handleCropComplete}
          />
        )}
      </div>
    </div>
  );
};

export default ModalEditar;
