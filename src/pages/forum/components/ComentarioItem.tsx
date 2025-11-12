// ComentarioItem.jsx - Componente atualizado
import { useState } from "react"
import { Respostas } from "./respostas"
import "./Comentario.css"

interface Resposta {
  idResposta: number
  rfotoPerfil: string
  rnomeUsuario: string
  rdataHora: string
  rconteudoComentario: string
}

interface ComentarioItemProps {
  idComentario: number
  temaPergunta: string
  nomeUsuario: string
  assinatura: "Universo" | "Galáxia" | "Órbita"
  dataHora: string
  conteudoComentario: string
  numeroAvaliacao: String
  avaliacaoDoUsuario: string
  fotoPerfil: string
  tags: string[]
  imagemComentario?: string
  arrayRespostas: Resposta[]
  onDelete: (id: number) => void
  onEdit: (id: number, novoConteudo: string) => void
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
  fotoPerfil,
  tags,
  imagemComentario,
  arrayRespostas,
  onDelete,
  onEdit
}: ComentarioItemProps) {
  const [resposta, setResposta] = useState('')
  const [comteudoEditado, setComteudoEditado] = useState('')
  const [ativo, setAtivo] = useState(false)
  const [editar, setEditar] = useState(false)
  const [respostas, setRespostas] = useState(arrayRespostas)

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
    borderRadius: ativo ? '10px 10px 0px 0px' : '10px'
  }

  const estiloFormulario = {
    height: ativo ? '300px' : '0px'
  }

  const estiloRespostas = {
    height: ativo ? 'auto' : '0px',
    opacity: ativo ? 1 : 0
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
            </div>
          </div>

          {/* Botões de ação (editar/excluir) */}
          <div className={avaliacaoDoUsuario}>
            <button
              className="frm-comentario-botao-acao"
              onClick={() => {
                if (editar) {
                  if (comteudoEditado.trim() !== '') {
                    onEdit(idComentario, comteudoEditado)
                    setEditar(false)
                  }
                } else {
                  setComteudoEditado(conteudoComentario)
                  setEditar(true)
                }
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
          <p className="frm-comentario-conteudo" style={{ display: editar ? 'none' : 'block' }}>
            {conteudoComentario}
          </p>

          {/* Área de edição */}
          <div className="frm-comentario-conteudo-editar" style={{ display: !editar ? 'none' : 'block' }}>
            <textarea
              maxLength={2000}
              value={comteudoEditado}
              className="frm-comentario-conteudo-editar-input"
              onChange={e => setComteudoEditado(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey && comteudoEditado.trim() !== '') {
                  onEdit(idComentario, comteudoEditado)
                  setEditar(false)
                }
              }}
            />
          </div>
        </div>

        {/* Área de interação (avaliação e respostas) */}
        <div className="frm-comentario-interacao">
          <div className="frm-comentario-avaliacao">
            <button className="frm-comentario-botao-avaliacao">
              <img src="/icons/like_forum.svg" alt="Avaliar" />
              <span className="frm-comentario-numero-avaliacao">{numeroAvaliacao}</span>
            </button>
          </div>

          <div className="frm-comentario-respostas-info">
            <button
              className="frm-comentario-botao-respostas"
              onClick={() => setAtivo(!ativo)}
            >
              <img src="/icons/coment_forum.svg" alt="Respostas" />
              <span className="frm-comentario-numero-respostas">{respostas.length}</span>
            </button>
          </div>
        </div>

        {/* Seção de respostas */}
        <div className="frm-comentario-ver-respostas">
          <div className="ver-respostas-form-esconder" style={estiloFormulario}>
            <div className="ver-respostas-form">
              <textarea
                value={resposta}
                maxLength={400}
                placeholder="Digite sua resposta aqui"
                onChange={e => setResposta(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && resposta.trim() !== '') {
                    setRespostas(prev => [
                      ...prev,
                      {
                        idResposta: prev.length + 1,
                        rfotoPerfil: "/icones-usuarios/kurbie.jpg",
                        rnomeUsuario: "Luiz",
                        rdataHora: new Date().toLocaleString(),
                        rconteudoComentario: resposta
                      }
                    ])
                    setResposta('')
                  }
                }}
              />
              <button onClick={() => {
                if (resposta.trim() !== '') {
                  setRespostas(prev => [
                    ...prev,
                    {
                      idResposta: prev.length + 1,
                      rfotoPerfil: "/icones-usuarios/kurbie.jpg",
                      rnomeUsuario: "Luiz",
                      rdataHora: new Date().toLocaleString(),
                      rconteudoComentario: resposta
                    }
                  ])
                  setResposta('')
                }
              }}>
                <img src="/submit.svg" alt="enviar" />
              </button>
            </div>
          </div>
          <div className="ver-respostas-container" style={estiloRespostas}>
            {
              respostas.map(res => (
                <Respostas
                  key={`resposta${idComentario}000${res.idResposta}`}
                  rfotoPerfil={res.rfotoPerfil}
                  rnomeUsuario={res.rnomeUsuario}
                  rdataHora={res.rdataHora}
                  rconteudoComentario={res.rconteudoComentario}
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