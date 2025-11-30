import "./avaliacoes.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import { avaliacoes1, avaliacoes2, avaliacoes3, avaliacoes4 } from "./avaliacoesDados";
import { useTranslation } from 'react-i18next';
import { API_BASE, fetchWithCredentials } from "../../../api";
import type { AvaliacaoCard } from "../../../types/avaliacao";

const criarSeeds = (): AvaliacaoCard[] => {
  const conjuntos = [avaliacoes1, avaliacoes2, avaliacoes3, avaliacoes4];
  const lista: AvaliacaoCard[] = [];

  conjuntos.forEach((grupo, grupoIndex) => {
    grupo.forEach((item, itemIndex) => {
      lista.push({
        id: -(grupoIndex * 1000 + itemIndex + 1),
        nome: item.nome,
        curso: item.curso.toUpperCase(),
        estrelas: item.estrelas,
        foto: item.foto,
        texto: item.texto,
        createdAt: "1970-01-01T00:00:00.000Z",
      });
    });
  });

  return lista;
};

const distribuirEmColunas = (dados: AvaliacaoCard[], colunas = 4): AvaliacaoCard[][] => {
  return Array.from({ length: colunas }, (_, colunaIndex) =>
    dados.filter((_, itemIndex) => itemIndex % colunas === colunaIndex)
  );
};

function Avaliacoes() {
  const { t } = useTranslation();

  const seedAvaliacoes = useMemo(() => criarSeeds(), []);

  const [filtroEstrelaSelecionada, setFiltroEstrelaSelecionada] = useState<number | null>(null);

  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);

  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCard[]>(seedAvaliacoes);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(false);
  const [erroAvaliacoes, setErroAvaliacoes] = useState<string | null>(null);

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

  useEffect(() => {
    let ativo = true;
    const controller = new AbortController();

    const carregarAvaliacoesRemotas = async () => {
      setCarregandoAvaliacoes(true);
      try {
        const resposta = await fetchWithCredentials(`${API_BASE}/api/avaliacoes?limit=60`, {
          signal: controller.signal,
        });

        const payload = await resposta.json().catch(() => null);

        if (!ativo) return;

        if (!resposta.ok || !Array.isArray(payload)) {
          throw new Error((payload as { error?: string } | null)?.error || "Erro ao carregar avaliações.");
        }

        if (payload.length > 0) {
          setAvaliacoes([...payload, ...seedAvaliacoes]);
        }
      } catch (error) {
        if (!ativo || controller.signal.aborted) return;
        const mensagem = error instanceof Error ? error.message : "Erro inesperado ao carregar avaliações.";
        setErroAvaliacoes(mensagem);
      } finally {
        if (ativo) {
          setCarregandoAvaliacoes(false);
        }
      }
    };

    carregarAvaliacoesRemotas();

    return () => {
      ativo = false;
      controller.abort();
    };
  }, [seedAvaliacoes]);

  useEffect(() => {
    const handleNovaAvaliacao = (event: CustomEvent<AvaliacaoCard>) => {
      setAvaliacoes((prev) => [event.detail, ...prev.filter((item) => item.id !== event.detail.id)]);
    };

    window.addEventListener("nebula-avaliacao-criada", handleNovaAvaliacao);
    return () => window.removeEventListener("nebula-avaliacao-criada", handleNovaAvaliacao);
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

  const filtrarAvaliacoes = useCallback((lista: AvaliacaoCard[]) => {
    return lista.filter((item) => {
      const cursoCondicao =
        filtrosSelecionados.length === 0 || filtrosSelecionados.includes(item.curso.toUpperCase());
      const estrelaCondicao =
        filtroEstrelaSelecionada === null || item.estrelas === filtroEstrelaSelecionada;

      return cursoCondicao && estrelaCondicao;
    });
  }, [filtrosSelecionados, filtroEstrelaSelecionada]);

  const avaliacoesFiltradas = useMemo(() => filtrarAvaliacoes(avaliacoes), [avaliacoes, filtrarAvaliacoes]);
  const colunasAvaliacoes = useMemo(() => distribuirEmColunas(avaliacoesFiltradas), [avaliacoesFiltradas]);

  return (
    <>
      <div className="container-avaliacoes">
        <div className="sessao">
          <h1>{t('AVALIAÇÕES')}</h1>
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
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
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

          {colunasAvaliacoes.map((coluna, colunaIndex) => (
            <div className="nav-comentarios" key={`coluna-${colunaIndex}`}>
              {coluna.map((item) => (
                <div className="comentario" key={item.id}>
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
                              ? "/icons/estrela-clara.svg"
                              : "/icons/estrela-escura.svg"
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
          ))}

        </div>
        {erroAvaliacoes && (
          <p style={{ marginTop: "16px", color: "var(--status-error)", textAlign: "center" }}>{erroAvaliacoes}</p>
        )}
        {carregandoAvaliacoes && (
          <p style={{ marginTop: "16px", color: "var(--cinza-claro1)", textAlign: "center" }}>
            Carregando avaliações...
          </p>
        )}
        <div className="avl-botoes-mais-menos">
          <div className="button-mais-menos" id="avl-button-menos" onClick={menosAvaliacoes}>
            <svg
              id="avl-seta-menos"
              className="seta"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
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
