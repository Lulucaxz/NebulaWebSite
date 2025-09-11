import React, { useState } from "react";
import "./AnotacoesColuna.css";

type Anotacao = {
  imagem: string | null;
  pdfNome: string | null;
  pdfBase64?: string | null;
  texto: string;
  coluna: number;
};

interface Props {
  anotacoes: Anotacao[];
}

function AnotacoesColunas({ anotacoes }: Props) {
  // Separa as anotações por coluna
  const colunas = [[], [], []] as Anotacao[][];
  anotacoes.forEach((anot) => {
    if (anot.coluna === 1) colunas[0].push(anot);
    if (anot.coluna === 2) colunas[1].push(anot);
    if (anot.coluna === 3) colunas[2].push(anot);
  });

  const [activeIdx, setActiveIdx] = useState<{col: number, idx: number} | null>(null);

  return (
    <div className="antcc-container">
      <div className="antcc-container2">
        {colunas.map((anots, colIdx) => (
          <div className="antcc-coluna" key={colIdx} id={`antcc-coluna${colIdx + 1}`}>
            {anots.map((anot, i) => {
              const isActive = activeIdx && activeIdx.col === colIdx && activeIdx.idx === i;
              return (
                <div
                  className="antcc-anotacao"
                  style={{ backgroundColor: "var(--cinza-escuro1)", position: "relative" }}
                  key={i}
                  onMouseLeave={() => { if (isActive) setActiveIdx(null); }}
                >
                  {anot.imagem && (
                    <img
                      src={anot.imagem}
                      alt="Imagem anotação"
                      className="antcc-img-preview"
                      style={{ width: "100%" }}
                    />
                  )}
                  {(anot.pdfNome || anot.texto) && (
                    <div className="antcc-anotacao-textos">
                      {anot.pdfNome && (
                        <div className="antcc-pdf-nome" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--roxo1)">
                            <path d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5-23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                          </svg>
                          <a
                            href={anot.pdfBase64 ? anot.pdfBase64 : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--roxo1)', fontWeight: 600, fontSize: 16, textDecoration: 'underline', cursor: anot.pdfBase64 ? 'pointer' : 'not-allowed' }}
                          >
                            {anot.pdfNome}
                          </a>
                        </div>
                      )}
                      {anot.texto && (
                        <div className="antcc-texto">{anot.texto}</div>
                      )}
                    </div>
                  )}
                  {/* Botão de três pontos */}
                  <div
                    className="antcc-anotacao-menu-btn"
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(40,40,60,0.8)",
                      borderRadius: "50%",
                      cursor: "pointer",
                      zIndex: 2,
                      transition: "opacity 0.2s",
                      opacity: isActive ? 0 : 1
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      setActiveIdx({ col: colIdx, idx: i });
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="5" cy="12" r="2" fill="#fff" />
                      <circle cx="12" cy="12" r="2" fill="#fff" />
                      <circle cx="19" cy="12" r="2" fill="#fff" />
                    </svg>
                  </div>
                  {/* Linhas aparecem apenas se ativo */}
                  {isActive && (
                    <div className="antcc-anotacao-hoverlines">
                      <div className="antcc-hoverline"></div>
                      <div className="antcc-hoverline"></div>
                      <div className="antcc-hoverline"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnotacoesColunas;
