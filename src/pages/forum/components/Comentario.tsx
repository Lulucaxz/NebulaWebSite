import { useState } from "react"
import { ComentarioItem } from "./ComentarioItem"

export interface ComentarioData {
  idComentario: number;
  temaPergunta: string;
  nomeUsuario: string;
  assinatura: "Universo" | "Galáxia" | "Órbita";
  dataHora: string;
  conteudoComentario: string;
  numeroAvaliacao: string | number;
  avaliacaoDoUsuario: string;
  eDoUsuario: boolean;
  fotoPerfil: string;
  tags: string[];
  imagemComentario?: string | null;
  arrayRespostas: {
    idResposta: number;
    rfotoPerfil: string;
    rnomeUsuario: string;
    assinatura: "Universo" | "Galáxia" | "Órbita";
    rdataHora: string;
    rconteudoComentario: string;
    eDoUsuario: boolean;
    arrayRespostasAninhadas?: {
      idResposta: number;
      rfotoPerfil: string;
      rnomeUsuario: string;
      assinatura: "Universo" | "Galáxia" | "Órbita";
      rdataHora: string;
      rconteudoComentario: string;
      eDoUsuario: boolean;
    }[];
  }[];
}

interface ComentarioProps {
  comentarios: ComentarioData[];
  onVisualizarRespostas: (visualizar: boolean) => void;
  onResponderA: (resposta: {tipo: 'comentario' | 'resposta', id: number, nome: string} | null) => void;
  respondendoA: {tipo: 'comentario' | 'resposta', id: number, nome: string} | null;
  onEditarComentario: (id: number, titulo: string, conteudo: string, tags: string[], imagem: string | null) => void;
  onEditarResposta: (id: number, conteudo: string, imagem: string | null, nomeUsuario: string) => void;
  onDeleteComentario?: (id: number) => void;
}

export function Comentario({ comentarios, onVisualizarRespostas, onResponderA, respondendoA, onEditarComentario, onEditarResposta, onDeleteComentario }: ComentarioProps) {
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
          onVisualizarRespostas={handleVisualizarRespostasComentario}
          onResponderA={onResponderA}
          estaAtivo={comentarioAtivoId === comentario.idComentario}
          respondendoA={respondendoA}
          onEditarComentario={handleEditarComentarioWrapper}
          onEditarResposta={handleEditarRespostaWrapper}
        />
      ))}
    </>
  )
}