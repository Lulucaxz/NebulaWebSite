import React, { useState } from "react";
import "../perfil.css";

interface ModalDenunciarProps {
  onClose: () => void; // Função para fechar o modal
}

const ModalDenunciar: React.FC<ModalDenunciarProps> = ({ onClose }) => {
  const [denunCharCount, setDenunCharCount] = useState(0); // Estado para contagem de caracteres
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]); // Estado para tópicos selecionados

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDenunCharCount(e.target.value.length); // Atualiza a contagem de caracteres
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic) // Remove o tópico se já estiver selecionado
        : [...prev, topic] // Adiciona o tópico se não estiver selecionado
    );
  };

  const topics = [
    "NOME DE EXIBIÇÃO",
    "USUARIO",
    "BIOGRAFIA",
    "FOTO PERFIL",
    "BANNER",
  ];

  return (
    <div className="prf-modal-backdrop" onClick={onClose}>
      <div className="aba-denunciar" onClick={(e) => e.stopPropagation()}>
        <span style={{ fontSize: "20px", color: "var(--branco)" }}>
          Fale-nos o motivo de sua denúncia
        </span>
        <span style={{ color: "var(--cinza-claro1)", fontSize: "16px" }}>
          Para que possamos analisar melhor o caso, por favor, explique de forma
          clara o que você está denunciando. Você pode incluir o nome da conta,
          o nome de usuário (arroba), o banner ou a biografia da pessoa. Se
          possível, descreva também o motivo da denúncia e como o conteúdo
          infringe as regras ou é ofensivo. Quanto mais detalhes você fornecer,
          mais rápido e preciso será o processo de análise.
        </span>
        <span style={{ fontSize: "20px", color: "var(--branco)" }}>
          Possíveis tópicos para denunciar
        </span>
        <div className="prf-denuncia-topicos">
          {topics.map((topic) => (
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
              {topic}
            </div>
          ))}
        </div>
        <div className="prf-denuncia-container-texto">
          <span style={{ fontSize: "20px", color: "var(--branco)" }}>
            Texto de denuncia
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: denunCharCount === 1000 ? "red" : "var(--cinza-claro1)",
            }}
          >
            <span>Escreva aqui o que você deseja denunciar</span>
            <span>{denunCharCount}/1000</span>
          </div>

          <textarea
            className="prf-editar-biografia"
            placeholder="Descreva o motivo da denúncia..."
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
            CANCELAR
          </button>
          <button className="prf-botao-editar-enviar" onClick={onClose}>
            ENVIAR DENÚNCIA
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDenunciar;
