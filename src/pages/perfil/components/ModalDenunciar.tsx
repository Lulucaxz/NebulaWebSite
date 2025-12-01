import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../perfil.css";

interface ModalDenunciarProps {
  onClose: () => void; // Função para fechar o modal
}

const reportTopics = [
  "displayName",
  "username",
  "biography",
  "profilePhoto",
  "banner",
] as const;

const ModalDenunciar: React.FC<ModalDenunciarProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [denunCharCount, setDenunCharCount] = useState(0); // Estado para contagem de caracteres
  const [selectedTopics, setSelectedTopics] = useState<Array<typeof reportTopics[number]>>([]); // Estado para tópicos selecionados

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDenunCharCount(e.target.value.length); // Atualiza a contagem de caracteres
  };

  const toggleTopic = (topic: typeof reportTopics[number]) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic) // Remove o tópico se já estiver selecionado
        : [...prev, topic] // Adiciona o tópico se não estiver selecionado
    );
  };

  return (
    <div className="prf-modal-backdrop" onClick={onClose}>
      <div className="aba-denunciar" onClick={(e) => e.stopPropagation()}>
        <span style={{ fontSize: "20px", color: "var(--branco)" }}>
          {t("perfil.reportModal.title")}
        </span>
        <span style={{ color: "var(--cinza-claro1)", fontSize: "16px" }}>
          {t("perfil.reportModal.description")}
        </span>
        <span style={{ fontSize: "20px", color: "var(--branco)" }}>
          {t("perfil.reportModal.topicTitle")}
        </span>
        <div className="prf-denuncia-topicos">
          {reportTopics.map((topic) => (
            <div
              key={topic}
              className="prf-denuncia-topico"
              style={{
                backgroundColor: selectedTopics.includes(topic)
                  ? "var(--roxo1)"
                  : "", 
                cursor: "pointer",
              }}
              onClick={() => toggleTopic(topic)}
            >
              {t(`perfil.reportModal.topics.${topic}`)}
            </div>
          ))}
        </div>
        <div className="prf-denuncia-container-texto">
          <span style={{ fontSize: "20px", color: "var(--branco)" }}>
            {t("perfil.reportModal.textTitle")}
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: denunCharCount === 1000 ? "red" : "var(--cinza-claro1)",
            }}
          >
            <span>{t("perfil.reportModal.textDescription")}</span>
            <span>{denunCharCount}/1000</span>
          </div>

          <textarea
            className="prf-editar-biografia"
            placeholder={t("perfil.reportModal.placeholder")}
            rows={5}
            maxLength={1000}
            style={{ maxHeight: "400px", overflowY: "auto" }}
            onChange={handleTextChange}
          />
        </div>
        <div
          className="modal-actions"
          style={{ display: "flex", justifyContent: "end", gap: "25px" }}
        >
          <button
            className="prf-botao-editar-enviar cancelar"
            onClick={onClose}
          >
            {t("common.cancel")}
          </button>
          <button className="prf-botao-editar-enviar" onClick={onClose}>
            {t("perfil.reportModal.submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDenunciar;
