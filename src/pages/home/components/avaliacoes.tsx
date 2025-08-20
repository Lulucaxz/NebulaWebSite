import "./avaliacoes.css";
import { useState } from "react";
import { avaliacoes1 } from "./avaliacoesDados";
import { avaliacoes2 } from "./avaliacoesDados";
import { avaliacoes3 } from "./avaliacoesDados";
import { avaliacoes4 } from "./avaliacoesDados";
import { useEffect } from "react";

function Avaliacoes() {

  const [filtroEstrelaSelecionada, setFiltroEstrelaSelecionada] = useState<number | null>(null);

  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);

  const toggleFiltroCurso = (filtro: string) => {
    setFiltrosSelecionados((prev) =>
      prev.includes(filtro)
        ? prev.filter((item) => item !== filtro)
        : [...prev, filtro]
    );
    setContainerHeight(1000);
  };

  const [containerHeight, setContainerHeight] = useState(1000);

  useEffect(() => {
    const setaMenos = document.getElementById("avl-button-menos");
    if (setaMenos) {
      setaMenos.classList.add("ligada"); // Começa desligado visualmente
    }
  }, []);

  const maisAvaliacoes = () => {
    const containerTamanhoTotal = document.getElementById("container-comentarios");
    const setaMais = document.getElementById("avl-button-mais");
    const setaMenos = document.getElementById("avl-button-menos");
  
    if (!containerTamanhoTotal || !setaMais || !setaMenos) return;
  
    const totalHeight = containerTamanhoTotal.scrollHeight;
    const novoAltura = containerHeight + 1000;
  
    if (novoAltura >= totalHeight) {
      setContainerHeight(totalHeight);
      setaMais.classList.add("desligada");
    } else {
      setContainerHeight(novoAltura);
    }
  
    // Ativa o botão de menos
    setaMenos.classList.remove("ligada");
  };

  const menosAvaliacoes = () => {
    const setaMenos = document.getElementById("avl-button-menos");
    const setaMais = document.getElementById("avl-button-mais");
  
    if (!setaMenos || !setaMais) return;
  
    if (containerHeight <= 1000) {
      setContainerHeight(1000);
      setaMenos.classList.add("ligada"); // volta ao estado desligado
    } else {
      setContainerHeight(1000);
      setaMenos.classList.add("ligada");
    }
  
    setaMais.classList.remove("desligada");
  };


  const filtroEstrela = (qualEstrela: number) => {
    setFiltroEstrelaSelecionada((prev) => (prev === qualEstrela ? null : qualEstrela));
    setContainerHeight(1000);
  };

  const filtrarAvaliacoes = (avaliacoes: any[]) => {
    return avaliacoes.filter((item) => {
      const cursoCondicao =
        filtrosSelecionados.length === 0 || filtrosSelecionados.includes(item.curso.toUpperCase());
      const estrelaCondicao =
        filtroEstrelaSelecionada === null || item.estrelas === filtroEstrelaSelecionada;

      return cursoCondicao && estrelaCondicao;
    });
  };

  return (
    <>
      <div className="container-avaliacoes">
        <div className="sessao">
          <h1>AVALIAÇÕES</h1>
          <hr />
        </div>

        <div className="container-nav-estrelas">
          <nav className="nav-estrelas-demo">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`estrela-item ${filtroEstrelaSelecionada === num ? "ativa" : ""}`}
                onClick={() => filtroEstrela(num)}
              >
                <p>{num}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="estrela-icon"
                >
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 
        2 9.24 7.46 13.97 5.82 21z" />
                </svg>
              </div>
            ))}
          </nav>

          <nav className="nav-filtros-extras-cursos">
            {["ÓRBITA", "GALÁXIA", "UNIVERSO"].map((filtro) => (
              <div
                key={filtro}
                className={`filtros-extra ${filtrosSelecionados.includes(filtro) ? "ativo" : ""}`}
                onClick={() => toggleFiltroCurso(filtro)}
              >
                {filtro}
              </div>
            ))}
          </nav>

        </div>
        <div
          className="container-nav-comentarios"
          id="container-comentarios"
          style={{ height: `${containerHeight}px` }}
        >

          <div className="nav-comentarios">
            {filtrarAvaliacoes(avaliacoes1).map((item, index) => (
              <div className="comentario" key={index}>
                <div className="comentario-content">
                  <div className="comentario-usuario">
                    <img className="comentario-usuario-icon" src={item.foto} alt="Foto do usuário" />
                    <div className="comentario-usuario-titulo">
                      <h3>{item.nome}</h3>
                      <h4>Cursa - {item.curso}</h4>
                    </div>
                  </div>
                  <div className="comentario-avaliacao">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={
                          i < item.estrelas
                            ? "/estrela-clara.svg"
                            : "/estrela-escura.svg"
                        }
                        alt={`Estrela ${i + 1}`}
                      />
                    ))}
                  </div>
                  <p className="comentario-conteudo">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="nav-comentarios">
            {filtrarAvaliacoes(avaliacoes2).map((item, index) => (
              <div className="comentario" key={index}>
                <div className="comentario-content">
                  <div className="comentario-usuario">
                    <img className="comentario-usuario-icon" src={item.foto} alt="Foto do usuário" />
                    <div className="comentario-usuario-titulo">
                      <h3>{item.nome}</h3>
                      <h4>Cursa - {item.curso}</h4>
                    </div>
                  </div>
                  <div className="comentario-avaliacao">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={
                          i < item.estrelas
                            ? "/estrela-clara.svg"
                            : "/estrela-escura.svg"
                        }
                        alt={`Estrela ${i + 1}`}
                      />
                    ))}
                  </div>
                  <p className="comentario-conteudo">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="nav-comentarios">
            {filtrarAvaliacoes(avaliacoes3).map((item, index) => (
              <div className="comentario" key={index}>
                <div className="comentario-content">
                  <div className="comentario-usuario">
                    <img className="comentario-usuario-icon" src={item.foto} alt="Foto do usuário" />
                    <div className="comentario-usuario-titulo">
                      <h3>{item.nome}</h3>
                      <h4>Cursa - {item.curso}</h4>
                    </div>
                  </div>
                  <div className="comentario-avaliacao">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={
                          i < item.estrelas
                            ? "/estrela-clara.svg"
                            : "/estrela-escura.svg"
                        }
                        alt={`Estrela ${i + 1}`}
                      />
                    ))}
                  </div>
                  <p className="comentario-conteudo">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="nav-comentarios">
            {filtrarAvaliacoes(avaliacoes4).map((item, index) => (
              <div className="comentario" key={index}>
                <div className="comentario-content">
                  <div className="comentario-usuario">
                    <img className="comentario-usuario-icon" src={item.foto} alt="Foto do usuário" />
                    <div className="comentario-usuario-titulo">
                      <h3>{item.nome}</h3>
                      <h4>Cursa - {item.curso}</h4>
                    </div>
                  </div>
                  <div className="comentario-avaliacao">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={
                          i < item.estrelas
                            ? "/estrela-clara.svg"
                            : "/estrela-escura.svg"
                        }
                        alt={`Estrela ${i + 1}`}
                      />
                    ))}
                  </div>
                  <p className="comentario-conteudo">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
        <div className="avl-botoes-mais-menos">
          <div className="button-mais-menos" id="avl-button-menos" onClick={menosAvaliacoes}>
            <svg
              id="avl-seta-menos"
              className="seta"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
              style={{ transform: "rotate(180deg)" }}
            >
              <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
            </svg>
          </div>
          <div className="button-mais-menos" id="avl-button-mais" onClick={maisAvaliacoes}>
            <svg
              id="avl-seta-mais"
              className="seta"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
            </svg>
          </div>
        </div>

      </div>
    </>
  );
}

export default Avaliacoes;
