import { useState } from "react";
import "./respostas.css";

interface respostasProps {
    rfotoPerfil: string;
    rnomeUsuario: string;
    rdataHora: string;
    rconteudoComentario: string;
    assinatura?: "Universo" | "Galáxia" | "Órbita";
    onResponderA?: (resposta: {tipo: 'comentario' | 'resposta', id: number, nome: string} | null) => void;
    idResposta?: number;
}

export function Respostas({ 
    rfotoPerfil, 
    rnomeUsuario, 
    rdataHora, 
    rconteudoComentario, 
    assinatura = "Órbita",
    onResponderA,
    idResposta = 0
}: respostasProps) {
    const [jaAvaliou, setJaAvaliou] = useState(false);
    const [totalLikes, setTotalLikes] = useState(2);

    const formatarDataHora = (dataHora: string) => {
        const data = new Date(dataHora);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${assinatura} - ${dia}/${mes}/${ano}`;
    };

    const handleLike = () => {
        if (!jaAvaliou) {
            setTotalLikes(prev => prev + 1);
            setJaAvaliou(true);
        } else {
            setTotalLikes(prev => prev - 1);
            setJaAvaliou(false);
        }
    };

    return (
        <div className="resposta-item">
            {/* Cabeçalho da resposta */}
            <div className="resposta-header">
                <div className="resposta-usuario-info">
                    <div 
                        className="resposta-foto-perfil" 
                        style={{ backgroundImage: `url(${rfotoPerfil})` }}
                    ></div>
                    <div className="resposta-detalhes">
                        <h3 className="resposta-nome">{rnomeUsuario}</h3>
                        <span className="resposta-data">{formatarDataHora(rdataHora)}</span>
                    </div>
                </div>
            </div>

            {/* Conteúdo da resposta */}
            <div className="resposta-conteudo">
                <p>{rconteudoComentario}</p>
            </div>

            {/* Botões de interação */}
            <div className="resposta-acoes">
                <div className="resposta-interacao">
                    <button 
                        className={`resposta-botao-like ${jaAvaliou ? 'liked' : ''}`}
                        onClick={handleLike}
                    >
                        <img src="/icons/like_forum.svg" alt="Like" />
                        <span>{totalLikes}</span>
                    </button>
                    
                    <button className="resposta-botao-comentar">
                        <img src="/icons/coment_forum.svg" alt="Comentar" />
                        <span>132</span>
                    </button>
                </div>
                
            </div>
            <button 
                className="resposta-botao-responder"
                onClick={() => {
                    if (onResponderA) {
                        onResponderA({
                            tipo: 'resposta',
                            id: idResposta,
                            nome: rnomeUsuario
                        });
                    }
                }}
            >
                Responder: {rnomeUsuario}
            </button>
        </div>
    );
}