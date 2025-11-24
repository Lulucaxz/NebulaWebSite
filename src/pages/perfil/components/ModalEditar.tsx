import React from "react";
import "../perfil.css";
import { CropImageModal } from "../CropImageModal";

interface ModalEditarProps {
  onClose: () => void;
  children: React.ReactNode;
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
}) => {
  return (
    <div className="prf-modal-backdrop" onClick={onClose}>
      <div className="aba-editar" onClick={(e) => e.stopPropagation()}>
        <div
          className="prf-editor-banner"
          style={{
            height: "180px",
            backgroundImage: `url(nebulosaBanner.jpg)`,
            position: "relative",
          }}
        >
          <input
            className="prf-editor-banner-btn"
            type="button"
            value={t("Alterar banner")}
          />
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
              <span style={{ fontSize: "20px", color:"var(--branco)" }}>{t("Foto de perfil")}</span>
              <span
                style={{
                  fontSize: "16px",
                  color: "var(--cinza-claro1)",
                }}
              >
                {t("Escolha uma foto de perfil")}
              </span>
              <label
                className="prf-editar-foto-label"
                htmlFor="prf-editar-foto"
              >
                <span>Alterar foto</span>
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
              <span style={{ fontSize: "20px", color:"var(--branco)"}}>{t("Apelido")}</span>
              <span
                style={{
                  fontSize: "16px",
                  color: "var(--cinza-claro1)",
                }}
              >
                {t("Escolha seu apelido (usuário não pode ser alterado)")}
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
            <span style={{ fontSize: "20px", color:"var(--branco)" }}>Biografia</span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: bioCharCount === 1000 ? "red" : "var(--cinza-claro1)",
              }}
            >
              <span>Altere a sua biografia como quiser</span>
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
            {t("CANCELAR")}
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
