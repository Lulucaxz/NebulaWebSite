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
}

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
  arrayRespostas: RespostaData[];
}
