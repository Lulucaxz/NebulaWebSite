import { useParams } from 'react-router-dom';
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import { initial_cursos } from './components/cursosDados';
import { useState } from 'react';
import { Link } from "react-router-dom";

function atividades() {
  const { assinatura, moduloId, atividadeInd } = useParams<{ assinatura: string; moduloId: string; atividadeInd : string }>();

  const curso = initial_cursos[assinatura ?? ''];
  const modulo = curso?.find((mod) => mod.id === Number(moduloId));
  const atividade = modulo.atividades[Number(atividadeInd)]

  if (!modulo) {
    return <div>Módulo não encontrado.</div>;
  }
  console.log(atividadeInd)

  return (
    <>
      <Menu />
      <div className="container">
        <div className="cursos-espacamento">
            {atividade.questoes.map((questao, index) => {
                const [resposta, setResposta] = useState('Digite sua resposta aqui...')
                const [matrizAltenativas, setMatrizAltenativas] = useState(Array.from({ length: 4 }, () => false));

                function updateMatrizAltenativas(index: number) {
                    setMatrizAltenativas(prev => prev.map((_, i) => i === index));
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
                            value={resposta}
                            onChange={e => setResposta(e.target.value)}
                            style={{
                            display: questao.dissertativa ? 'auto' : 'none',
                        }}></textarea>
                        <div className="questao-alternativas" style={{
                            display: !questao.dissertativa ? 'grid' : 'none'
                        }}>
                            <div className="questao-alternativa" onClick={() => {updateMatrizAltenativas(0)}}>
                                <div className="alternativa-letra" style={{
                                    backgroundColor: matrizAltenativas[0] ? '#F8EFFF' : '#9A30EB',
                                    color: matrizAltenativas[0] ? '#9A30EB' : '#F8EFFF'
                                }}>A</div>
                                <div className="alternativa-texto">Este modulo vai tratar de Lorem ipsum dolor sit amet. Id laudantium nesciunt ea soluta odit sed blanditiis repellendus. Sit officia excepturi </div>
                            </div>
                            <div className="questao-alternativa" onClick={() => {updateMatrizAltenativas(1)}}>
                                <div className="alternativa-letra" style={{
                                    backgroundColor: matrizAltenativas[1] ? '#F8EFFF' : '#9A30EB',
                                    color: matrizAltenativas[1] ? '#9A30EB' : '#F8EFFF'
                                }}>B</div>
                                <div className="alternativa-texto">Este modulo vai tratar de Lorem ipsum dolor sit amet. Id laudantium nesciunt ea soluta odit sed blanditiis.</div>
                            </div>  
                            <div className="questao-alternativa" onClick={() => {updateMatrizAltenativas(2)}}>
                                <div className="alternativa-letra" style={{
                                    backgroundColor: matrizAltenativas[2] ? '#F8EFFF' : '#9A30EB',
                                    color: matrizAltenativas[2] ? '#9A30EB' : '#F8EFFF'
                                }}>C</div>
                                <div className="alternativa-texto">dolor sit amet. Id laudantium nesciunt ea soluta odit sed blanditiis repellendus. Sit officia excepturi </div>
                            </div>
                            <div className="questao-alternativa" onClick={() => {updateMatrizAltenativas(3)}}>
                                <div className="alternativa-letra" style={{
                                    backgroundColor: matrizAltenativas[3] ? '#F8EFFF' : '#9A30EB',
                                    color: matrizAltenativas[3] ? '#9A30EB' : '#F8EFFF'
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
                <Link className='tarefa-sessao-fim-button' to={`/modulos/${assinatura}/${modulo.id}`} style={{ backgroundColor: '#9A30EB' }}>ENVIAR</Link>
            </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default atividades