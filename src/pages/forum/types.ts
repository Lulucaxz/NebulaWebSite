export interface RespostaData {
  idResposta: number;
  rfotoPerfil: string;
  rnomeUsuario: string;
  assinatura: "Universo" | "Galáxia" | "Órbita";
  rdataHora: string;
  rconteudoComentario: string;
  eDoUsuario: boolean;
  rimagemComentario?: string | null;
  arrayRespostasAninhadas?: RespostaData[];
  usuarioId?: number | null;
  likesCount: number;
  usuarioCurtiu: boolean;
}

export interface ComentarioData {
  idComentario: number;
  temaPergunta: string;
  nomeUsuario: string;
  assinatura: "Universo" | "Galáxia" | "Órbita";
  dataHora: string;
  conteudoComentario: string;
  numeroAvaliacao: number;
  avaliacaoDoUsuario: string;
  eDoUsuario: boolean;
  fotoPerfil: string;
  tags: string[];
  imagemComentario?: string | null;
  arrayRespostas: RespostaData[];
  usuarioId?: number | null;
  usuarioCurtiu: boolean;
  foiEditado?: boolean;
}

export interface DestinoResposta {
  tipo: 'comentario' | 'resposta';
  id: number;
  nome: string;
  comentarioId: number;
}
