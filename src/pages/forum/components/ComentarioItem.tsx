// ComentarioItem.jsx - Componente atualizado
import { useState, useEffect } from "react"
import { Respostas } from "./respostas"
import "./Comentario.css"
import type { RespostaData, DestinoResposta } from "../types"

interface ComentarioItemProps {
  idComentario: number
  temaPergunta: string
  nomeUsuario: string
  assinatura: "Universo" | "Galáxia" | "Órbita"
  dataHora: string
  conteudoComentario: string
  numeroAvaliacao: number
  avaliacaoDoUsuario: string
  eDoUsuario: boolean
  fotoPerfil: string
  tags: string[]
  imagemComentario?: string | null
  arrayRespostas: RespostaData[]
  onDelete: (id: number) => void
  onDeleteResposta?: (id: number) => void
  onVisualizarRespostas: (id: number, visualizar: boolean) => void
  onResponderA: (resposta: DestinoResposta | null) => void
  estaAtivo: boolean
  respondendoA: DestinoResposta | null
  onEditarComentario: (id: number, titulo: string, conteudo: string, tags: string[], imagem: string | null) => void
  onEditarResposta: (id: number, conteudo: string, imagem: string | null, nomeUsuario: string) => void
  usuarioCurtiu: boolean
  onToggleCurtirComentario?: (id: number, jaCurtiu: boolean) => Promise<void> | void
  onToggleCurtirResposta?: (id: number, jaCurtiu: boolean) => Promise<void> | void
  foiEditado?: boolean
}

export function ComentarioItem({
  idComentario,
  temaPergunta,
  nomeUsuario,
  assinatura,
  dataHora,
  conteudoComentario,
  numeroAvaliacao,
  avaliacaoDoUsuario,
  eDoUsuario,
  fotoPerfil,
  tags,
  imagemComentario,
  arrayRespostas,
  onDelete,
  onDeleteResposta,
  onVisualizarRespostas,
  onResponderA,
  estaAtivo,
  respondendoA,
  onEditarComentario,
  onEditarResposta,
  usuarioCurtiu,
  onToggleCurtirComentario,
  onToggleCurtirResposta,
  foiEditado = false
}: ComentarioItemProps) {
  const [respostas, setRespostas] = useState(arrayRespostas)
  // Sincroniza respostas quando prop mudar (edição salva no pai)
  useEffect(() => {
    setRespostas(arrayRespostas)
  }, [arrayRespostas])
  const [curtindoComentario, setCurtindoComentario] = useState(false)
  const totalAvaliacoes = Number(numeroAvaliacao)

  const handleDeleteResposta = (idResposta: number) => {
    setRespostas(prev => prev
      .filter(r => r.idResposta !== idResposta)
      .map(r => ({
        ...r,
        arrayRespostasAninhadas: r.arrayRespostasAninhadas?.filter(aninhada => aninhada.idResposta !== idResposta)
      }))
    )
    if (onDeleteResposta) {
      onDeleteResposta(idResposta);
    }
  }

  const handleLike = async () => {
    if (!onToggleCurtirComentario || curtindoComentario) {
      return
    }
    setCurtindoComentario(true)
    try {
      await onToggleCurtirComentario(idComentario, usuarioCurtiu)
    } finally {
      setCurtindoComentario(false)
    }
  }

  const formatarDataHora = (assinatura: string, dataHora: string) => {
    const data = new Date(dataHora);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${assinatura} - ${horas}:${minutos} - ${dia}/${mes}/${ano}`;
  }

  const dataHoraFormatada = formatarDataHora(assinatura, dataHora);

  const estiloComentario = {
    borderRadius: estaAtivo ? '10px 10px 0px 0px' : '10px'
  }

  const estiloRespostas = {
    height: estaAtivo ? 'auto' : '0px',
    opacity: estaAtivo ? 1 : 0
  }

  return (
    <div key={`frm-comentario${idComentario}`} id={`frm-comentario${idComentario}`}>
      <div className="frm-comentario" style={estiloComentario}>
        {/* Cabeçalho com informações do usuário e botões de ação */}
        <div className="frm-comentario-topo">
          <div className="frm-comentario-info-usuario">
            <div className="frm-comentario-foto-perfil" style={{ backgroundImage: `url(${fotoPerfil})` }}></div>
            <div className="frm-comentario-detalhes-usuario">
              <h3 className="frm-comentario-nome-usuario">{nomeUsuario}</h3>
              <span className="frm-comentario-data">{dataHoraFormatada}</span>
              {foiEditado && <span className="frm-comentario-editado"> (editado)</span>}
            </div>
          </div>

          {/* Botões de ação (editar/excluir) */}
          {eDoUsuario && (
            <div className={avaliacaoDoUsuario}>
              <button
                className="frm-comentario-botao-acao"
                onClick={() => {
                  onEditarComentario(idComentario, temaPergunta, conteudoComentario, tags, imagemComentario || null)
                }}
              >
                <img src="/icons/edit_forum.svg" alt="Editar" />
              </button>
              <button
                className="frm-comentario-botao-acao"
                onClick={() => onDelete(idComentario)}
              >
                <img src="/icons/delete.svg" alt="Excluir" />
              </button>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="frm-comentario-tags">
          {tags.map((tag, index) => (
            <span key={index} className="frm-comentario-tag">{tag}</span>
          ))}
        </div>

        {/* Título do comentário */}
        <div className="frm-comentario-titulo">
          <h2>{temaPergunta}</h2>
        </div>

        {/* Imagem do comentário (se houver) */}
        {imagemComentario && (
          <div className="frm-comentario-imagem">
            <img src={imagemComentario} alt="Imagem do comentário" />
          </div>
        )}

        {/* Conteúdo do comentário */}
        <div className="frm-comentario-conteudo-container">
          <p className="frm-comentario-conteudo">
            {conteudoComentario}
          </p>
        </div>

        {/* Área de interação (avaliação e respostas) */}
        <div className="frm-comentario-interacao">
          <div className="frm-comentario-avaliacao">
            <button 
              className={`frm-comentario-botao-avaliacao ${usuarioCurtiu ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={curtindoComentario}
            >
              <img src="/icons/like_forum.svg" alt="Avaliar" />
              <span className="frm-comentario-numero-avaliacao">{totalAvaliacoes}</span>
            </button>
          </div>

          <div className="frm-comentario-respostas-info">
            <button
              className={`frm-comentario-botao-respostas ${estaAtivo ? 'active' : ''}`}
              onClick={() => {
                const novoEstado = !estaAtivo;
                onVisualizarRespostas(idComentario, novoEstado);
                // Quando fecha as respostas, limpa o estado de responder
                if (!novoEstado) {
                  onResponderA(null);
                }
              }}
            >
              <img src="/icons/coment_forum.svg" alt="Respostas" />
              <span className="frm-comentario-numero-respostas">{respostas.length}</span>
            </button>
          </div>
        </div>

        {/* Seção de respostas */}
        <div className="frm-comentario-ver-respostas">
          <div className="ver-respostas-container" style={estiloRespostas}>
            {/* Botão para responder ao comentário principal */}
            {estaAtivo && (
              <button 
                className={`resposta-botao-responder ${respondendoA?.tipo === 'comentario' && respondendoA?.id === idComentario ? 'active' : ''}`}
                style={{ marginBottom: '20px' }}
                onClick={() => {
                  onResponderA({
                    tipo: 'comentario',
                    id: idComentario,
                    nome: nomeUsuario,
                    comentarioId: idComentario
                  });
                }}
              >
                Responder: {nomeUsuario}
              </button>
            )}
            
            {
              respostas.map(res => (
                <Respostas
                  key={`resposta${idComentario}000${res.idResposta}`}
                  rfotoPerfil={res.rfotoPerfil}
                  rnomeUsuario={res.rnomeUsuario}
                  rdataHora={res.rdataHora}
                  rconteudoComentario={res.rconteudoComentario}
                  assinatura={res.assinatura}
                  onResponderA={onResponderA}
                  idResposta={res.idResposta}
                  arrayRespostasAninhadas={res.arrayRespostasAninhadas}
                  respondendoA={respondendoA}
                  eDoUsuario={res.eDoUsuario}
                  onDeleteResposta={handleDeleteResposta}
                  rimagemComentario={res.rimagemComentario}
                  onEditarResposta={onEditarResposta}
                  comentarioId={idComentario}
                  nivel={0}
                  likesCount={res.likesCount}
                  usuarioCurtiu={res.usuarioCurtiu}
                  onToggleCurtirResposta={onToggleCurtirResposta}
                />
              ))
            }
          </div>
        </div>

        {/* Linha divisória */}
        <hr className="frm-comentario-divisor" />
      </div>
    </div>
  )
}