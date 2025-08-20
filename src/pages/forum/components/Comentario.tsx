import { useState } from "react"
import { ComentarioItem } from "./ComentarioItem"
import { initial_comentarios } from "./comentariosDados"

export function Comentario() {
  const [comentarios, setComentarios] = useState(initial_comentarios)
  const [comentar, setComentar] = useState('')

  const handleDelete = (id: number) => {
    setComentarios(prev => prev.filter(c => c.idComentario !== id))
  }

  const handleEdit = (id: number, novoConteudo: string) => {
    setComentarios(prev =>
      prev.map(c =>
        c.idComentario === id ? { ...c, conteudoComentario: novoConteudo } : c
      )
    )
  }

  const adicionarComentario = () => {
    if (comentar.trim() === '') return

    const novoComentario = {
      idComentario: comentarios.length + 1,
      temaPergunta: "Nova pergunta", // ou algum valor padrão/editável
      nomeUsuario: "Luiz", // pode ser dinâmico
      dataHora: new Date().toLocaleString(),
      conteudoComentario: comentar,
      numeroAvaliacao: "0",
      avaliacaoDoUsuario: "",
      fotoPerfil: "../../../src/assets/icones-usuarios/kurbie.jpg",
      arrayRespostas: []
    }

    setComentarios(prev => [...prev, novoComentario])
    setComentar('')
  }

  return (
    <>
      {comentarios.map(comentario => (
        <ComentarioItem
          key={comentario.idComentario}
          {...comentario}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}

      <div className="forum-imput-comentar">
        <textarea
          value={comentar}
          maxLength={400}
          placeholder="Escreva um novo comentário..."
          onChange={e => setComentar(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              adicionarComentario()
            }
          }}
        />
        <button onClick={adicionarComentario}>
          <img src="/submit.svg" alt="Enviar comentário" />
        </button>
      </div>
    </>
  )
}
