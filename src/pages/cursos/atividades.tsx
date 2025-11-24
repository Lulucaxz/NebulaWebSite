import { useParams } from 'react-router-dom';
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import { initial_cursos } from './components/cursosDados';
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

    // --- Lógica de Busca de Dados (como estava) ---
    const curso = (initial_cursos as unknown as Record<string, ModuloType[]>)[assinatura ?? ''];
    const modulo = curso?.find((mod: ModuloType) => mod.id === Number(moduloId));
    const atividade = modulo?.atividades?.[Number(atividadeInd)] as AtividadeType;
    const tentativaKey = assinatura && modulo && atividade
        ? `atividade-${assinatura}-${modulo.id}-${atividade.id}-tentativas`
        : undefined;
    
    // --- ESTADO ATUALIZADO ---
    
    // 1. MUDANÇA AQUI: O estado agora começa com string vazia
    const [respostas, setRespostas] = useState<string[]>(() => (atividade?.questoes || []).map(() => ''));

    // NOVO ESTADO: Armazena a *seleção* (o texto) do usuário para cada questão
    const [selecoes, setSelecoes] = useState<(string | null)[]>(
        () => Array(atividade?.questoes?.length || 0).fill(null)
    );
    
    // NOVO ESTADO: Armazena o *status* ('neutro', 'correta', 'incorreta') para cada questão
    const [statusRespostas, setStatusRespostas] = useState<('neutro' | 'correta' | 'incorreta')[]>(
        () => Array(atividade?.questoes?.length || 0).fill('neutro')
    );

    const [tentativas, setTentativas] = useState<number>(() => {
        if (typeof window === 'undefined' || !tentativaKey) return 0;
        const stored = window.localStorage.getItem(tentativaKey);
        const parsed = stored !== null ? Number(stored) : 0;
        return Number.isFinite(parsed) ? parsed : 0;
    });

    useEffect(() => {
        if (!tentativaKey || typeof window === 'undefined') return;
        const stored = window.localStorage.getItem(tentativaKey);
        const parsed = stored !== null ? Number(stored) : 0;
        const normalized = Number.isFinite(parsed) ? parsed : 0;
        setTentativas(normalized);
    }, [tentativaKey]);

    useEffect(() => {
        if (!tentativaKey || typeof window === 'undefined') return;
        window.localStorage.setItem(tentativaKey, String(tentativas));
    }, [tentativas, tentativaKey]);
    
    // --- Verificação de Módulo (como estava) ---
    if (!modulo || !atividade) {
        return <div>Módulo não encontrado.</div>;
    }

    const totalQuestoes = atividade.questoes?.length ?? 0;
    const pontosTotal = 10;
    const pontosPorQuestao = totalQuestoes > 0 ? pontosTotal / totalQuestoes : 0;
    const notaMinima = 6;

    const avaliarQuestoes = (): ('neutro' | 'correta' | 'incorreta')[] => {
        if (!atividade.questoes || atividade.questoes.length === 0) {
            return [];
        }

        return atividade.questoes.map((questao, index) => {
            if (questao.dissertativa) {
                return (respostas[index] ?? '').trim().length > 0 ? 'correta' : 'incorreta';
            }

            if (!questao.respostaCorreta || !selecoes[index]) {
                return 'incorreta';
            }

            return selecoes[index] === questao.respostaCorreta ? 'correta' : 'incorreta';
        });
    };

    const calcularPontuacao = () => {
        const resultados = avaliarQuestoes();

        if (resultados.length === 0) {
            return { pontos: 0, percentual: 0, resultados };
        }

        const pontos = resultados.reduce((acc, status) => (
            status === 'correta' ? acc + pontosPorQuestao : acc
        ), 0);
        const percentual = (pontosTotal === 0 ? 0 : (pontos / pontosTotal) * 100);

        return { pontos, percentual, resultados };
    };

    // --- NOVA FUNÇÃO DE CLIQUE ---
    const handleAlternativaClick = (
        questionIndex: number, 
        alternativaClicada: string
    ) => {
        setSelecoes(prev => prev.map((sel, i) => 
            i === questionIndex ? alternativaClicada : sel
        ));
        setStatusRespostas(prev => prev.map((status, i) => 
            i === questionIndex ? 'neutro' : status
        ));
    };

    const handleRespostaDissertativaChange = (questionIndex: number, valor: string) => {
        setRespostas(prev => prev.map((v, i) => i === questionIndex ? valor : v));
        setStatusRespostas(prev => prev.map((status, i) => 
            i === questionIndex ? 'neutro' : status
        ));
    };


    // --- RENDERIZAÇÃO ATUALIZADA ---
    return (
        <>
        <Menu />
        <div className="container">
            <div className="cursos-espacamento">
                {atividade.questoes?.map((questao: Questao, index: number) => {

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
                                onChange={e => handleRespostaDissertativaChange(index, e.target.value)}
                                style={{
                                display: questao.dissertativa ? 'auto' : 'none',
                            }}></textarea>

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
                                                // Chama a nova função de clique
                                                handleAlternativaClick(index, alt); 
                                            }}
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
                    <Link className='tarefa-sessao-fim-button' to={`/modulos/${assinatura}/${modulo.id}`}>CANCELAR</Link>
                    <div className='tarefa-sessao-fim-acoes'>
                        <button className='tarefa-sessao-fim-button' onClick={async () => {
                            const tentativaAtual = tentativas + 1;
                            setTentativas(tentativaAtual);

                            const { pontos, percentual, resultados } = calcularPontuacao();
                            if (resultados.length > 0) {
                                setStatusRespostas(resultados);
                            }
                            const mensagemResultado = `Tentativa ${tentativaAtual}: Você acertou ${percentual.toFixed(0)}% da atividade (${pontos.toFixed(2)}/10).`;
                            const atingiuMeta = pontos > notaMinima;

                            alert(`${mensagemResultado}\n${atingiuMeta ? 'Parabéns! A atividade será marcada como concluída.' : 'Você precisa atingir 6 pontos para concluir a atividade.'}`);

                            if (!atingiuMeta) {
                                return;
                            }

                            try {
                                const body = JSON.stringify({
                                    totalActivities: modulo.atividades.length,
                                    score: pontos,
                                    attempts: tentativaAtual
                                });
                                const res = await fetchWithCredentials(`${API_BASE}/api/progress/activity/${assinatura}/${modulo.id}/${atividade.id}`, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });
                                if (res.ok) {
                                    window.location.href = `/modulos/${assinatura}/${modulo.id}`;
                                } else {
                                    const data = await res.json().catch(() => ({}));
                                    alert('Erro ao enviar atividade: ' + (data.error || res.statusText));
                                }
                            } catch (err) {
                                console.error(err);
                                alert('Erro ao enviar atividade. Verifique sua conexão.');
                            }
                        }} style={{ backgroundColor: '#9A30EB', border: 'none', padding: '10px 16px', color: '#fff', cursor: 'pointer' }}>ENVIAR</button>
                    </div>
                </div>
                <div className='tarefa-tentativas-wrapper'>
                    <span className='tarefa-tentativas'>Tentativas registradas: {tentativas}</span>
                </div>
            </div>
            <Footer />
        </div>
        </>
    )
}

export default Atividades