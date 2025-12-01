import "./apresentacao.css"
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Apresentacao() {
    const { t } = useTranslation();
    
    return (
        <>
            <div className="apr-container">

                <div className="sessao">
                    <h1>{t('home.content.title')}</h1>
                    <hr />
                </div>

                <div className="apr-cards">
                    <div className="apr-card">
                        <div className="apr-descricao-card">
                            <div className="apr-titulo-card">{t('home.content.cards.videoLessons.title')}</div>
                            <div className="apr-texto-card">{t('home.content.cards.videoLessons.description')}</div>
                        </div>
                        <div className="apr-imagem-card" style={{ backgroundImage: "url(/img/ImagemCardAulas.png)" }}></div>
                    </div>
                    <div className="apr-card">
                        <div className="apr-descricao-card">
                            <div className="apr-titulo-card">{t('home.content.cards.pdfs.title')}</div>
                            <div className="apr-texto-card">{t('home.content.cards.pdfs.description')}</div>
                        </div>
                        <div className="apr-imagem-card" style={{ backgroundImage: "url(/img/ImagemCardTarefas.png)" }}></div>
                    </div>
                    <div className="apr-card">
                        <div className="apr-descricao-card">
                            <div className="apr-titulo-card">{t('home.content.cards.qa.title')}</div>
                            <div className="apr-texto-card">{t('home.content.cards.qa.description')}</div>
                        </div>
                        <div className="apr-imagem-card" style={{ backgroundImage: "url(/img/ImagemCardAvaliacoes.png)" }}></div>
                    </div>
                    <div className="apr-card">
                        <div className="apr-descricao-card">
                            <div className="apr-titulo-card">{t('home.content.cards.signup.title')}</div>
                            <div className="apr-texto-card">{t('home.content.cards.signup.description')}</div>
                            <Link to="cadastrar" className="apr-botao-card"><span>{t('home.content.cards.signup.button')}</span></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Apresentacao;