import { useState } from "react"
import { ComentarioItem } from "./ComentarioItem"
import { initial_comentarios } from "./comentariosDados"

interface ComentarioProps {
  onVisualizarRespostas: (visualizar: boolean) => void;
  onResponderA: (resposta: {tipo: 'comentario' | 'resposta', id: number, nome: string} | null) => void;
}

export function Comentario({ onVisualizarRespostas, onResponderA }: ComentarioProps) {
  const [comentarios, setComentarios] = useState(initial_comentarios)

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

  return (
    <>
      {comentarios.map(comentario => (
        <ComentarioItem
          key={comentario.idComentario}
          {...comentario}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onVisualizarRespostas={onVisualizarRespostas}
          onResponderA={onResponderA}
        />
      ))}
    </>
  )
}