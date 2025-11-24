import { useState } from "react";
import "./respostas.css";
import type { RespostaData, DestinoResposta } from "../types";

interface respostasProps {
    rfotoPerfil: string;
    rnomeUsuario: string;
    rdataHora: string;
    rconteudoComentario: string;
    assinatura?: "Universo" | "Galáxia" | "Órbita";
    rimagemComentario?: string | null;
    onResponderA?: (resposta: DestinoResposta | null) => void;
    idResposta?: number;
    arrayRespostasAninhadas?: RespostaData[];
    respondendoA?: DestinoResposta | null;
    eDoUsuario?: boolean;
    onDeleteResposta?: (idResposta: number) => void;
    onEditarResposta?: (id: number, conteudo: string, imagem: string | null, nomeUsuario: string) => void;
    nivel?: number;
    comentarioId: number;
    likesCount?: number;
    usuarioCurtiu?: boolean;
    onToggleCurtirResposta?: (idResposta: number, jaCurtiu: boolean) => Promise<void> | void;
}

export function Respostas({ 
    rfotoPerfil, 
    rnomeUsuario, 
    rdataHora, 
    rconteudoComentario, 
    assinatura = "Órbita",
    rimagemComentario = null,
    onResponderA,
    idResposta = 0,
    arrayRespostasAninhadas = [],
    respondendoA,
    eDoUsuario = false,
    onDeleteResposta,
    onEditarResposta,
    nivel = 0,
    comentarioId,
    likesCount = 0,
    usuarioCurtiu = false,
    onToggleCurtirResposta
}: respostasProps) {
    const [curtindo, setCurtindo] = useState(false);
    const [mostrarRespostasAninhadas, setMostrarRespostasAninhadas] = useState(false);
    
    // Estado de likes para respostas aninhadas

    const formatarDataHora = (dataHora: string) => {
        const data = new Date(dataHora);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${assinatura} - ${dia}/${mes}/${ano}`;
    };

    const handleLike = async () => {
        if (!onToggleCurtirResposta || curtindo) {
            return;
        }
        setCurtindo(true);
        try {
            await onToggleCurtirResposta(idResposta, usuarioCurtiu);
        } finally {
            setCurtindo(false);
        }
    };

    const indentAtual = `${nivel * 20}px`;

    const contemRespostaAninhada = (lista: RespostaData[] | undefined, alvoId: number): boolean => {
        if (!lista) {
            return false;
        }

        return lista.some(item => item.idResposta === alvoId || contemRespostaAninhada(item.arrayRespostasAninhadas, alvoId));
    };

    return (
        <>
            <div className="resposta-item resposta-item-scrollable" style={{ marginLeft: indentAtual }}>
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
                    
                    {/* Botões de editar/excluir */}
                    {eDoUsuario && (
                        <div>
                            <button
                                className="resposta-botao-acao"
                                onClick={() => {
                                    if (onEditarResposta) {
                                        onEditarResposta(idResposta, rconteudoComentario, rimagemComentario || null, rnomeUsuario);
                                    }
                                }}
                            >
                                <img src="/icons/edit_forum.svg" alt="Editar" />
                            </button>
                            <button
                                className="resposta-botao-acao"
                                onClick={() => onDeleteResposta && onDeleteResposta(idResposta)}
                            >
                                <img src="/icons/delete.svg" alt="Excluir" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Conteúdo da resposta */}
                <div className="resposta-conteudo">
                    <p>{rconteudoComentario}</p>
                </div>

                {rimagemComentario && (
                    <div className="resposta-imagem">
                        <img src={rimagemComentario} alt={`Imagem da resposta de ${rnomeUsuario}`} />
                    </div>
                )}

                {/* Botões de interação */}
                <div className="resposta-acoes">
                    <div className="resposta-interacao">
                        <button 
                            className={`resposta-botao-like ${usuarioCurtiu ? 'liked' : ''}`}
                            onClick={handleLike}
                            disabled={curtindo}
                        >
                            <img src="/icons/like_forum.svg" alt="Like" />
                            <span>{likesCount}</span>
                        </button>
                        
                        <button 
                            className={`resposta-botao-comentar ${mostrarRespostasAninhadas ? 'active' : ''}`}
                            onClick={() => {
                                const novoEstado = !mostrarRespostasAninhadas;
                                setMostrarRespostasAninhadas(novoEstado);
                                
                                // Se está fechando as respostas aninhadas e estava respondendo uma resposta aninhada, limpa
                                if (!novoEstado && respondendoA?.tipo === 'resposta' && onResponderA) {
                                    const estaNesteGrupo = respondendoA.id === idResposta || contemRespostaAninhada(arrayRespostasAninhadas, respondendoA.id);
                                    if (estaNesteGrupo) {
                                        onResponderA(null);
                                    }
                                }
                            }}
                        >
                            <img src="/icons/coment_forum.svg" alt="Comentar" />
                            <span>{arrayRespostasAninhadas.length}</span>
                        </button>
                    </div>
                    
                </div>
                <button 
                    className={`resposta-botao-responder ${respondendoA?.tipo === 'resposta' && respondendoA?.id === idResposta ? 'active' : ''}`}
                    onClick={() => {
                        if (onResponderA) {
                            onResponderA({
                                tipo: 'resposta',
                                id: idResposta,
                                nome: rnomeUsuario,
                                comentarioId
                            });
                        }
                    }}
                >
                    Responder: {rnomeUsuario}
                </button>
            </div>

            {/* Respostas aninhadas */}
            {mostrarRespostasAninhadas && arrayRespostasAninhadas.length > 0 && (
                <div className="resposta-filhas">
                    {arrayRespostasAninhadas.map(respostaAninhada => (
                        <Respostas
                            key={`resposta-aninhada-${respostaAninhada.idResposta}`}
                            rfotoPerfil={respostaAninhada.rfotoPerfil}
                            rnomeUsuario={respostaAninhada.rnomeUsuario}
                            rdataHora={respostaAninhada.rdataHora}
                            rconteudoComentario={respostaAninhada.rconteudoComentario}
                            assinatura={respostaAninhada.assinatura}
                            rimagemComentario={respostaAninhada.rimagemComentario}
                            onResponderA={onResponderA}
                            idResposta={respostaAninhada.idResposta}
                            arrayRespostasAninhadas={respostaAninhada.arrayRespostasAninhadas}
                            respondendoA={respondendoA}
                            eDoUsuario={respostaAninhada.eDoUsuario}
                            onDeleteResposta={onDeleteResposta}
                            onEditarResposta={onEditarResposta}
                            nivel={nivel + 1}
                            comentarioId={comentarioId}
                            likesCount={respostaAninhada.likesCount}
                            usuarioCurtiu={respostaAninhada.usuarioCurtiu}
                            onToggleCurtirResposta={onToggleCurtirResposta}
                        />
                    ))}
                </div>
            )}
        </>
    );
}