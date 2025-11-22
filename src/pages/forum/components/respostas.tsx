import { useState } from "react";
import "./respostas.css";

interface RespostaAninhada {
    idResposta: number;
    rfotoPerfil: string;
    rnomeUsuario: string;
    assinatura: "Universo" | "Galáxia" | "Órbita";
    rdataHora: string;
    rconteudoComentario: string;
    eDoUsuario: boolean;
}

interface respostasProps {
    rfotoPerfil: string;
    rnomeUsuario: string;
    rdataHora: string;
    rconteudoComentario: string;
    assinatura?: "Universo" | "Galáxia" | "Órbita";
    onResponderA?: (resposta: {tipo: 'comentario' | 'resposta', id: number, nome: string} | null) => void;
    idResposta?: number;
    arrayRespostasAninhadas?: RespostaAninhada[];
    respondendoA?: {tipo: 'comentario' | 'resposta', id: number, nome: string} | null;
    eDoUsuario?: boolean;
    onDelete?: (idResposta: number) => void;
    onEdit?: (idResposta: number, novoConteudo: string) => void;
    onEditarResposta?: (id: number, conteudo: string, imagem: string | null, nomeUsuario: string) => void;
}

export function Respostas({ 
    rfotoPerfil, 
    rnomeUsuario, 
    rdataHora, 
    rconteudoComentario, 
    assinatura = "Órbita",
    onResponderA,
    idResposta = 0,
    arrayRespostasAninhadas = [],
    respondendoA,
    eDoUsuario = false,
    onDelete,
    onEdit,
    onEditarResposta
}: respostasProps) {
    const [jaAvaliou, setJaAvaliou] = useState(false);
    const [totalLikes, setTotalLikes] = useState(2);
    const [mostrarRespostasAninhadas, setMostrarRespostasAninhadas] = useState(false);
    
    // Estado de likes para respostas aninhadas
    const [likesAninhados, setLikesAninhados] = useState<{[key: number]: {ativo: boolean, total: number}}>({});

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

    const handleLikeAninhado = (idRespostaAninhada: number) => {
        setLikesAninhados(prev => {
            const estadoAtual = prev[idRespostaAninhada] || { ativo: false, total: 0 };
            return {
                ...prev,
                [idRespostaAninhada]: {
                    ativo: !estadoAtual.ativo,
                    total: estadoAtual.ativo ? estadoAtual.total - 1 : estadoAtual.total + 1
                }
            };
        });
    };

    const getLikesAninhado = (idRespostaAninhada: number) => {
        return likesAninhados[idRespostaAninhada] || { ativo: false, total: 0 };
    };

    return (
        <>
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
                    
                    {/* Botões de editar/excluir */}
                    {eDoUsuario && (
                        <div>
                            <button
                                className="resposta-botao-acao"
                                onClick={() => {
                                    if (onEditarResposta) {
                                        onEditarResposta(idResposta, rconteudoComentario, null, rnomeUsuario);
                                    }
                                }}
                            >
                                <img src="/icons/edit_forum.svg" alt="Editar" />
                            </button>
                            <button
                                className="resposta-botao-acao"
                                onClick={() => onDelete && onDelete(idResposta)}
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
                        
                        <button 
                            className={`resposta-botao-comentar ${mostrarRespostasAninhadas ? 'active' : ''}`}
                            onClick={() => {
                                const novoEstado = !mostrarRespostasAninhadas;
                                setMostrarRespostasAninhadas(novoEstado);
                                
                                // Se está fechando as respostas aninhadas e estava respondendo uma resposta aninhada, limpa
                                if (!novoEstado && respondendoA?.tipo === 'resposta' && onResponderA) {
                                    // Verifica se a resposta sendo respondida é uma resposta aninhada
                                    const eRespostaAninhada = arrayRespostasAninhadas.some(
                                        ra => ra.idResposta === respondendoA.id
                                    );
                                    if (eRespostaAninhada) {
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
                                nome: rnomeUsuario
                            });
                        }
                    }}
                >
                    Responder: {rnomeUsuario}
                </button>
            </div>

            {/* Respostas aninhadas */}
            {mostrarRespostasAninhadas && arrayRespostasAninhadas.length > 0 && (
                <div style={{ marginLeft: '40px' }}>
                    {arrayRespostasAninhadas.map(respostaAninhada => {
                        const likeInfo = getLikesAninhado(respostaAninhada.idResposta);
                        return (
                            <div key={`resposta-aninhada-${respostaAninhada.idResposta}`} className="resposta-item">
                                <div className="resposta-header">
                                    <div className="resposta-usuario-info">
                                        <div 
                                            className="resposta-foto-perfil" 
                                            style={{ backgroundImage: `url(${respostaAninhada.rfotoPerfil})` }}
                                        ></div>
                                        <div className="resposta-detalhes">
                                            <h3 className="resposta-nome">{respostaAninhada.rnomeUsuario}</h3>
                                            <span className="resposta-data">{formatarDataHora(respostaAninhada.rdataHora)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Botões de editar/excluir para respostas aninhadas */}
                                    {respostaAninhada.eDoUsuario && (
                                        <div>
                                            <button
                                                className="resposta-botao-acao"
                                                onClick={() => {
                                                    if (onEditarResposta) {
                                                        onEditarResposta(respostaAninhada.idResposta, respostaAninhada.rconteudoComentario, null, respostaAninhada.rnomeUsuario);
                                                    }
                                                }}
                                            >
                                                <img src="/icons/edit_forum.svg" alt="Editar" />
                                            </button>
                                            <button
                                                className="resposta-botao-acao"
                                                onClick={() => {
                                                    // Implementar exclusão de resposta aninhada
                                                    console.log('Excluir resposta aninhada:', respostaAninhada.idResposta);
                                                }}
                                            >
                                                <img src="/icons/delete.svg" alt="Excluir" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="resposta-conteudo">
                                    <p>{respostaAninhada.rconteudoComentario}</p>
                                </div>

                                <div className="resposta-acoes">
                                    <div className="resposta-interacao">
                                        <button 
                                            className={`resposta-botao-like ${likeInfo.ativo ? 'liked' : ''}`}
                                            onClick={() => handleLikeAninhado(respostaAninhada.idResposta)}
                                        >
                                            <img src="/icons/like_forum.svg" alt="Like" />
                                            <span>{likeInfo.total}</span>
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    className={`resposta-botao-responder ${respondendoA?.tipo === 'resposta' && respondendoA?.id === respostaAninhada.idResposta ? 'active' : ''}`}
                                    onClick={() => {
                                        if (onResponderA) {
                                            onResponderA({
                                                tipo: 'resposta',
                                                id: respostaAninhada.idResposta,
                                                nome: respostaAninhada.rnomeUsuario
                                            });
                                        }
                                    }}
                                >
                                    Responder: {respostaAninhada.rnomeUsuario}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}