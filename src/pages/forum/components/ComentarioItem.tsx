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
  dataHora: string
  conteudoComentario: string
  numeroAvaliacao: String
  avaliacaoDoUsuario: string
  fotoPerfil: string
  arrayRespostas: Resposta[]
  onDelete: (id: number) => void
  onEdit: (id: number, novoConteudo: string) => void
}

export function ComentarioItem({
  idComentario,
  temaPergunta,
  nomeUsuario,
  dataHora,
  conteudoComentario,
  numeroAvaliacao,
  avaliacaoDoUsuario,
  fotoPerfil,
  arrayRespostas,
  onDelete,
  onEdit
}: ComentarioItemProps) {
  const [resposta, setResposta] = useState('')
  const [comteudoEditado, setComteudoEditado] = useState('')
  const [ativo, setAtivo] = useState(false)
  const [editar, setEditar] = useState(false)
  const [respostas, setRespostas] = useState(arrayRespostas)

  const estiloComentario = {
    borderRadius: ativo ? '10px 10px 0px 0px' : '10px 10px 10px 10px'
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
        <div className="frm-comentario-lateral-esquerda">
          <div className="frm-comentario-foto-perfil" style={{ backgroundImage: `url(${fotoPerfil})` }}></div>
          <div>
            <img src="/setaDeAvaliacao.svg" alt="" />
            <p>{numeroAvaliacao}</p>
          </div>
          <nav className={avaliacaoDoUsuario}>
            <img src="/pencil.svg" alt="" onClick={() => {
              if (editar) {
                if (comteudoEditado.trim() !== '') {
                  onEdit(idComentario, comteudoEditado)
                  setEditar(false)
                }
              } else {
                setComteudoEditado(conteudoComentario)
                setEditar(true)
              }
            }} />
            <img src="/delete.svg" alt="" onClick={() => onDelete(idComentario)} />
          </nav>
        </div>
        <div className="frm-comentario-lateral-direita">
          <div className="frm-comentario-titulo">
            <h3>{temaPergunta}</h3>
            <h4>Publicado por {nomeUsuario} faz {dataHora}</h4>
          </div>
          <p className="frm-comentario-conteudo" style={{ display: editar ? 'none' : 'block' }}>
            {conteudoComentario}
          </p>
          <p className="frm-comentario-conteudo-editar" style={{ display: !editar ? 'none' : 'block' }}>
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
          </p>
          <div className="frm-comentario-baixo">
            <button onClick={() => setAtivo(!ativo)}>Ver respostas.</button>
            <div>{respostas.length} respostas</div>
          </div>
        </div>
      </div>
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
    </div>
  )
}
