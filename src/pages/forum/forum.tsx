import { useState, useMemo } from "react";
import { Comentario, ComentarioData } from "./components/Comentario";
import { initial_comentarios } from "./components/comentariosDados";
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import "./Forum.css";

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

  // Função para lidar com mudanças no estado de visualização de respostas
  const handleVisualizarRespostas = (visualizar: boolean) => {
    setVisualizandoRespostas(visualizar);
    // Se está fechando as respostas, limpa o estado de responder
    if (!visualizar) {
      setRespondendoA(null);
      // Se estava editando uma resposta, limpa a edição
      if (editandoResposta) {
        setEditandoResposta(null);
        setConteudoPublicacao("");
      }
      // NÃO limpar editandoComentario - manter a edição de comentário ativa
    }
  };

  // Função para lidar com mudanças no estado de responder
  const handleResponderA = (resposta: { tipo: 'comentario' | 'resposta', id: number, nome: string } | null) => {
    setRespondendoA(resposta);
    // Cancelar qualquer edição em andamento
    if (editandoComentario) {
      setEditandoComentario(null);
      setTituloPublicacao("");
      setConteudoPublicacao("");
      setTagsSelecionadas([]);
    }
    if (editandoResposta) {
      setEditandoResposta(null);
      setConteudoPublicacao("");
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
    setRespondendoA(null);
  };

  // Função para iniciar edição de resposta
  const handleEditarResposta = (id: number, conteudo: string, imagem: string | null, nomeUsuario: string) => {
    setEditandoResposta({ id, conteudo, imagem, nomeUsuarioResposta: nomeUsuario });
    setConteudoPublicacao(conteudo);
    setRespondendoA(null);
    setEditandoComentario(null); // Garante que não está editando comentário
    setVisualizandoRespostas(true); // Garante que está visualizando respostas
  };

  // Função para cancelar edição
  const handleCancelarEdicao = () => {
    if (editandoComentario) {
      setEditandoComentario(null);
      setTituloPublicacao("");
      setConteudoPublicacao("");
      setTagsSelecionadas([]);
      // Se estava editando comentário e não está visualizando respostas, não fazer nada especial
    } else if (editandoResposta) {
      setEditandoResposta(null);
      setConteudoPublicacao("");
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
        tags: [...tagsSelecionadas]
      } : c));
      // Aqui você faria a requisição para o backend
      // Limpar estados após salvar
      setEditandoComentario(null);
      setTituloPublicacao("");
      setConteudoPublicacao("");
      setTagsSelecionadas([]);
      alert('Comentário editado com sucesso!');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios');
    }
  };

  // Função para salvar edição de resposta
  const handleSalvarEdicaoResposta = () => {
    if (editandoResposta && conteudoPublicacao.trim()) {
      // Atualiza resposta na lista
      setComentarios(prev => prev.map(c => ({
        ...c,
        arrayRespostas: c.arrayRespostas.map(r => r.idResposta === editandoResposta.id ? {
          ...r,
          rconteudoComentario: conteudoPublicacao
        } : r)
      })));
      // Aqui você faria a requisição para o backend
      // Limpar estados após salvar
      setEditandoResposta(null);
      setConteudoPublicacao("");
      alert('Resposta editada com sucesso!');
    } else {
      alert('Por favor, preencha o conteúdo da resposta');
    }
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
            <div className="forum-imagem-container">
              <p>Escolha uma imagem</p>
              <div className="forum-upload-area">
                <img src="/icons/image-icon.svg" alt="Upload" />
                <span>Selecione sua imagem</span>
              </div>
            </div>

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
            <div className="forum-imagem-container">
              <p>Escolha uma imagem</p>
              <div className="forum-upload-area">
                <img src="/icons/image-icon.svg" alt="Upload" />
                <span>Selecione sua imagem</span>
              </div>
            </div>

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
                  setEditandoResposta(null);
                  setConteudoPublicacao("");
                }}
              >
                Cancelar
              </button>
              <button
                className="forum-botao-enviar"
                onClick={handleSalvarEdicaoResposta}
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
              <div className="forum-contador">0/100</div>
            </div>

            {/* Upload de imagem */}
            <div className="forum-imagem-container">
              <p>Escolha uma imagem</p>
              <div className="forum-upload-area">
                <img src="/icons/image-icon.svg" alt="Upload" />
                <span>Selecione sua imagem</span>
              </div>
            </div>

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
              <div className="forum-contador">0/1000</div>
            </div>

            {/* Botões */}
            <div className="forum-botoes">
              <button className="forum-botao-cancelar">Cancelar</button>
              <button className="forum-botao-enviar">Enviar</button>
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
            <div className="forum-imagem-container">
              <p>Escolha uma imagem</p>
              <div className="forum-upload-area">
                <img src="/icons/image-icon.svg" alt="Upload" />
                <span>Selecione sua imagem</span>
              </div>
            </div>

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
              <div className="forum-contador">0/1000</div>
            </div>

            {/* Botões */}
            <div className="forum-botoes">
              <button
                className="forum-botao-cancelar"
                onClick={() => {
                  handleResponderA(null);
                  setConteudoPublicacao("");
                }}
              >
                Cancelar
              </button>
              <button className="forum-botao-enviar">Enviar</button>
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
      const alvoComentario = comentarios.find(c => c.arrayRespostas.some(r => r.idResposta === editandoResposta.id));
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