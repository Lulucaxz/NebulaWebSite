import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../perfil.css";
import { API_BASE, fetchWithCredentials } from "../../../api";
import type { AvaliacaoCard } from "../../../types/avaliacao";

interface ModalAvaliarPlanosProps {
  onClose: () => void; // Função para fechar o modal
}

const ModalAvaliarPlanos: React.FC<ModalAvaliarPlanosProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0); // Estado para a avaliação
  const [feedback, setFeedback] = useState(""); // Estado para o feedback
  const [submitting, setSubmitting] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const handleRatingClick = (value: number) => {
    setRating(value); // Define a avaliação selecionada
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value); // Atualiza o feedback
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (rating === 0) {
      setMensagemErro(t("perfil.reviewModal.error.noStars"));
      return;
    }

    if (feedback.trim().length < 10) {
      setMensagemErro(t("perfil.reviewModal.error.minChars"));
      return;
    }

    setMensagemErro(null);
    setSubmitting(true);

    try {
      const response = await fetchWithCredentials(
        `${API_BASE}/api/avaliacoes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estrelas: rating, texto: feedback.trim() }),
        }
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload) {
        throw new Error(
          (payload as { error?: string } | null)?.error || t("perfil.reviewModal.error.submit")
        );
      }

      const avaliacaoCriada = payload as AvaliacaoCard;
      window.dispatchEvent(
        new CustomEvent("nebula-avaliacao-criada", { detail: avaliacaoCriada })
      );

      setMensagemSucesso(t("perfil.reviewModal.success"));
      setTimeout(() => {
        setRating(0);
        setFeedback("");
        setMensagemSucesso(null);
        onClose();
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : t("perfil.reviewModal.error.unexpected");
      setMensagemErro(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="prf-modal-backdrop" onClick={onClose}>
      <div className="aba-avaliar-planos" onClick={(e) => e.stopPropagation()}>
        <span style={{ fontSize: "20px", color: "var(--branco)" }}>
          {t("perfil.reviewModal.title")}
        </span>
        <span style={{ color: "var(--cinza-claro1)", fontSize: "16px" }}>
          {t("perfil.reviewModal.description")}
        </span>
        <span style={{ fontSize: "20px", color: "var(--branco)" }}>
          {t("perfil.reviewModal.ratingPrompt")}
        </span>
        <div className="prf-avaliar-planos-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className="prf-avaliar-planos-star"
              style={{
                color: star <= rating ? "var(--roxo1)" : "var(--cinza-claro1)",
                cursor: "pointer",
                fontSize: "32px",
              }}
              onClick={() => handleRatingClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <div className="prf-avaliar-planos-feedback" style={{position:"relative"}}>
          {mensagemErro && (
            <span style={{ color: "#ff6b6b", position:"absolute", top:"-30px" }}>
              {mensagemErro}
            </span>
          )}
          {mensagemSucesso && (
            <span style={{ color: "var(--roxo1)", position:"absolute", top:"-30px" }}>
              {mensagemSucesso}
            </span>
          )}
          <textarea
            className="prf-editar-biografia"
            placeholder={t("perfil.reviewModal.placeholder")}
            rows={5}
            maxLength={1000}
            style={{ maxHeight: "400px", overflowY: "auto" }}
            value={feedback}
            onChange={handleFeedbackChange}
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
          <button
            className="prf-botao-editar-enviar"
            onClick={handleSubmit}
            disabled={submitting}
            style={
              submitting ? { opacity: 0.7, cursor: "not-allowed" } : undefined
            }
          >
            {submitting ? t("perfil.reviewModal.sending") : t("perfil.reviewModal.submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAvaliarPlanos;
