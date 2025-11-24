import { useState } from "react"
import { ComentarioItem } from "./ComentarioItem"
import type { ComentarioData, DestinoResposta } from "../types"

interface ComentarioProps {
  comentarios: ComentarioData[];
  onVisualizarRespostas: (visualizar: boolean) => void;
  onResponderA: (resposta: DestinoResposta | null) => void;
  respondendoA: DestinoResposta | null;
  onEditarComentario: (id: number, titulo: string, conteudo: string, tags: string[], imagem: string | null) => void;
  onEditarResposta: (id: number, conteudo: string, imagem: string | null, nomeUsuario: string) => void;
  onDeleteComentario?: (id: number) => void;
  onDeleteResposta?: (id: number) => void;
  onToggleCurtirComentario: (id: number, jaCurtiu: boolean) => Promise<void> | void;
  onToggleCurtirResposta: (id: number, jaCurtiu: boolean) => Promise<void> | void;
}

export function Comentario({ comentarios, onVisualizarRespostas, onResponderA, respondendoA, onEditarComentario, onEditarResposta, onDeleteComentario, onDeleteResposta, onToggleCurtirComentario, onToggleCurtirResposta }: ComentarioProps) {
  const [comentarioAtivoId, setComentarioAtivoId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    onDeleteComentario && onDeleteComentario(id)
  }


  const handleVisualizarRespostasComentario = (id: number, visualizar: boolean) => {
    if (visualizar) {
      setComentarioAtivoId(id)
    } else {
      setComentarioAtivoId(null)
    }
    onVisualizarRespostas(visualizar)
  }

  const handleEditarComentarioWrapper = (id: number, titulo: string, conteudo: string, tags: string[], imagem: string | null) => {
    // Não fechar as respostas - manter visualização ativa
    // Apenas chamar a função de edição do pai
    onEditarComentario(id, titulo, conteudo, tags, imagem);
  }

  const handleEditarRespostaWrapper = (id: number, conteudo: string, imagem: string | null, nomeUsuario: string) => {
    // Chamar a função de edição do pai
    onEditarResposta(id, conteudo, imagem, nomeUsuario);
  }

  return (
    <>
      {comentarios.map(comentario => (
        <ComentarioItem
          key={comentario.idComentario}
          {...comentario}
          onDelete={handleDelete}
          onDeleteResposta={onDeleteResposta}
          onVisualizarRespostas={handleVisualizarRespostasComentario}
          onResponderA={onResponderA}
          estaAtivo={comentarioAtivoId === comentario.idComentario}
          respondendoA={respondendoA}
          onEditarComentario={handleEditarComentarioWrapper}
          onEditarResposta={handleEditarRespostaWrapper}
          onToggleCurtirComentario={onToggleCurtirComentario}
          onToggleCurtirResposta={onToggleCurtirResposta}
        />
      ))}
    </>
  )
}