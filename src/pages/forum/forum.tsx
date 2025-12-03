import { useState, useMemo, useRef, useEffect, useCallback, type ChangeEvent, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import "./forum-i18n"; // Importa as traduções
import { Comentario } from "./components/Comentario";
import type { ComentarioData, RespostaData, DestinoResposta } from "./types";
import { initial_comentarios } from "./components/comentariosDados";
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import { API_BASE, fetchWithCredentials } from "../../api";
import { showAlert } from "../../Alert";
import "./Forum.css";
import { translateForumTag } from "./tagUtils";

interface ForumPostsResponse {
  items: ComentarioData[];
  nextCursor: string | null;
  hasMore: boolean;
}

type UsuarioAtual = {
  id?: number;
  nome: string;
  assinatura: ComentarioData["assinatura"];
  fotoPerfil: string;
  avaliacaoClass: string;
};

// Move TAGS_DISPONIVEIS inside component or translate them dynamically
const TAGS_KEYS = [
  "Dúvida",
  "Órbita",
  "Galáxia",
  "Universo",
  "Conselho",
  "Problema",
  "Convite",
  "Material",
  "Debate",
  "Observação"
];

const usuarioPadrao = (initial_comentarios as unknown as ComentarioData[]).find((comentario) => comentario.eDoUsuario);

const normalizarResposta = (resposta: RespostaData): RespostaData => ({
  ...resposta,
  likesCount: typeof resposta.likesCount === "number" ? resposta.likesCount : 0,
  usuarioCurtiu: typeof resposta.usuarioCurtiu === "boolean" ? resposta.usuarioCurtiu : false,
  arrayRespostasAninhadas: resposta.arrayRespostasAninhadas?.map(normalizarResposta),
});

const normalizarComentario = (comentario: ComentarioData): ComentarioData => ({
  ...comentario,
  numeroAvaliacao: typeof comentario.numeroAvaliacao === "number"
    ? comentario.numeroAvaliacao
    : Number(comentario.numeroAvaliacao ?? 0),
  usuarioCurtiu: typeof comentario.usuarioCurtiu === "boolean" ? comentario.usuarioCurtiu : false,
  arrayRespostas: comentario.arrayRespostas?.map(normalizarResposta) ?? [],
  foiEditado: Boolean(comentario.foiEditado),
});

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
  const { t } = useTranslation();
  const [comentarios, setComentarios] = useState<ComentarioData[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [tagsSelecionadasFiltro, setTagsSelecionadasFiltro] = useState<string[]>([]);
  const [tagsAbertas, setTagsAbertas] = useState(false);
  const [visualizandoRespostas, setVisualizandoRespostas] = useState(false);
  const [respondendoA, setRespondendoA] = useState<DestinoResposta | null>(null);
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
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioAtual>({
    id: undefined,
    nome: usuarioPadrao?.nomeUsuario ?? "Você",
    assinatura: (usuarioPadrao?.assinatura ?? "Universo") as ComentarioData["assinatura"],
    fotoPerfil: usuarioPadrao?.fotoPerfil ?? "/icones-usuarios/FotoPerfil12.jpg",
    avaliacaoClass: usuarioPadrao?.avaliacaoDoUsuario ?? "esteUsuario"
  });
  const [carregandoPosts, setCarregandoPosts] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [cursorProximaPagina, setCursorProximaPagina] = useState<string | null>(null);
  const [temMaisPosts, setTemMaisPosts] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [enviandoPublicacao, setEnviandoPublicacao] = useState(false);
  const [enviandoResposta, setEnviandoResposta] = useState(false);
  const [salvandoComentarioEdicao, setSalvandoComentarioEdicao] = useState(false);
  const [salvandoRespostaEdicao, setSalvandoRespostaEdicao] = useState(false);

  // Translate tags for display
  const TAGS_DISPONIVEIS = useMemo(() => [...TAGS_KEYS], []);

  const getTagLabel = useCallback((tag: string) => translateForumTag(tag, t), [t]);

  const aplicarAutoria = useCallback((lista: ComentarioData[], usuarioId?: number) => {
    if (!usuarioId) {
      return lista;
    }

    const mapResposta = (resposta: RespostaData): RespostaData => {
      const filhos = resposta.arrayRespostasAninhadas
        ? resposta.arrayRespostasAninhadas.map(mapResposta)
        : undefined;
      return {
        ...resposta,
        eDoUsuario: typeof resposta.usuarioId === "number" && resposta.usuarioId === usuarioId,
        arrayRespostasAninhadas: filhos
      };
    };

    return lista.map((comentario) => ({
      ...comentario,
      eDoUsuario: typeof comentario.usuarioId === "number" && comentario.usuarioId === usuarioId,
      arrayRespostas: comentario.arrayRespostas.map(mapResposta)
    }));
  }, []);

  useEffect(() => {
    let ativo = true;
    const carregarUsuario = async () => {
      try {
        const resposta = await fetchWithCredentials(`${API_BASE}/auth/me`);
        if (!resposta.ok) {
          return;
        }
        const dados = await resposta.json();
        if (!ativo) {
          return;
        }
        setUsuarioAtual((prev) => ({
          ...prev,
          id: typeof dados.id === "number" ? dados.id : prev.id,
          nome: typeof dados.username === "string" && dados.username.trim() ? dados.username : (typeof dados.user === "string" && dados.user.trim() ? dados.user : prev.nome),
          fotoPerfil: typeof dados.icon === "string" && dados.icon.trim() ? dados.icon : prev.fotoPerfil
        }));
      } catch {
        // ignora falha silenciosamente
      }
    };

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, []);

  const carregarPagina = useCallback(async (cursor?: string, append = false) => {
    const params = new URLSearchParams();
    params.set("limit", "10");
    if (cursor) {
      params.set("cursor", cursor);
    }

    const resposta = await fetchWithCredentials(`${API_BASE}/api/forum/posts?${params.toString()}`);
    if (!resposta.ok) {
      throw new Error("Falha ao carregar comentários");
    }

    const dados: ForumPostsResponse = await resposta.json();
    const normalizados = dados.items.map(normalizarComentario);
    setComentarios(prev => {
      const base = append ? [...prev, ...normalizados] : normalizados;
      return aplicarAutoria(base, usuarioAtual.id);
    });
    setCursorProximaPagina(dados.nextCursor);
    setTemMaisPosts(dados.hasMore);
  }, [aplicarAutoria, usuarioAtual.id]);

  useEffect(() => {
    let ativo = true;
    const carregarInicial = async () => {
      setCarregandoPosts(true);
      setErroCarregamento(null);
      try {
        await carregarPagina();
      } catch {
        if (!ativo) {
          return;
        }
        setErroCarregamento("Não foi possível carregar as publicações agora.");
        const fallback = (initial_comentarios as unknown as ComentarioData[]).map(normalizarComentario);
        setComentarios(aplicarAutoria(fallback, usuarioAtual.id));
        setTemMaisPosts(false);
      } finally {
        if (ativo) {
          setCarregandoPosts(false);
        }
      }
    };

    carregarInicial();

    return () => {
      ativo = false;
    };
  }, [carregarPagina, aplicarAutoria, usuarioAtual.id]);

  const carregarMaisPosts = useCallback(async () => {
    if (!temMaisPosts || !cursorProximaPagina || carregandoMais) {
      return;
    }
    setCarregandoMais(true);
    setErroCarregamento(null);
    try {
      await carregarPagina(cursorProximaPagina, true);
    } catch {
      setErroCarregamento("Não foi possível carregar mais publicações.");
    } finally {
      setCarregandoMais(false);
    }
  }, [temMaisPosts, cursorProximaPagina, carregandoMais, carregarPagina]);

  useEffect(() => {
    if (!temMaisPosts) {
      return;
    }

    const aoScroll = () => {
      if (carregandoMais || !cursorProximaPagina) {
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 400) {
        carregarMaisPosts();
      }
    };

    window.addEventListener("scroll", aoScroll);
    return () => {
      window.removeEventListener("scroll", aoScroll);
    };
  }, [temMaisPosts, carregandoMais, cursorProximaPagina, carregarMaisPosts]);

  useEffect(() => {
    if (!usuarioAtual.id) {
      return;
    }
    setComentarios(prev => aplicarAutoria(prev, usuarioAtual.id));
  }, [usuarioAtual.id, aplicarAutoria]);

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

  const handleCriarPublicacao = async () => {
    if (!formularioValido) {
      showAlert(t('Por favor, preencha todos os campos obrigatórios'));
      return;
    }

    if (enviandoPublicacao) {
      return;
    }

    setEnviandoPublicacao(true);
    try {
      const resposta = await fetchWithCredentials(`${API_BASE}/api/forum/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temaPergunta: tituloPublicacao.trim(),
          conteudoComentario: conteudoPublicacao.trim(),
          tags: tagsSelecionadas,
          imagemComentario: imagemPublicacao,
          assinatura: usuarioAtual.assinatura,
          numeroAvaliacao: 0,
          avaliacaoDoUsuario: usuarioAtual.avaliacaoClass,
          nomeUsuario: usuarioAtual.nome,
          fotoPerfil: usuarioAtual.fotoPerfil,
          usuarioId: usuarioAtual.id ?? null
        })
      });

      if (!resposta.ok) {
        throw new Error('Falha ao criar publicação');
      }

      const novoComentario = normalizarComentario(await resposta.json());
      setComentarios(prev => aplicarAutoria([novoComentario, ...prev], usuarioAtual.id));
      handleResetFormulario();
    } catch (error) {
      console.error(error);
      showAlert(t('Não foi possível criar sua publicação agora. Tente novamente mais tarde.'));
    } finally {
      setEnviandoPublicacao(false);
    }
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
  const handleResponderA = (resposta: DestinoResposta | null) => {
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

  const handleDeleteResposta = async (idResposta: number) => {
    if (!window.confirm(t('Deseja realmente excluir esta resposta?'))) {
      return;
    }

    try {
      const resposta = await fetchWithCredentials(`${API_BASE}/api/forum/replies/${idResposta}`, {
        method: 'DELETE'
      });
      if (!resposta.ok) {
        throw new Error('Falha ao excluir resposta');
      }

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
    } catch (error) {
      console.error(error);
      showAlert(t('Não foi possível excluir a resposta. Tente novamente.'));
    }
  };

  const handleDeleteComentario = async (idComentario: number) => {
    if (!window.confirm(t('Deseja realmente excluir esta publicação?'))) {
      return;
    }

    try {
      const resposta = await fetchWithCredentials(`${API_BASE}/api/forum/posts/${idComentario}`, {
        method: 'DELETE'
      });
      if (!resposta.ok) {
        throw new Error('Falha ao excluir comentário');
      }
      setComentarios(prev => prev.filter(c => c.idComentario !== idComentario));
      if (respondendoA?.comentarioId === idComentario) {
        handleResponderA(null);
      }
    } catch (error) {
      console.error(error);
      showAlert(t('Não foi possível excluir esta publicação.'));
    }
  };

  const handleToggleCurtirComentario = async (idComentario: number, jaCurtiu: boolean) => {
    try {
      const resposta = await fetchWithCredentials(`${API_BASE}/api/forum/posts/${idComentario}/likes`, {
        method: jaCurtiu ? 'DELETE' : 'POST'
      });

      if (resposta.status === 401) {
        showAlert(t('Faça login para curtir publicações.'));
        return;
      }

      if (!resposta.ok) {
        throw new Error('Falha ao atualizar curtida');
      }

      const dados: { likesCount: number; usuarioCurtiu: boolean } = await resposta.json();
      setComentarios(prev => prev.map(comentario =>
        comentario.idComentario === idComentario
          ? { ...comentario, numeroAvaliacao: dados.likesCount, usuarioCurtiu: dados.usuarioCurtiu }
          : comentario
      ));
    } catch (error) {
      console.error(error);
      showAlert(t('Não foi possível atualizar a curtida da publicação.'));
    }
  };

  const handleToggleCurtirResposta = async (idResposta: number, jaCurtiu: boolean) => {
    try {
      const resposta = await fetchWithCredentials(`${API_BASE}/api/forum/replies/${idResposta}/likes`, {
        method: jaCurtiu ? 'DELETE' : 'POST'
      });

      if (resposta.status === 401) {
        showAlert(t('Faça login para curtir respostas.'));
        return;
      }

      if (!resposta.ok) {
        throw new Error('Falha ao atualizar curtida da resposta');
      }

      const dados: { likesCount: number; usuarioCurtiu: boolean } = await resposta.json();
      setComentarios(prev => prev.map(comentario => {
        const { lista, atualizou } = atualizarRespostaPorId(
          comentario.arrayRespostas,
          idResposta,
          respostaAntiga => ({
            ...respostaAntiga,
            likesCount: dados.likesCount,
            usuarioCurtiu: dados.usuarioCurtiu
          })
        );
        return atualizou ? { ...comentario, arrayRespostas: lista } : comentario;
      }));
    } catch (error) {
      console.error(error);
      showAlert(t('Não foi possível atualizar a curtida da resposta.'));
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
  const handleSalvarEdicaoComentario = async () => {
    if (!editandoComentario || !tituloPublicacao.trim() || !conteudoPublicacao.trim() || tagsSelecionadas.length === 0) {
      showAlert(t('Por favor, preencha todos os campos obrigatórios'));
      return;
    }

    if (salvandoComentarioEdicao) {
      return;
    }

    setSalvandoComentarioEdicao(true);
    try {
      const resposta = await fetchWithCredentials(`${API_BASE}/api/forum/posts/${editandoComentario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temaPergunta: tituloPublicacao.trim(),
          conteudoComentario: conteudoPublicacao.trim(),
          tags: tagsSelecionadas,
          imagemComentario: imagemPublicacao
        })
      });

      if (!resposta.ok) {
        throw new Error('Falha ao salvar edição');
      }

      const comentarioAtualizado = normalizarComentario(await resposta.json());
      setComentarios(prev => aplicarAutoria(
        prev.map(c => c.idComentario === comentarioAtualizado.idComentario ? comentarioAtualizado : c),
        usuarioAtual.id
      ));
      setEditandoComentario(null);
      handleResetFormulario();
      showAlert(t('Comentário editado com sucesso!'));
    } catch (error) {
      console.error(error);
      showAlert(t('Não foi possível salvar sua edição agora.'));
    } finally {
      setSalvandoComentarioEdicao(false);
    }
  };

  // Função para salvar edição de resposta
  const handleSalvarEdicaoResposta = async () => {
    if (!editandoResposta || !conteudoPublicacao.trim()) {
      showAlert(t('Por favor, preencha o conteúdo da resposta'));
      return;
    }

    if (salvandoRespostaEdicao) {
      return;
    }

    setSalvandoRespostaEdicao(true);
    try {
      const resposta = await fetchWithCredentials(`${API_BASE}/api/forum/replies/${editandoResposta.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conteudoComentario: conteudoPublicacao.trim(),
          imagemComentario: imagemPublicacao
        })
      });

      if (!resposta.ok) {
        throw new Error('Falha ao salvar resposta');
      }

      const respostaAtualizada = normalizarResposta(await resposta.json());
      setComentarios(prev => aplicarAutoria(prev.map(c => {
        const { lista, atualizou } = atualizarRespostaPorId(
          c.arrayRespostas,
          respostaAtualizada.idResposta,
          respostaAntiga => ({
            ...respostaAntiga,
            rconteudoComentario: respostaAtualizada.rconteudoComentario,
            rimagemComentario: respostaAtualizada.rimagemComentario,
            rdataHora: respostaAtualizada.rdataHora
          })
        );
        return atualizou ? { ...c, arrayRespostas: lista } : c;
      }), usuarioAtual.id));

      setEditandoResposta(null);
      resetConteudoEImagem();
      showAlert(t('Resposta editada com sucesso!'));
    } catch (error) {
      console.error(error);
      showAlert(t('Não foi possível salvar a edição da resposta.'));
    } finally {
      setSalvandoRespostaEdicao(false);
    }
  };

  const handleEnviarResposta = async () => {
    if (!respondendoA) {
      return;
    }

    if (!conteudoPublicacao.trim()) {
      showAlert(t('Por favor, preencha o conteúdo da resposta'));
      return;
    }

    if (enviandoResposta) {
      return;
    }

    const destinoExiste = comentarios.some(c => {
      if (c.idComentario !== respondendoA.comentarioId) {
        return false;
      }
      if (respondendoA.tipo === 'comentario') {
        return true;
      }
      return existeRespostaPorId(c.arrayRespostas, respondendoA.id);
    });

    if (!destinoExiste) {
      showAlert(t('Não foi possível encontrar a publicação original. Ela pode ter sido removida.'));
      handleResponderA(null);
      resetConteudoEImagem();
      return;
    }

    setEnviandoResposta(true);
    try {
      const resposta = await fetchWithCredentials(`${API_BASE}/api/forum/posts/${respondendoA.comentarioId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conteudoComentario: conteudoPublicacao.trim(),
          imagemComentario: imagemPublicacao,
          assinatura: usuarioAtual.assinatura,
          nomeUsuario: usuarioAtual.nome,
          fotoPerfil: usuarioAtual.fotoPerfil,
          parentRespostaId: respondendoA.tipo === 'resposta' ? respondendoA.id : null,
          usuarioId: usuarioAtual.id ?? null
        })
      });

      if (!resposta.ok) {
        throw new Error('Falha ao enviar resposta');
      }

      const novaResposta = normalizarResposta(await resposta.json());
      setComentarios(prev => aplicarAutoria(prev.map(c => {
        if (c.idComentario !== respondendoA.comentarioId) {
          return c;
        }
        if (respondendoA.tipo === 'comentario') {
          return {
            ...c,
            arrayRespostas: [novaResposta, ...c.arrayRespostas]
          };
        }
        const { lista, adicionou } = adicionarRespostaComoFilha(c.arrayRespostas, respondendoA.id, novaResposta);
        return adicionou ? { ...c, arrayRespostas: lista } : c;
      }), usuarioAtual.id));

      resetConteudoEImagem();
      setRespondendoA(null);
    } catch (error) {
      console.error(error);
      showAlert(t('Não foi possível enviar sua resposta agora. Tente novamente.'));
    } finally {
      setEnviandoResposta(false);
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
        <p>{t('Escolha uma imagem')}</p>
        <div
          className={`forum-upload-area ${imagemPublicacao ? 'has-preview' : ''}`}
          onClick={() => imagemInputRef.current?.click()}
          onKeyDown={handleUploadAreaKeyDown}
          role="button"
          tabIndex={0}
        >
          {imagemPublicacao ? (
            <div className="forum-upload-preview">
              <img src={imagemPublicacao} alt={t('Pré-visualização da postagem')} />
              <button
                type="button"
                className="forum-upload-remove"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemoverImagem();
                }}
              >
                {t('Remover imagem')}
              </button>
            </div>
          ) : (
            <>
              <img src="/icons/image-icon.svg" alt="Upload" />
              <span>{t('Selecione sua imagem')}</span>
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
            <h3>{t('Você está editando sua postagem')}</h3>

            {/* Tags de escolha */}
            <div className="forum-escolha-tags">
              <p>{t('Escolha as etiquetas para sua postagem (obrigatório)')}</p>
              <div className="forum-tags-opcoes">
                {TAGS_DISPONIVEIS.map(tag => (
                  <button
                    key={tag}
                    className={`forum-tag-opcao ${tagsSelecionadas.includes(tag) ? 'selecionada' : ''}`}
                    onClick={() => toggleTagSelecionada(tag)}
                  >
                    {getTagLabel(tag)}
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div className="forum-titulo-container">
              <p>{t('Coloque um título (obrigatório)')}</p>
              <input
                type="text"
                placeholder={t('Escreva aqui...')}
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
              <p>{t('Coloque o seu texto')}</p>
              <textarea
                placeholder={t('Escreva aqui...')}
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
                {t('Cancelar')}
              </button>
              <button
                className="forum-botao-enviar"
                onClick={handleSalvarEdicaoComentario}
                disabled={salvandoComentarioEdicao}
              >
                {salvandoComentarioEdicao ? t('Salvando...') : t('Enviar')}
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
            <h3>{t('Você está editando sua resposta')}</h3>

            {/* Upload de imagem */}
            {renderUploadSection()}

            {/* Texto */}
            <div className="forum-texto-container">
              <p>{t('Coloque o seu texto')}</p>
              <textarea
                placeholder={t('Escreva aqui...')}
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
                {t('Cancelar')}
              </button>
              <button
                className="forum-botao-enviar"
                onClick={handleSalvarEdicaoResposta}
                disabled={!conteudoPublicacao.trim() || salvandoRespostaEdicao}
              >
                {salvandoRespostaEdicao ? t('Salvando...') : t('Enviar')}
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
            <h3>{t('Crie sua postagem aqui')}</h3>

            {/* Tags de escolha */}
            <div className="forum-escolha-tags">
              <p>{t('Escolha as etiquetas para sua postagem (obrigatório)')}</p>
              <div className="forum-tags-opcoes">
                {TAGS_DISPONIVEIS.map(tag => (
                  <button
                    key={tag}
                    className={`forum-tag-opcao ${tagsSelecionadas.includes(tag) ? 'selecionada' : ''}`}
                    onClick={() => toggleTagSelecionada(tag)}
                  >
                    {getTagLabel(tag)}
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div className="forum-titulo-container">
              <p>{t('Coloque um título (obrigatório)')}</p>
              <input
                type="text"
                placeholder={t('Escreva aqui...')}
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
              <p>{t('Coloque o seu texto')}</p>
              <textarea
                placeholder={t('Escreva aqui...')}
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
                {t('Cancelar')}
              </button>
              <button
                className="forum-botao-enviar"
                onClick={handleCriarPublicacao}
                disabled={!formularioValido || enviandoPublicacao}
                type="button"
              >
                {enviandoPublicacao ? t('Publicando...') : t('Enviar')}
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
            <h3>{t('Selecione um post para responder')}</h3>
          </div>
        </div>
      );
    }

    // Estado 3: Respondendo a um comentário/resposta
    if (visualizandoRespostas && respondendoA) {
      return (
        <div className="forum-criar-comentario-conteudo">
          <div className="forum-criar-comentario-styck">
            <h3>{t('Respondendo', { nome: respondendoA.nome })}</h3>

            {/* Upload de imagem */}
            {renderUploadSection()}

            {/* Texto */}
            <div className="forum-texto-container">
              <p>{t('Coloque o seu texto')}</p>
              <textarea
                placeholder={t('Escreva aqui...')}
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
                {t('Cancelar')}
              </button>
              <button
                className="forum-botao-enviar"
                onClick={handleEnviarResposta}
                disabled={!conteudoPublicacao.trim() || enviandoResposta}
              >
                {enviandoResposta ? t('Enviando...') : t('Enviar')}
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
                  placeholder={t('Pesquise aqui...')}
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
                      {
                        padding: '12px 18px 33px 18px',
                        marginBottom: '-21px',
                        transition: 'all 0.3s',
                        backgroundColor: 'var(--text-primary)',
                        color: 'var(--surface-page)'
                      }
                      :
                      {
                        padding: '12px 18px 12px 18px',
                        transition: 'all 0.3s 0.4s',
                        backgroundColor: 'var(--surface-muted)',
                        color: 'var(--text-muted)'
                      }
                  }
                >
                  <span className="forum-tags-titulo">{t('Etiquetas')}</span>
                  <span className="forum-tags-arrow"
                    style={
                      tagsAbertas ?
                        { transform: 'rotateZ(0deg)', color: 'var(--surface-page)', transition: 'all 0.3s' }
                        :
                        { transform: 'rotateZ(180deg)', color: 'var(--text-muted)', transition: 'all 0.3s 0.4s' }
                    }
                  >▲</span>
                </div>
                <div className="forum-tags" style={
                  tagsAbertas ?
                    {
                      height: '472px',
                      boxShadow: '0 8px 18px color-mix(in srgb, var(--preto) 10%, transparent)',
                      padding: '6px 0',
                      transition: 'all 0.5s 0.2s'
                    }
                    :
                    { height: '0px', boxShadow: 'none', padding: '0px', transition: 'all 0.5s' }
                }>
                  {TAGS_DISPONIVEIS.map(tag => (
                    <label key={tag} className="forum-tag-checkbox">
                      <input
                        type="checkbox"
                        checked={tagsSelecionadasFiltro.includes(tag)}
                        onChange={() => toggleTagFiltro(tag)}
                      />
                      <span>{getTagLabel(tag)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Área de Comentários */}
            <div className="forum-comentarios-container">
              {erroCarregamento && (
                <div className="forum-feedback erro">{erroCarregamento}</div>
              )}

              {carregandoPosts && comentarios.length === 0 ? (
                <div className="forum-loading">
                  <div className="forum-loading__spinner" role="status" aria-live="polite">
                    <span className="forum-loading__sr-only">{t('Carregando publicações')}</span>
                  </div>
                </div>
              ) : (
                <>
                  <Comentario
                    comentarios={filteredComentarios}
                    onVisualizarRespostas={handleVisualizarRespostas}
                    onResponderA={handleResponderA}
                    respondendoA={respondendoA}
                    onEditarComentario={handleEditarComentario}
                    onEditarResposta={handleEditarResposta}
                    onDeleteComentario={handleDeleteComentario}
                    onDeleteResposta={handleDeleteResposta}
                    onToggleCurtirComentario={handleToggleCurtirComentario}
                    onToggleCurtirResposta={handleToggleCurtirResposta}
                  />

                  {filteredComentarios.length === 0 && !carregandoPosts && (
                    <div className="forum-feedback vazio">{t('Nenhuma publicação encontrada.')}</div>
                  )}
                </>
              )}

              {temMaisPosts && comentarios.length > 0 && (
                <div className="forum-load-more">
                  <button type="button" onClick={carregarMaisPosts} disabled={carregandoMais}>
                    {carregandoMais ? t('Carregando...') : t('Carregar mais')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sessão da Direita - Criar Comentários */}
          <div className="forum-sessao-direita">
            {renderizarAreaCriarComentario()}
          </div>
        </div>

        {/* Sessão de Baixo - Footer */}
        <div className="forum-sessao-baixo">
        </div>
      </div>
    </>
  );
}

export default Forum;