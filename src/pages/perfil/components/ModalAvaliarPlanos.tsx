import React, { useState } from "react";
import "../perfil.css";
import { API_BASE, fetchWithCredentials } from "../../../api";
import type { AvaliacaoCard } from "../../../types/avaliacao";

interface ModalAvaliarPlanosProps {
  onClose: () => void; // Função para fechar o modal
}

const ModalAvaliarPlanos: React.FC<ModalAvaliarPlanosProps> = ({ onClose }) => {
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
      setMensagemErro("Selecione uma quantidade de estrelas.");
      return;
    }

    if (feedback.trim().length < 10) {
      setMensagemErro("Conte pelo menos 10 caracteres sobre sua experiência.");
      return;
    }

    setMensagemErro(null);
    setSubmitting(true);

    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/avaliacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estrelas: rating, texto: feedback.trim() }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload) {
        throw new Error((payload as { error?: string } | null)?.error || "Não foi possível enviar sua avaliação agora.");
      }

      const avaliacaoCriada = payload as AvaliacaoCard;
      window.dispatchEvent(new CustomEvent("nebula-avaliacao-criada", { detail: avaliacaoCriada }));

      setMensagemSucesso("Agradecemos pela avaliação!");
      setTimeout(() => {
        setRating(0);
        setFeedback("");
        setMensagemSucesso(null);
        onClose();
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado ao enviar sua avaliação.";
      setMensagemErro(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="prf-modal-backdrop" onClick={onClose}>
      <div className="aba-avaliar-planos" onClick={(e) => e.stopPropagation()}>
        <span style={{ fontSize: "20px", color: "var(--branco)" }}>
          Avalie nossos planos
        </span>
        <span style={{ color: "var(--cinza-claro1)", fontSize: "16px" }}>
          Aqui no nosso curso de astronomia, acreditamos que aprender vai além das aulas — é também sobre ouvir quem está do outro lado da tela: você!
            <br /><br /> Sua avaliação nos ajuda a melhorar, entender o que está funcionando e ajustar aquilo que pode ser ainda melhor. Se você curtiu as aulas, os materiais, o suporte ou teve qualquer experiência marcante durante o curso, conta pra gente!</span>
        <span style={{ fontSize: "20px", color: "var(--branco)" }}>
          De 1 a 5, quanto você avalia o nosso site?
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
        <div className="prf-avaliar-planos-feedback">
          <textarea
            className="prf-editar-biografia"
            placeholder="Deixe seu feedback aqui..."
            rows={5}
            maxLength={1000}
            style={{ maxHeight: "400px", overflowY: "auto" }}
            value={feedback}
            onChange={handleFeedbackChange}
          />
        </div>
        {mensagemErro && (
          <span style={{ color: "var(--status-error)", fontSize: "14px" }}>{mensagemErro}</span>
        )}
        {mensagemSucesso && (
          <span style={{ color: "var(--roxo1)", fontSize: "14px" }}>{mensagemSucesso}</span>
        )}
        <div
          className="modal-actions"
          style={{ display: "flex", justifyContent: "end", gap: "25px" }}
        >
          <button
            className="prf-botao-editar-enviar cancelar"
            onClick={onClose}
          >
            CANCELAR
          </button>
          <button
            className="prf-botao-editar-enviar"
            onClick={handleSubmit}
            disabled={submitting}
            style={submitting ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
          >
            {submitting ? "ENVIANDO..." : "ENVIAR AVALIAÇÃO"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAvaliarPlanos;