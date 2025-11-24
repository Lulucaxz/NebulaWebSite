import { useState, useMemo, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { Comentario } from "./components/Comentario";
import type { ComentarioData, RespostaData } from "./types";
import { initial_comentarios } from "./components/comentariosDados";
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import "./Forum.css";

const usuarioPadrao = (initial_comentarios as ComentarioData[]).find((comentario) => comentario.eDoUsuario);

const atualizarRespostaPorId = (
  respostas: RespostaData[],
  alvoId: number,
  updater: (resposta: RespostaData) => RespostaData
): { lista: RespostaData[]; atualizou: boolean } => {
  let atualizou = false;
  const lista = respostas.map(resposta => {
    if (resposta.idResposta === alvoId) {
      atualizou = true;
      return updater(resposta);
    }
    if (resposta.arrayRespostasAninhadas?.length) {
      const resultado = atualizarRespostaPorId(resposta.arrayRespostasAninhadas, alvoId, updater);
      if (resultado.atualizou) {
        atualizou = true;
        return {
          ...resposta,
          arrayRespostasAninhadas: resultado.lista
        };
      }
    }
    return resposta;
  });

  return {
    lista: atualizou ? lista : respostas,
    atualizou
  };
};

const adicionarRespostaComoFilha = (
  respostas: RespostaData[],
  alvoId: number,
  novaResposta: RespostaData
): { lista: RespostaData[]; adicionou: boolean } => {
  let adicionou = false;
  const lista = respostas.map(resposta => {
    if (resposta.idResposta === alvoId) {
      adicionou = true;
      return {
        ...resposta,
        arrayRespostasAninhadas: [...(resposta.arrayRespostasAninhadas ?? []), novaResposta]
      };
    }
    if (resposta.arrayRespostasAninhadas?.length) {
      const resultado = adicionarRespostaComoFilha(resposta.arrayRespostasAninhadas, alvoId, novaResposta);
      if (resultado.adicionou) {
        adicionou = true;
        return {
          ...resposta,
          arrayRespostasAninhadas: resultado.lista
        };
      }
    }
    return resposta;
  });

  return {
    lista: adicionou ? lista : respostas,
    adicionou
  };
};

const removerRespostaPorId = (
  respostas: RespostaData[],
  alvoId: number
): { lista: RespostaData[]; removeu: boolean } => {
  let removeu = false;
  const lista = respostas.reduce<RespostaData[]>((acc, resposta) => {
    if (resposta.idResposta === alvoId) {
      removeu = true;
      return acc;
    }

    let proximaResposta = resposta;
    if (resposta.arrayRespostasAninhadas?.length) {
      const resultado = removerRespostaPorId(resposta.arrayRespostasAninhadas, alvoId);
      if (resultado.removeu) {
        removeu = true;
        proximaResposta = {
          ...resposta,
          arrayRespostasAninhadas: resultado.lista
        };
      }
    }

    acc.push(proximaResposta);
    return acc;
  }, []);

  return {
    lista: removeu ? lista : respostas,
    removeu
  };
};

const existeRespostaPorId = (respostas: RespostaData[], alvoId: number): boolean =>
  respostas.some(resposta =>
    resposta.idResposta === alvoId ||
    (resposta.arrayRespostasAninhadas ? existeRespostaPorId(resposta.arrayRespostasAninhadas, alvoId) : false)
  );

function Forum() {
  const [comentarios, setComentarios] = useState<ComentarioData[]>(initial_comentarios as ComentarioData[]);
  const [pesquisa, setPesquisa] = useState("");
  const [tagsSelecionadasFiltro, setTagsSelecionadasFiltro] = useState<string[]>([]);
  const [tagsAbertas, setTagsAbertas] = useState(false);
  const [visualizandoRespostas, setVisualizandoRespostas] = useState(false);
  const [respondendoA, setRespondendoA] = useState<{ tipo: 'comentario' | 'resposta', id: number, nome: string } | null>(null);
  const [tituloPublicacao, setTituloPublicacao] = useState("");
  const [conteudoPublicacao, setConteudoPublicacao] = useState("");
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const [editandoComentario, setEditandoComentario] = useState<{
    id: number,
    titulo: string,
    conteudo: string,
    tags: string[],
    imagem: string | null
  } | null>(null);
  const [editandoResposta, setEditandoResposta] = useState<{
    id: number,
    conteudo: string,
    imagem: string | null,
    nomeUsuarioResposta: string
  } | null>(null);
  const [imagemPublicacao, setImagemPublicacao] = useState<string | null>(null);
  const imagemInputRef = useRef<HTMLInputElement | null>(null);

  const usuarioAtual = useMemo(() => ({
    nome: usuarioPadrao?.nomeUsuario ?? "Você",
    assinatura: (usuarioPadrao?.assinatura ?? "Universo") as ComentarioData["assinatura"],
    fotoPerfil: usuarioPadrao?.fotoPerfil ?? "/icones-usuarios/FotoPerfil12.jpg",
    avaliacaoClass: usuarioPadrao?.avaliacaoDoUsuario ?? "esteUsuario"
  }), []);

  const formularioValido = tituloPublicacao.trim().length > 0 && conteudoPublicacao.trim().length > 0 && tagsSelecionadas.length > 0;

  const limparImagemSelecionada = () => {
    setImagemPublicacao(null);
    if (imagemInputRef.current) {
      imagemInputRef.current.value = "";
    }
  };

  const resetConteudoEImagem = () => {
    setConteudoPublicacao("");
    limparImagemSelecionada();
  };

  const handleUploadImagem = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagemPublicacao(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Permitir selecionar o mesmo arquivo novamente
    event.target.value = "";
  };

  const handleRemoverImagem = () => {
    limparImagemSelecionada();
  };

  const handleUploadAreaKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      imagemInputRef.current?.click();
    }
  };

  const handleResetFormulario = () => {
    setTituloPublicacao("");
    setTagsSelecionadas([]);
    resetConteudoEImagem();
  };

  const handleCriarPublicacao = () => {
    if (!formularioValido) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const novoComentario: ComentarioData = {
      idComentario: Date.now(),
      fotoPerfil: usuarioAtual.fotoPerfil,
      nomeUsuario: usuarioAtual.nome,
      assinatura: usuarioAtual.assinatura,
      dataHora: new Date().toISOString(),
      temaPergunta: tituloPublicacao.trim(),
      conteudoComentario: conteudoPublicacao.trim(),
      numeroAvaliacao: 0,
      avaliacaoDoUsuario: usuarioAtual.avaliacaoClass,
      eDoUsuario: true,
      tags: [...tagsSelecionadas],
      imagemComentario: imagemPublicacao,
      arrayRespostas: []
    };

    setComentarios(prev => [novoComentario, ...prev]);
    handleResetFormulario();
  };

  // Função para lidar com mudanças no estado de visualização de respostas
  const handleVisualizarRespostas = (visualizar: boolean) => {
    setVisualizandoRespostas(visualizar);
    // Se está fechando as respostas, limpa o estado de responder
    if (!visualizar) {
      setRespondendoA(null);
      resetConteudoEImagem();
      // Se estava editando uma resposta, limpa a edição
      if (editandoResposta) {
        setEditandoResposta(null);
        resetConteudoEImagem();
      }
      // NÃO limpar editandoComentario - manter a edição de comentário ativa
    }
  };

  // Função para lidar com mudanças no estado de responder
  const handleResponderA = (resposta: { tipo: 'comentario' | 'resposta', id: number, nome: string } | null) => {
    setRespondendoA(resposta);
    if (resposta) {
      setEditandoComentario(null);
      setEditandoResposta(null);
      setTituloPublicacao("");
      setTagsSelecionadas([]);
    }
    resetConteudoEImagem();
    if (resposta) {
      setVisualizandoRespostas(true);
    }
    // Cancelar qualquer edição em andamento
    if (editandoComentario) {
      setEditandoComentario(null);
    }
    if (editandoResposta) {
      setEditandoResposta(null);
    }
  };

  const handleDeleteResposta = (idResposta: number) => {
    let precisaLimparResponder = false;

    setComentarios(prev => {
      const atualizado = prev.map(comentario => {
        const { lista, removeu } = removerRespostaPorId(comentario.arrayRespostas, idResposta);
        return removeu ? { ...comentario, arrayRespostas: lista } : comentario;
      });

      if (respondendoA?.tipo === 'resposta') {
        const aindaExiste = atualizado.some(c => existeRespostaPorId(c.arrayRespostas, respondendoA.id));
        precisaLimparResponder = !aindaExiste;
      }

      return atualizado;
    });

    if (precisaLimparResponder || (respondendoA && respondendoA.id === idResposta)) {
      handleResponderA(null);
    }
  };

  // Função para iniciar edição de comentário
  const handleEditarComentario = (id: number, titulo: string, conteudo: string, tags: string[], imagem: string | null) => {
    // Limpar edição de resposta primeiro
    if (editandoResposta) {
      setEditandoResposta(null);
    }
    // Definir os novos valores
    setEditandoComentario({ id, titulo, conteudo, tags, imagem });
    setTituloPublicacao(titulo);
    setConteudoPublicacao(conteudo);
    setTagsSelecionadas(tags);
    setImagemPublicacao(imagem || null);
    setRespondendoA(null);
  };

  // Função para iniciar edição de resposta
  const handleEditarResposta = (id: number, conteudo: string, imagem: string | null, nomeUsuario: string) => {
    setEditandoResposta({ id, conteudo, imagem, nomeUsuarioResposta: nomeUsuario });
    setConteudoPublicacao(conteudo);
    setImagemPublicacao(imagem || null);
    setRespondendoA(null);
    setEditandoComentario(null); // Garante que não está editando comentário
    setVisualizandoRespostas(true); // Garante que está visualizando respostas
  };

  // Função para cancelar edição
  const handleCancelarEdicao = () => {
    if (editandoComentario) {
      setEditandoComentario(null);
      handleResetFormulario();
      // Se estava editando comentário e não está visualizando respostas, não fazer nada especial
    } else if (editandoResposta) {
      setEditandoResposta(null);
      resetConteudoEImagem();
      // Mantém visualizandoRespostas como true para continuar vendo as respostas
    }
  };

  // Função para salvar edição de comentário
  const handleSalvarEdicaoComentario = () => {
    if (editandoComentario && tituloPublicacao.trim() && conteudoPublicacao.trim() && tagsSelecionadas.length > 0) {
      // Atualiza comentário na lista
      setComentarios(prev => prev.map(c => c.idComentario === editandoComentario.id ? {
        ...c,
        temaPergunta: tituloPublicacao,
        conteudoComentario: conteudoPublicacao,
        tags: [...tagsSelecionadas],
        imagemComentario: imagemPublicacao
      } : c));
      // Aqui você faria a requisição para o backend
      // Limpar estados após salvar
      setEditandoComentario(null);
      handleResetFormulario();
      alert('Comentário editado com sucesso!');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios');
    }
  };

  // Função para salvar edição de resposta
  const handleSalvarEdicaoResposta = () => {
    if (editandoResposta && conteudoPublicacao.trim()) {
        setComentarios(prev => prev.map(c => {
          const { lista, atualizou } = atualizarRespostaPorId(
            c.arrayRespostas,
            editandoResposta.id,
            resposta => ({
              ...resposta,
              rconteudoComentario: conteudoPublicacao.trim(),
              rimagemComentario: imagemPublicacao
            })
          );

          return atualizou ? { ...c, arrayRespostas: lista } : c;
        }));

      setEditandoResposta(null);
      resetConteudoEImagem();
      alert('Resposta editada com sucesso!');
    } else {
      alert('Por favor, preencha o conteúdo da resposta');
    }
  };

  const handleEnviarResposta = () => {
    if (!respondendoA) {
      return;
    }

    if (!conteudoPublicacao.trim()) {
      alert('Por favor, preencha o conteúdo da resposta');
      return;
    }

    const destinoExiste = respondendoA.tipo === 'comentario'
      ? comentarios.some(c => c.idComentario === respondendoA.id)
      : comentarios.some(c => existeRespostaPorId(c.arrayRespostas, respondendoA.id));

    if (!destinoExiste) {
      alert('Não foi possível encontrar a publicação original. Ela pode ter sido removida.');
      handleResponderA(null);
      resetConteudoEImagem();
      return;
    }

    const agora = new Date();
    const baseResposta: RespostaData = {
      idResposta: agora.getTime(),
      rfotoPerfil: usuarioAtual.fotoPerfil,
      rnomeUsuario: usuarioAtual.nome,
      assinatura: usuarioAtual.assinatura,
      rdataHora: agora.toISOString(),
      rconteudoComentario: conteudoPublicacao.trim(),
      eDoUsuario: true,
      rimagemComentario: imagemPublicacao,
      arrayRespostasAninhadas: []
    };

    setComentarios(prev => prev.map(c => {
      if (respondendoA.tipo === 'comentario' && c.idComentario === respondendoA.id) {
        return {
          ...c,
          arrayRespostas: [baseResposta, ...c.arrayRespostas]
        };
      }

      if (respondendoA.tipo === 'resposta') {
        const { lista, adicionou } = adicionarRespostaComoFilha(c.arrayRespostas, respondendoA.id, baseResposta);
        return adicionou ? { ...c, arrayRespostas: lista } : c;
      }

      return c;
    }));

    resetConteudoEImagem();
    setRespondendoA(null);
  };

  // Função para toggle de tags selecionadas
  const toggleTagSelecionada = (tag: string) => {
    setTagsSelecionadas(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const tags = ["Dúvida", "Órbita", "Galáxia", "Universo", "Conselho", "Problema", "Convite", "Material", "Debate", "Observação"];

  const toggleTagFiltro = (tag: string) => {
    setTagsSelecionadasFiltro(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const renderizarAreaCriarComentario = () => {
    const renderUploadSection = () => (
      <div className="forum-imagem-container">
        <p>Escolha uma imagem</p>
        <div
          className={`forum-upload-area ${imagemPublicacao ? 'has-preview' : ''}`}
          onClick={() => imagemInputRef.current?.click()}
          onKeyDown={handleUploadAreaKeyDown}
          role="button"
          tabIndex={0}
        >
          {imagemPublicacao ? (
            <div className="forum-upload-preview">
              <img src={imagemPublicacao} alt="Pré-visualização da postagem" />
              <button
                type="button"
                className="forum-upload-remove"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemoverImagem();
                }}
              >
                Remover imagem
              </button>
            </div>
          ) : (
            <>
              <img src="/icons/image-icon.svg" alt="Upload" />
              <span>Selecione sua imagem</span>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={imagemInputRef}
          className="forum-upload-input"
          onChange={handleUploadImagem}
        />
      </div>
    );

    // Estado Edição de Comentário (tem prioridade)
    if (editandoComentario) {
      return (
        <div className="forum-criar-comentario-conteudo">
          <div className="forum-criar-comentario-styck">
            <h3>Você está editando sua postagem</h3>

            {/* Tags de escolha */}
            <div className="forum-escolha-tags">
              <p>Escolha as etiquetas para sua postagem (obrigatório)</p>
              <div className="forum-tags-opcoes">
                {["Dúvida", "Órbita", "Galáxia", "Universo", "Conselho", "Problema", "Convite", "Material", "Debate", "Observação"].map(tag => (
                  <button
                    key={tag}
                    className={`forum-tag-opcao ${tagsSelecionadas.includes(tag) ? 'selecionada' : ''}`}
                    onClick={() => toggleTagSelecionada(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div className="forum-titulo-container">
              <p>Coloque um título (obrigatório)</p>
              <input
                type="text"
                placeholder="Escreva aqui..."
                value={tituloPublicacao}
                onChange={(e) => setTituloPublicacao(e.target.value)}
                className="forum-input-titulo"
                maxLength={100}
              />
              <div className="forum-contador">{tituloPublicacao.length}/100</div>
            </div>

            {/* Upload de imagem */}
            {renderUploadSection()}

            {/* Texto */}
            <div className="forum-texto-container">
              <p>Coloque o seu texto</p>
              <textarea
                placeholder="Escreva aqui..."
                value={conteudoPublicacao}
                onChange={(e) => setConteudoPublicacao(e.target.value)}
                maxLength={1000}
                className="forum-textarea-conteudo"
              />
              <div className="forum-contador">{conteudoPublicacao.length}/1000</div>
            </div>

            {/* Botões */}
            <div className="forum-botoes">
              <button
                className="forum-botao-cancelar"
                onClick={handleCancelarEdicao}
              >
                Cancelar
              </button>
              <button
                className="forum-botao-enviar"
                onClick={handleSalvarEdicaoComentario}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Estado Edição de Resposta
    if (editandoResposta && visualizandoRespostas) {
      return (
        <div className="forum-criar-comentario-conteudo">
          <div className="forum-criar-comentario-styck">
            <h3>Você está editando sua resposta</h3>

            {/* Upload de imagem */}
            {renderUploadSection()}

            {/* Texto */}
            <div className="forum-texto-container">
              <p>Coloque o seu texto</p>
              <textarea
                placeholder="Escreva aqui..."
                value={conteudoPublicacao}
                onChange={(e) => setConteudoPublicacao(e.target.value)}
                maxLength={1000}
                className="forum-textarea-conteudo"
              />
              <div className="forum-contador">{conteudoPublicacao.length}/1000</div>
            </div>

            {/* Botões */}
            <div className="forum-botoes">
              <button
                className="forum-botao-cancelar"
                onClick={handleCancelarEdicao}
              >
                Cancelar
              </button>
              <button
                className="forum-botao-enviar"
                onClick={handleSalvarEdicaoResposta}
                disabled={!conteudoPublicacao.trim()}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Estado 1: Criando nova publicação (quando não está vendo respostas)
    if (!visualizandoRespostas && !respondendoA) {
      return (
        <div className="forum-criar-comentario-conteudo">
          <div className="forum-criar-comentario-styck">
            <h3>Crie sua postagem aqui</h3>

            {/* Tags de escolha */}
            <div className="forum-escolha-tags">
              <p>Escolha as etiquetas para sua postagem (obrigatório)</p>
              <div className="forum-tags-opcoes">
                {["Dúvida", "Órbita", "Galáxia", "Universo", "Conselho", "Problema", "Convite", "Material", "Debate", "Observação"].map(tag => (
                  <button
                    key={tag}
                    className={`forum-tag-opcao ${tagsSelecionadas.includes(tag) ? 'selecionada' : ''}`}
                    onClick={() => toggleTagSelecionada(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div className="forum-titulo-container">
              <p>Coloque um título (obrigatório)</p>
              <input
                type="text"
                placeholder="Escreva aqui..."
                value={tituloPublicacao}
                onChange={(e) => setTituloPublicacao(e.target.value)}
                className="forum-input-titulo"
                maxLength={100}
              />
              <div className="forum-contador">{tituloPublicacao.length}/100</div>
            </div>

            {/* Upload de imagem */}
            {renderUploadSection()}

            {/* Texto */}
            <div className="forum-texto-container">
              <p>Coloque o seu texto</p>
              <textarea
                placeholder="Escreva aqui..."
                value={conteudoPublicacao}
                onChange={(e) => setConteudoPublicacao(e.target.value)}
                maxLength={1000}
                className="forum-textarea-conteudo"
              />
              <div className="forum-contador">{conteudoPublicacao.length}/1000</div>
            </div>

            {/* Botões */}
            <div className="forum-botoes">
              <button
                className="forum-botao-cancelar"
                onClick={handleResetFormulario}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="forum-botao-enviar"
                onClick={handleCriarPublicacao}
                disabled={!formularioValido}
                type="button"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Estado 2: Vendo respostas mas não respondendo (área preta com mensagem)
    if (visualizandoRespostas && !respondendoA) {
      return (
        <div className="forum-criar-comentario-conteudo forum-estado-selecionar">
          <div className="forum-mensagem-selecionar">
            <h3>Selecione um post para responder</h3>
          </div>
        </div>
      );
    }

    // Estado 3: Respondendo a um comentário/resposta
    if (visualizandoRespostas && respondendoA) {
      return (
        <div className="forum-criar-comentario-conteudo">
          <div className="forum-criar-comentario-styck">
            <h3>Respondendo {respondendoA.nome}</h3>

            {/* Upload de imagem */}
            {renderUploadSection()}

            {/* Texto */}
            <div className="forum-texto-container">
              <p>Coloque o seu texto</p>
              <textarea
                placeholder="Escreva aqui..."
                value={conteudoPublicacao}
                onChange={(e) => setConteudoPublicacao(e.target.value)}
                maxLength={1000}
                className="forum-textarea-conteudo"
              />
              <div className="forum-contador">{conteudoPublicacao.length}/1000</div>
            </div>

            {/* Botões */}
            <div className="forum-botoes">
              <button
                className="forum-botao-cancelar"
                onClick={() => {
                  handleResponderA(null);
                  resetConteudoEImagem();
                }}
              >
                Cancelar
              </button>
              <button
                className="forum-botao-enviar"
                onClick={handleEnviarResposta}
                disabled={!conteudoPublicacao.trim()}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Lógica de filtragem (memoizada)
  const filteredComentarios = useMemo(() => {
    const texto = pesquisa.trim().toLowerCase();
    const possuiTagsFiltro = tagsSelecionadasFiltro.length > 0;
    let base = comentarios.filter(c => {
      const matchTexto = !texto ||
        c.temaPergunta.toLowerCase().includes(texto) ||
        c.conteudoComentario.toLowerCase().includes(texto) ||
        c.tags.some(t => t.toLowerCase().includes(texto));
      const matchTags = !possuiTagsFiltro || tagsSelecionadasFiltro.some(tag => c.tags.includes(tag));
      return matchTexto && matchTags;
    });

    // Garantir visibilidade do comentário sendo editado
    if (editandoComentario) {
      const existe = base.some(c => c.idComentario === editandoComentario.id);
      if (!existe) {
        const alvo = comentarios.find(c => c.idComentario === editandoComentario.id);
        if (alvo) base = [alvo, ...base];
      }
    }
    // Garantir visibilidade do comentário da resposta sendo editada
    if (editandoResposta) {
      const alvoComentario = comentarios.find(c => c.arrayRespostas.some(r =>
        r.idResposta === editandoResposta.id ||
        r.arrayRespostasAninhadas?.some(aninhada => aninhada.idResposta === editandoResposta.id)
      ));
      if (alvoComentario && !base.some(c => c.idComentario === alvoComentario.idComentario)) {
        base = [alvoComentario, ...base];
      }
    }
    return base;
  }, [comentarios, pesquisa, tagsSelecionadasFiltro, editandoComentario, editandoResposta]);

  return (
    <>
      <Menu />
      <div className="container-forum">
        <div className="forum-conteudo-principal">
          {/* Sessão da Esquerda - Pesquisa e Comentários */}
          <div className="forum-sessao-esquerda">
            {/* Barra de Pesquisa Fixa */}
            <div className="forum-pesquisa-container">
              <div className="forum-pesquisa">
                <input
                  type="text"
                  placeholder="Pesquise aqui..."
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                />
              </div>

              <div className="forum-tags-wrapper">
                <div
                  className="forum-tags-header"
                  onClick={() => setTagsAbertas(!tagsAbertas)}
                  style={
                    tagsAbertas ?
                      { padding: '12px 18px 33px 18px', marginBottom: '-21px', transition: 'all 0.3s', backgroundColor: '#F8EFFF', color: '#282828' }
                      :
                      { padding: '12px 18px 12px 18px', transition: 'all 0.3s 0.4s', backgroundColor: '#4E4E4E', color: '#ACACAC' }
                  }
                >
                  <span className="forum-tags-titulo">Etiquetas</span>
                  <span className="forum-tags-arrow"
                    style={
                      tagsAbertas ?
                        { transform: 'rotateZ(0deg)', color: '#282828', transition: 'all 0.3s' }
                        :
                        { transform: 'rotateZ(180deg)', color: '#ACACAC', transition: 'all 0.3s 0.4s' }
                    }
                  >▲</span>
                </div>
                <div className="forum-tags" style={
                  tagsAbertas ?
                    { height: '472px', boxShadow: '0 8px 18px rgba(0,0,0,0.6)', padding: '6px 0', transition: 'all 0.5s 0.2s' }
                    :
                    { height: '0px', boxShadow: 'none', padding: '0px', transition: 'all 0.5s' }
                }>
                  {tags.map(tag => (
                    <label key={tag} className="forum-tag-checkbox">
                      <input
                        type="checkbox"
                        checked={tagsSelecionadasFiltro.includes(tag)}
                        onChange={() => toggleTagFiltro(tag)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Área de Comentários */}
            <div className="forum-comentarios-container">
              <Comentario
                comentarios={filteredComentarios}
                onVisualizarRespostas={handleVisualizarRespostas}
                onResponderA={handleResponderA}
                respondendoA={respondendoA}
                onEditarComentario={handleEditarComentario}
                onEditarResposta={handleEditarResposta}
                onDeleteComentario={(id) => setComentarios(prev => prev.filter(c => c.idComentario !== id))}
                onDeleteResposta={handleDeleteResposta}
              />
            </div>
          </div>

          {/* Sessão da Direita - Criar Comentários */}
          <div className="forum-sessao-direita">
            {renderizarAreaCriarComentario()}
          </div>
        </div>

        {/* Sessão de Baixo - Footer */}
        <div className="forum-sessao-baixo">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Forum;