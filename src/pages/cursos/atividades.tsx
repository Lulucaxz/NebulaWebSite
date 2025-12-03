import { useParams } from 'react-router-dom';
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import { useEffect, useState } from 'react'; 
import { fetchWithCredentials, API_BASE } from '../../api';
import { Link } from "react-router-dom";
import { showAlert } from "../../Alert";

import './cursos.css'; 

function Atividades() {
    const { assinatura, moduloId, atividadeInd } = useParams<{ assinatura: string; moduloId: string; atividadeInd : string }>();
    
    // --- Tipos Locais Atualizados ---
    type Questao = { 
        questao?: string; 
        dissertativa?: boolean; 
        alternativas?: string[];
        respostaCorreta?: string; 
    };
    type AtividadeType = { id: number; questoes?: Questao[] };
    type ModuloType = { id: number; atividades: AtividadeType[] };
    type StatusResposta = 'neutro' | 'correta' | 'incorreta';
    type DissertativaResultadoMap = Record<number, { score: number; isCorrect: boolean; explanation?: string }>;

    // --- Lógica de Busca de Dados (como estava) ---
    const cloneModule = (mod?: ModuloType | null): ModuloType | null => {
        if (!mod) return null;
        return {
            ...mod,
            atividades: Array.isArray(mod.atividades)
                ? mod.atividades.map((atividade) => ({
                    ...atividade,
                    questoes: Array.isArray(atividade.questoes)
                        ? atividade.questoes.map((questao) => ({
                            ...questao,
                            alternativas: questao?.alternativas ? [...questao.alternativas] : undefined,
                        }))
                        : atividade.questoes,
                }))
                : [],
        };
    };

    const [baseModule, setBaseModule] = useState<ModuloType | null>(null);
    const [moduleData, setModuleData] = useState<ModuloType | null>(null);
    const [loadingModule, setLoadingModule] = useState(false);
    const [moduleError, setModuleError] = useState<string | null>(null);

    useEffect(() => {
        if (!moduloId) {
            setBaseModule(null);
            setModuleData(null);
            setModuleError('Módulo não encontrado.');
            setLoadingModule(false);
            return;
        }

        let active = true;
        setLoadingModule(true);
        setModuleError(null);

        const loadModule = async () => {
            try {
                const res = await fetchWithCredentials(`${API_BASE}/api/course-content/modules/${moduloId}`);
                const data = await res.json().catch(() => ({}));
                if (!active) return;
                if (!res.ok || !data.module) {
                    setBaseModule(null);
                    setModuleData(null);
                    setModuleError(data.error || 'Módulo não encontrado.');
                    return;
                }
                const normalized = cloneModule(data.module as ModuloType);
                setBaseModule(normalized);
            } catch (error) {
                if (!active) return;
                console.error('Erro ao carregar módulo', error);
                setBaseModule(null);
                setModuleData(null);
                setModuleError('Erro ao carregar módulo.');
            } finally {
                if (active) {
                    setLoadingModule(false);
                }
            }
        };

        void loadModule();
        return () => {
            active = false;
        };
    }, [moduloId]);

    useEffect(() => {
        setModuleData(cloneModule(baseModule));
    }, [baseModule]);

    const atividadeIndex = Number(atividadeInd ?? '0');
    const atividade = moduleData?.atividades?.[atividadeIndex] as AtividadeType;
    
    // --- ESTADO ATUALIZADO ---
    const [respostas, setRespostas] = useState<string[]>([]);
    const [selecoes, setSelecoes] = useState<(string | null)[]>([]);
    const [statusRespostas, setStatusRespostas] = useState<StatusResposta[]>([]);
    const [statusDissertativas, setStatusDissertativas] = useState<StatusResposta[]>([]);
    const [notasDissertativas, setNotasDissertativas] = useState<(number | null)[]>([]);
    const [feedbackDissertativas, setFeedbackDissertativas] = useState<(string | null)[]>([]);


    const [avaliandoDissertativas, setAvaliandoDissertativas] = useState(false);
    const [atividadeFinalizada, setAtividadeFinalizada] = useState(false);
    const [relatorioAtividade, setRelatorioAtividade] = useState<string | null>(null);

    useEffect(() => {
        const totalQuestoes = atividade?.questoes?.length ?? 0;
        setRespostas(Array.from({ length: totalQuestoes }, () => ''));
        setSelecoes(Array.from({ length: totalQuestoes }, () => null));
        setStatusRespostas(Array.from({ length: totalQuestoes }, () => 'neutro'));
        setStatusDissertativas(Array.from({ length: totalQuestoes }, () => 'neutro'));
        setNotasDissertativas(Array.from({ length: totalQuestoes }, () => null));
        setFeedbackDissertativas(Array.from({ length: totalQuestoes }, () => null));
        setAtividadeFinalizada(false);
        setRelatorioAtividade(null);
    }, [atividade?.id]);

    const [tentativas, setTentativas] = useState<number>(0);
    const [tentativasCarregadas, setTentativasCarregadas] = useState<boolean>(false);

    useEffect(() => {
        let ativo = true;
        setTentativasCarregadas(false);
        setTentativas(0);
        const carregarTentativas = async () => {
            if (!assinatura || !moduleData || !atividade) {
                if (ativo) {
                    setTentativas(0);
                    setTentativasCarregadas(true);
                }
                return;
            }

            try {
                const res = await fetchWithCredentials(`${API_BASE}/api/progress/activity/${assinatura}/${moduleData.id}/${atividade.id}/attempts`);
                const data = await res.json().catch(() => ({}));
                const valor = Number(data?.tentativas);
                if (ativo && Number.isFinite(valor) && valor >= 0) {
                    setTentativas(valor);
                }
            } catch (error) {
                console.error('Erro ao carregar tentativas da atividade', error);
            } finally {
                if (ativo) {
                    setTentativasCarregadas(true);
                }
            }
        };

        carregarTentativas();
        return () => {
            ativo = false;
        };
    }, [assinatura, moduleData?.id, atividade?.id]);

    const registrarTentativa = async (valor: number) => {
        if (!assinatura || !moduleData || !atividade) {
            return;
        }

        try {
            const res = await fetchWithCredentials(`${API_BASE}/api/progress/activity/${assinatura}/${moduleData.id}/${atividade.id}/attempts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attempts: valor })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                console.error('Falha ao registrar tentativa:', data?.error || res.statusText);
            }
        } catch (error) {
            console.error('Erro ao registrar tentativa da atividade', error);
        }
    };

    if (!moduleData) {
        return (
            <>
                <Menu />
                <div className="container">
                    <div className="cursos-espacamento">
                        {loadingModule ? 'Carregando módulo...' : (moduleError || 'Módulo não encontrado.')}
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!atividade) {
        return (
            <>
                <Menu />
                <div className="container">
                    <div className="cursos-espacamento">Atividade não encontrada.</div>
                </div>
                <Footer />
            </>
        );
    }

    const totalQuestoes = atividade.questoes?.length ?? 0;
    const pontosTotal = 10;
    const pontosPorQuestao = totalQuestoes > 0 ? pontosTotal / totalQuestoes : 0;
    const notaMinima = 6;

    const clampScore = (value: unknown) => {
        const numeric = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(numeric)) return 0;
        if (numeric < 0) return 0;
        if (numeric > 1) return 1;
        return numeric;
    };

    const calcularPontuacao = (
        dissertativasOverrides?: Record<number, boolean>,
        objetivasOverrides?: Record<number, boolean>
    ) => {
        if (!atividade.questoes || atividade.questoes.length === 0) {
            return { pontos: 0, percentual: 0 };
        }

        let pontos = 0;

        atividade.questoes.forEach((questao, index) => {
            if (questao.dissertativa) {
                const override = dissertativasOverrides?.[index];
                const isCorreta = typeof override === 'boolean'
                    ? override
                    : statusDissertativas[index] === 'correta';
                if (isCorreta) {
                    pontos += pontosPorQuestao;
                }
            } else {
                const overrideObjetiva = objetivasOverrides?.[index];
                const acertouObjetiva = typeof overrideObjetiva === 'boolean'
                    ? overrideObjetiva
                    : statusRespostas[index] === 'correta';
                if (acertouObjetiva) {
                    pontos += pontosPorQuestao;
                }
            }
        });

        const percentual = (pontos / pontosTotal) * 100;
        return { pontos, percentual };
    };

    // --- NOVA FUNÇÃO DE CLIQUE ---
    const handleAlternativaClick = (
        questionIndex: number,
        alternativaClicada: string
    ) => {
        if (atividadeFinalizada) {
            return;
        }
        setSelecoes(prev => prev.map((sel, i) => 
            i === questionIndex ? alternativaClicada : sel
        ));
        setStatusRespostas(prev => prev.map((status, i) =>
            i === questionIndex ? 'neutro' : status
        ));
    };

    const avaliarQuestoesObjetivas = () => {
        const questoes = atividade.questoes ?? [];
        const overrides: Record<number, boolean> = {};
        const novosStatus = [...statusRespostas];

        questoes.forEach((questao, index) => {
            if (questao.dissertativa) {
                return;
            }

            const respostaCorreta = questao.respostaCorreta;
            const selecionada = selecoes[index];

            if (!selecionada || !respostaCorreta) {
                novosStatus[index] = 'neutro';
                return;
            }

            const acertou = selecionada === respostaCorreta;
            overrides[index] = acertou;
            novosStatus[index] = acertou ? 'correta' : 'incorreta';
        });

        setStatusRespostas(novosStatus);
        return overrides;
    };

    const avaliarQuestoesDissertativas = async (): Promise<DissertativaResultadoMap> => {
        const questoes = atividade.questoes ?? [];
        const itens: Array<{ questionIndex: number; question: string; referenceAnswer: string; studentAnswer: string }> = [];

        questoes.forEach((questao, index) => {
            if (!questao.dissertativa) {
                return;
            }

            const respostaAluno = (respostas[index] ?? '').trim();
            if (!respostaAluno) {
                throw new Error(`Preencha a resposta da questão ${index + 1} antes de enviar.`);
            }

            const gabarito = (questao.respostaCorreta ?? '').trim();
            if (!gabarito) {
                throw new Error(`Questão ${index + 1} não possui gabarito configurado.`);
            }

            itens.push({
                questionIndex: index,
                question: questao.questao ?? '',
                referenceAnswer: gabarito,
                studentAnswer: respostaAluno,
            });
        });

        if (itens.length === 0) {
            return {};
        }

        setAvaliandoDissertativas(true);
        try {
            const response = await fetchWithCredentials(`${API_BASE}/api/progress/activity/dissertativas/avaliar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: itens })
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(typeof data.error === 'string' ? data.error : 'Erro ao avaliar as questões dissertativas.');
            }

            const resultados = Array.isArray(data.results) ? data.results : [];
            const mapa: DissertativaResultadoMap = {};

            resultados.forEach((resultado: Record<string, unknown>) => {
                const index = Number(resultado?.questionIndex);
                if (!Number.isFinite(index)) {
                    return;
                }

                const score = clampScore(resultado?.score);
                const explanation = typeof resultado?.explanation === 'string' ? resultado.explanation : undefined;
                const isCorrect = typeof resultado?.isCorrect === 'boolean' ? resultado.isCorrect : score >= 0.5;

                mapa[index] = { score, isCorrect, explanation };
            });

            setStatusDissertativas(prev => prev.map((status, idx) => {
                const resultado = mapa[idx];
                if (!resultado) {
                    return status;
                }
                return resultado.isCorrect ? 'correta' : 'incorreta';
            }));

            setNotasDissertativas(prev => prev.map((nota, idx) => mapa[idx]?.score ?? nota));
            setFeedbackDissertativas(prev => prev.map((texto, idx) => mapa[idx]?.explanation ?? texto));

            return mapa;
        } finally {
            setAvaliandoDissertativas(false);
        }
    };

    const handleEnviarAtividade = async () => {
        if (atividadeFinalizada) {
            return;
        }
        let mapaDissertativas: DissertativaResultadoMap = {};
        try {
            mapaDissertativas = await avaliarQuestoesDissertativas();
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao avaliar as questões dissertativas.';
            showAlert(mensagem);
            return;
        }

        const overrideDissertativas: Record<number, boolean> | undefined = Object.keys(mapaDissertativas).length > 0
            ? Object.entries(mapaDissertativas).reduce<Record<number, boolean>>((acc, [key, value]) => {
                const idx = Number(key);
                if (Number.isFinite(idx)) {
                    acc[idx] = value.isCorrect;
                }
                return acc;
            }, {})
            : undefined;

        const overrideObjetivas = avaliarQuestoesObjetivas();

        const tentativaAtual = tentativas + 1;

        await registrarTentativa(tentativaAtual);
        setTentativas(tentativaAtual);
        setTentativasCarregadas(true);

        const { pontos, percentual } = calcularPontuacao(overrideDissertativas, overrideObjetivas);
        const mensagemResultado = `Tentativa ${tentativaAtual}: Você acertou ${percentual.toFixed(0)}% da atividade (${pontos.toFixed(2)}/10).`;
        const atingiuMeta = pontos > notaMinima;

        const mensagemFinal = `${mensagemResultado}\n${atingiuMeta ? 'Parabéns! A atividade será marcada como concluída.' : 'Esta tentativa não atingiu 6 pontos. Reveja suas respostas antes de tentar novamente.'}`;
        setRelatorioAtividade(mensagemFinal);
        showAlert(mensagemFinal);
        setAtividadeFinalizada(true);

        if (!atingiuMeta) {
            return;
        }

        try {
            const body = JSON.stringify({
                totalActivities: moduleData.atividades.length,
                score: pontos,
                attempts: tentativaAtual
            });
            const res = await fetchWithCredentials(`${API_BASE}/api/progress/activity/${assinatura}/${moduleData.id}/${atividade.id}`, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                showAlert('Erro ao enviar atividade: ' + (data.error || res.statusText));
            }
        } catch (err) {
            console.error(err);
            showAlert('Erro ao enviar atividade. Verifique sua conexão.');
        }
    };


    // --- RENDERIZAÇÃO ATUALIZADA ---
    return (
        <>
        <Menu />
        <div className="container">
            <div className="cursos-espacamento">
                {atividade.questoes?.map((questao: Questao, index: number) => {
                    const statusDissertativa = statusDissertativas[index];
                    const notaDissertativa = notasDissertativas[index];
                    const feedbackDissertativa = feedbackDissertativas[index];

                    return (
                        <div key={`questao${atividade.id}-${index}`} className='questao'>
                            <div className="sessao">
                                <h1>Questão {index+1}</h1>
                                <hr />
                            </div>
                            <div className="questao-descricao">{questao.questao}</div>
                            
                            {/* --- Seção Dissertativa (MODIFICADA) --- */}
                            {/* 2. MUDANÇA AQUI: Adicionado 'placeholder' */}
                            <textarea className='questao-disertativa'
                                placeholder='Digite sua resposta aqui...' 
                                maxLength={2000}
                                value={respostas[index]}
                                onChange={e => {
                                    if (atividadeFinalizada) {
                                        return;
                                    }
                                    const value = e.target.value;
                                    setRespostas(prev => prev.map((v,i) => i===index ? value : v));
                                    if (questao.dissertativa) {
                                        setStatusDissertativas(prev => prev.map((status, i) => i === index ? 'neutro' : status));
                                        setNotasDissertativas(prev => prev.map((nota, i) => i === index ? null : nota));
                                        setFeedbackDissertativas(prev => prev.map((texto, i) => i === index ? null : texto));
                                    }
                                }}
                                disabled={atividadeFinalizada}
                                style={{
                                display: questao.dissertativa ? 'block' : 'none',
                            }}></textarea>

                            {questao.dissertativa && statusDissertativa !== 'neutro' && (
                                <div className={`questao-feedback ${statusDissertativa}`}>
                                    {statusDissertativa === 'correta' ? 'Resposta correta' : 'Resposta incorreta'}
                                    {typeof notaDissertativa === 'number' && ` • Nota: ${notaDissertativa.toFixed(2)}`}
                                    {feedbackDissertativa && (
                                        <span className="questao-feedback-detalhe"> — {feedbackDissertativa}</span>
                                    )}
                                </div>
                            )}

                            {/* --- Seção de Alternativas (MODIFICADA) --- */}
                            <div className="questao-alternativas" style={{ display: !questao.dissertativa ? 'grid' : 'none' }}>
                                {(questao.alternativas ?? ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D']).map((alt: string, altIdx: number) => {
                                    
                                    const status = statusRespostas[index];
                                    const isSelected = selecoes[index] === alt;

                                    // Define a classe CSS dinâmica
                                    let className = 'questao-alternativa';
                                    if (status === 'correta' && isSelected) {
                                        className += ' correta'; // Verde
                                    } else if (status === 'incorreta' && isSelected) {
                                        className += ' incorreta'; // Vermelho
                                    } else if (isSelected) {
                                        className += ' selecionada';
                                    }
                                    
                                    return (
                                        <div 
                                            key={`alt-${atividade.id}-${index}-${altIdx}`} 
                                            className={className} // Classe dinâmica aplicada aqui
                                            onClick={() => { 
                                                handleAlternativaClick(index, alt); 
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="alternativa-letra" 
                                                 // Estilo da letra (A, B, C) é controlado por CSS agora
                                            > 
                                                {String.fromCharCode(65 + altIdx)}
                                            </div>
                                            <div className="alternativa-texto">{alt}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}

                {/* --- Seção Final (sem mudanças) --- */}
                <div className="sessao">
                    <h1>FIM DA TAREFA</h1>
                    <hr />
                </div>
                <div className="tarefa-sessao-fim">
                    <p>
                        Você chegou ao fim desta tarefa. Certifique-se de que todas as questões então respondidas ou marcadas de forma correta, cuidados com palavras erradas e se atente as nomenclaturas e sinais utilizados.
                    </p>
                    <Link className='tarefa-sessao-fim-button' to={`/modulos/${assinatura}/${moduleData.id}`}>
                        {atividadeFinalizada ? 'VOLTAR' : 'CANCELAR'}
                    </Link>
                    <div className='tarefa-sessao-fim-acoes'>
                        {!atividadeFinalizada && (
                            <button
                                className='tarefa-sessao-fim-button'
                                onClick={handleEnviarAtividade}
                                disabled={avaliandoDissertativas}
                                style={{
                                    backgroundColor: 'var(--primary-500)',
                                    border: 'none',
                                    padding: '10px 16px',
                                    color: 'var(--text-primary)',
                                    cursor: avaliandoDissertativas ? 'not-allowed' : 'pointer',
                                    opacity: avaliandoDissertativas ? 0.7 : 1
                                }}
                            >
                                {avaliandoDissertativas ? 'AVALIANDO...' : 'ENVIAR'}
                            </button>
                        )}
                    </div>
                </div>
                {relatorioAtividade && (
                    <div className='tarefa-relatorio'>
                        <h2>Relatório da tentativa</h2>
                        <p>{relatorioAtividade}</p>
                    </div>
                )}
                <div className='tarefa-tentativas-wrapper'>
                    <span className='tarefa-tentativas'>Tentativas registradas: {tentativasCarregadas ? tentativas : '...'}</span>
                </div>
            </div>
        </div>
        </>
    )
}

export default Atividades