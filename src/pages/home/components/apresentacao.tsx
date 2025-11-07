import "./apresentacao.css"
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Apresentacao() {
    const { t } = useTranslation();
    
    return (
        <>
            <div className="apr-container">

                <div className="sessao">
                    <h1>{t('NOSSO CONTEÚDO EXCLUSIVO')}</h1>
                    <hr />
                </div>

                <div className="apr-cards">
                    <div className="apr-card">
                        <div className="apr-descricao-card">
                            <div className="apr-titulo-card">{t('VÍDEOS AULA')}</div>
                            <div className="apr-texto-card">{t('Aulas gravadas com explicações didáticas e exercícios comentados para guiar você do básico ao avançado na astronomia e astrofísica. Assista no seu ritmo, quantas vezes quiser.')}</div>
                        </div>
                        <div className="apr-imagem-card" style={{ backgroundImage: "url(/img/ImagemCardAulas.png)" }}></div>
                    </div>
                    <div className="apr-card">
                        <div className="apr-descricao-card">
                            <div className="apr-titulo-card">{t('PDF E TAREFAS')}</div>
                            <div className="apr-texto-card">{t('Conteúdo em PDF para quem prefere aprender lendo, além de tarefas estruturadas que fazem parte do cronograma de aprendizado e reforçam cada tema estudado.')}</div>
                        </div>
                        <div className="apr-imagem-card" style={{ backgroundImage: "url(/img/ImagemCardTarefas.png)" }}></div>
                    </div>
                    <div className="apr-card">
                        <div className="apr-descricao-card">
                            <div className="apr-titulo-card">{t('DÚVIDAS E RESPOSTAS')}</div>
                            <div className="apr-texto-card">{t('Tenha acesso a um fórum exclusivo com outros alunos e conte com o suporte direto dos professores para tirar dúvidas e aprofundar seus estudos.')}</div>
                        </div>
                        <div className="apr-imagem-card" style={{ backgroundImage: "url(/img/ImagemCardAvaliacoes.png)" }}></div>
                    </div>
                    <div className="apr-card">
                        <div className="apr-descricao-card">
                            <div className="apr-titulo-card">{t('FAÇA JÁ SEU CADASTRO')}</div>
                            <div className="apr-texto-card">{t('Cadastre-se gratuitamente e tenha acesso imediato a aulas introdutórias do curso. Descubra como é fácil e envolvente começar sua jornada pelo universo!')}</div>
                            <Link to="cadastrar" className="apr-botao-card"><span>{t('CADASTRAR')}</span></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Apresentacao;