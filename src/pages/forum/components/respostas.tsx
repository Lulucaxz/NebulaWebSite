import "./respostas.css";

interface respostasProps {
    rfotoPerfil: string;
    rnomeUsuario: string;
    rdataHora: string;
    rconteudoComentario: string;
}

export function Respostas({ rfotoPerfil, rnomeUsuario, rdataHora, rconteudoComentario }: respostasProps) {
    return (
        <>
            <div className="resposta">
                <div className="resposta-lateral-esquerda">
                    <img src={rfotoPerfil} alt="" />
                </div>
                <div className="resposta-lateral-direita">
                    <div className="resposta-titulo">
                        <h3>{rnomeUsuario}</h3>
                        <h4>Publicado por {rnomeUsuario} faz {rdataHora}</h4>
                    </div>
                    <p className="resposta-conteudo">
                        {rconteudoComentario}
                    </p>
                    <div className="resposta-baixo">
                    </div>
                </div>
            </div>
        </>
    )
}