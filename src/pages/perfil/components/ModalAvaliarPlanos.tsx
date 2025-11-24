import React, { useState } from "react";
import "../perfil.css";

interface ModalAvaliarPlanosProps {
  onClose: () => void; // Função para fechar o modal
}

const ModalAvaliarPlanos: React.FC<ModalAvaliarPlanosProps> = ({ onClose }) => {
  const [rating, setRating] = useState(0); // Estado para a avaliação
  const [feedback, setFeedback] = useState(""); // Estado para o feedback

  const handleRatingClick = (value: number) => {
    setRating(value); // Define a avaliação selecionada
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value); // Atualiza o feedback
  };

  const handleSubmit = () => {
    // Lógica para enviar a avaliação e o feedback
    console.log("Avaliação:", rating);
    console.log("Feedback:", feedback);
    onClose(); // Fecha o modal após o envio
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
          <button className="prf-botao-editar-enviar" onClick={handleSubmit}>
            ENVIAR AVALIAÇÃO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAvaliarPlanos;