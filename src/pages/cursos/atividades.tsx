import { useParams } from 'react-router-dom';
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import { initial_cursos } from './components/cursosDados';
import { useState } from 'react';
import { fetchWithCredentials, API_BASE } from '../../api';
import { Link } from "react-router-dom";

function Atividades() {
  const { assinatura, moduloId, atividadeInd } = useParams<{ assinatura: string; moduloId: string; atividadeInd : string }>();
        // Minimal local types to avoid implicit 'any'
        type Questao = { questao?: string; dissertativa?: boolean };
        type AtividadeType = { id: number; questoes?: Questao[] };
        type ModuloType = { id: number; atividades: AtividadeType[] };

        const curso = (initial_cursos as unknown as Record<string, ModuloType[]>)[assinatura ?? ''];
        const modulo = curso?.find((mod: ModuloType) => mod.id === Number(moduloId));
        const atividade = modulo?.atividades?.[Number(atividadeInd)] as AtividadeType;
    // Local per-question state stored in arrays to avoid calling hooks inside map
    const [respostas, setRespostas] = useState<string[]>(() => (atividade?.questoes || []).map(() => 'Digite sua resposta aqui...'));
    const [matrizAltenativas, setMatrizAltenativas] = useState<boolean[][]>(() => (atividade?.questoes || []).map(() => Array.from({ length: 4 }, () => false)));
    console.log(atividadeInd)

    // If modulo is not found, render a friendly message. Hooks above ensure consistent hook order.
    if (!modulo || !atividade) {
        return <div>Módulo não encontrado.</div>;
    }

  return (
    <>
      <Menu />
      <div className="container">
        <div className="cursos-espacamento">
            {atividade.questoes?.map((questao: Questao, index: number) => {
                function updateMatrizAltenativas(choice: number) {
                    setMatrizAltenativas(prev => prev.map((arr, i) => i === index ? arr.map((_, j) => j === choice) : arr));
                }

                return (
                    <div key={`questao${atividade.id}-${index}`} className='questao'>
                        <div className="sessao">
                            <h1>Questão {index+1}</h1>
                            <hr />
                        </div>
                        <div className="questao-descricao">{questao.questao}</div>
                        <textarea className='questao-disertativa'
                            maxLength={2000}
                            value={respostas[index]}
                            onChange={e => setRespostas(prev => prev.map((v,i) => i===index ? e.target.value : v))}
                            style={{
                            display: questao.dissertativa ? 'auto' : 'none',
                        }}></textarea>
                        <div className="questao-alternativas" style={{
                            display: !questao.dissertativa ? 'grid' : 'none'
                        }}>
                            <div className="questao-alternativa" onClick={() => {updateMatrizAltenativas(0)}}>
                                <div className="alternativa-letra" style={{
                                    backgroundColor: matrizAltenativas[index]?.[0] ? '#F8EFFF' : '#9A30EB',
                                    color: matrizAltenativas[index]?.[0] ? '#9A30EB' : '#F8EFFF'
                                }}>A</div>
                                <div className="alternativa-texto">Este modulo vai tratar de Lorem ipsum dolor sit amet. Id laudantium nesciunt ea soluta odit sed blanditiis repellendus. Sit officia excepturi </div>
                            </div>
                            <div className="questao-alternativa" onClick={() => {updateMatrizAltenativas(1)}}>
                                <div className="alternativa-letra" style={{
                                    backgroundColor: matrizAltenativas[index]?.[1] ? '#F8EFFF' : '#9A30EB',
                                    color: matrizAltenativas[index]?.[1] ? '#9A30EB' : '#F8EFFF'
                                }}>B</div>
                                <div className="alternativa-texto">Este modulo vai tratar de Lorem ipsum dolor sit amet. Id laudantium nesciunt ea soluta odit sed blanditiis.</div>
                            </div>  
                            <div className="questao-alternativa" onClick={() => {updateMatrizAltenativas(2)}}>
                                <div className="alternativa-letra" style={{
                                    backgroundColor: matrizAltenativas[index]?.[2] ? '#F8EFFF' : '#9A30EB',
                                    color: matrizAltenativas[index]?.[2] ? '#9A30EB' : '#F8EFFF'
                                }}>C</div>
                                <div className="alternativa-texto">dolor sit amet. Id laudantium nesciunt ea soluta odit sed blanditiis repellendus. Sit officia excepturi </div>
                            </div>
                            <div className="questao-alternativa" onClick={() => {updateMatrizAltenativas(3)}}>
                                <div className="alternativa-letra" style={{
                                    backgroundColor: matrizAltenativas[index]?.[3] ? '#F8EFFF' : '#9A30EB',
                                    color: matrizAltenativas[index]?.[3] ? '#9A30EB' : '#F8EFFF'
                                }}>D</div>
                                <div className="alternativa-texto">Este modulo vai tratar de Lorem ipsum dolor sit amet. </div>
                            </div>
                        </div>
                    </div>
                )
            })}
            <div className="sessao">
                <h1>FIM DA TAREFA</h1>
                <hr />
            </div>
            <div className="tarefa-sessao-fim">
                <p>
                    Você chegou ao fim desta tarefa. Certifique-se de que todas as questões então respondidas ou marcadas de forma correta, cuidados com palavras erradas e se atente as nomenclaturas e sinais utilizados.
                </p>
                <Link className='tarefa-sessao-fim-button' to={`/modulos/${assinatura}/${modulo.id}`}>CANCELAR</Link>
                {/* Submit handler: mark activity completed, add points and persist on server */}
                <button className='tarefa-sessao-fim-button' onClick={async () => {
                    try {
                        const body = JSON.stringify({ totalActivities: modulo.atividades.length });
                        const res = await fetchWithCredentials(`${API_BASE}/api/progress/activity/${assinatura}/${modulo.id}/${atividade.id}`, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });
                        if (res.ok) {
                            // Redirect back to module page (TemplateModulos will re-fetch progress and mark module completed if applicable)
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
        <Footer />
      </div>
    </>
  )
}

export default Atividades