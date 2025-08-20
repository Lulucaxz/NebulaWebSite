import "./sessaoPlanos.css"
import "../../../index.css"
import { Link } from "react-router-dom";
import Planos from "../../planos/planos";

function SessaoPlanos() {
    return (
        <>
            <div id="ssp-container">
                <div className="sessao">
                    <h1>ENCONTRE O MELHOR PLANO PARA VOCÊ</h1>
                    <hr />
                </div>

                <div className="video-planos">
                    <div>
                        <div className="video-planos-background"></div>
                        <img alt="Iniciar video sobre planos" src="play.svg" />
                    </div>
                </div>
                <div className="planos-mini-texto">
                    <span>
                        Após assistir o vídeo acima e entender como os nossos cursos funcionam, agora você poderá escolher qual o melhor plano para você.
                    </span>
                </div>
                <div className="container-planos-pagIni">
                    <div className="plano">
                        <h2>ÓRBITA</h2>
                        <p>Para iniciantes, aborda conceitos básicos de física e astronomia, como o Sistema Solar e leis fundamentais. Ideal para quem está começando sua jornada no universo científico.</p>
                        <div className="plano-nav-beneficios">
                            <div className="nav-beneficio"><p>Video aulas e PDFs</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Tarefas</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Planejamento de rotina</p> <img src="cancel.svg" /></div>
                            <div className="nav-beneficio"><p>Grupo no Whatsapp</p> <img src="cancel.svg" /></div>
                            <div className="nav-beneficio"><p>Mentorial semanal particular</p> <img src="cancel.svg" /></div>
                            <div className="nav-beneficio"><p>Emissão de certificado digital</p> <img src="cancel.svg" /></div>
                        </div>
                        <Link to="Planos" className="plano-button">R$900.99</Link>
                    </div>
                    <div className="plano">
                        <h2>GALÁXIA</h2>
                        <p>Explora temas intermediários como leis de Newton, estrelas, galáxias e introdução à relatividade. Perfeito para quem já conhece o básico e quer se aprofundar.</p>
                        <div className="plano-nav-beneficios">
                            <div className="nav-beneficio"><p>Video aulas e PDFs</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Tarefas</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Planejamento de rotina</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Grupo no Whatsapp</p> <img src="cancel.svg" /></div>
                            <div className="nav-beneficio"><p>Mentorial semanal particular</p> <img src="cancel.svg" /></div>
                            <div className="nav-beneficio"><p>Emissão de certificado digital</p> <img src="cancel.svg" /></div>
                        </div>
                        <Link to="Planos" className="plano-button">R$990.99</Link>
                    </div>
                    <div className="plano">
                        <h2>UNIVERSO</h2>
                        <p>Plano avançado com conteúdos sobre física quântica, buracos negros, energia escura e cosmologia. Recomendado para quem busca uma formação completa e aprofundada.</p>
                        <div className="plano-nav-beneficios">
                            <div className="nav-beneficio"><p>Video aulas e PDFs</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Tarefas</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Planejamento de rotina</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Grupo no Whatsapp</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Mentorial semanal particular</p> <img src="check-claro2.svg" /></div>
                            <div className="nav-beneficio"><p>Emissão de certificado digital</p> <img src="check-claro2.svg" /></div>
                        </div>
                        <Link to="Planos" className="plano-button">R$1299.90</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SessaoPlanos;