import { useState } from "react";
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
  onSwapUp?: (colIdx: number, idx: number) => void;
  onSwapDown?: (colIdx: number, idx: number) => void;
}

function AnotacoesColunas({ anotacoes, onSwapUp, onSwapDown }: Props) {
  // Separa as anotações por coluna, sempre a partir da prop
  const colunas = [[], [], []] as Anotacao[][];
  anotacoes.forEach((anot) => {
    if (anot.coluna === 1) colunas[0].push(anot);
    if (anot.coluna === 2) colunas[1].push(anot);
    if (anot.coluna === 3) colunas[2].push(anot);
  });

  const [activeIdx, setActiveIdx] = useState<{
    col: number;
    idx: number;
  } | null>(null);

  return (
    <div className="antcc-container">
      <div className="antcc-container2">
        {colunas.map((anots, colIdx) => (
          <div
            className="antcc-coluna"
            key={colIdx}
            id={`antcc-coluna${colIdx + 1}`}
          >
            {anots.map((anot, i) => {
              const isActive =
                activeIdx && activeIdx.col === colIdx && activeIdx.idx === i;
              return (
                <div
                  className="antcc-anotacao"
                  style={{ position: "relative" }}
                  key={i}
                  onMouseLeave={() => {
                    if (isActive) setActiveIdx(null);
                  }}
                >
                  {anot.imagem && (
                    <img
                      src={anot.imagem}
                      alt="Imagem anotação"
                      className="antcc-img-preview"
                      style={{ width: "100%", backgroundColor: "var(--cinza-escuro1)" }}
                    />
                  )}
                  {(anot.pdfNome || anot.texto) && (
                    <div className="antcc-anotacao-textos">
                      {anot.pdfNome && (
                        <div
                          className="antcc-pdf-nome"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 100,
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="30px"
                            viewBox="0 -960 960 960"
                            width="30px"
                            fill="var(--roxo1)"
                          >
                            <path d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5-23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                          </svg>
                          <a
                            href={anot.pdfBase64 ? anot.pdfBase64 : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "var(--roxo1)",
                              fontWeight: 600,
                              fontSize: 16,
                              textDecoration: "underline",
                              cursor: anot.pdfBase64
                                ? "pointer"
                                : "not-allowed",
                            }}
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
                  {/* Linhas aparecem sempre, mas com classe para transição */}
                  <div
                    className="antcc-anotacao-opcoes"
                  >
                    <div
                      className="antcc-anotacao-opcao"
                      id=".antcc-setas"
                      style={{
                        display: "flex",
                        gap: 10,
                        backgroundColor: "transparent",
                      }}
                    >
                      <div
                        className="antcc-seta"
                        id="antcc-seta-cima"
                        style={{ width: "100%", height: "100%", cursor: i === 0 ? "not-allowed" : "pointer", opacity: i === 0 ? 0.5 : 1 }}
                        onClick={() => {
                          if (i === 0) return;
                          if (typeof onSwapUp === 'function') onSwapUp(colIdx, i);
                        }}
                      >
                        {/* const [activeIdx, setActiveIdx] = useState<{
                        col: number;
                        idx: number;
                        } | null>(null); */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#FFFFFF"
                        >
                          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </svg>
                      </div>
                      <div
                        className="antcc-seta"
                        id="antcc-seta-baixo"
                        style={{ width: "100%", height: "100%", cursor: i === anots.length - 1 ? "not-allowed" : "pointer", opacity: i === anots.length - 1 ? 0.5 : 1, transform: "rotate(180deg)" }}
                        onClick={() => {
                          if (i === anots.length - 1) return;
                          if (typeof onSwapDown === 'function') onSwapDown(colIdx, i);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#FFFFFF"
                        >
                          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="antcc-anotacao-opcao">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                      </svg>
                      <span>Editar</span>
                    </div>
                    <div className="antcc-anotacao-opcao">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                      <span>Deletar</span>
                    </div>
                  </div>
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
