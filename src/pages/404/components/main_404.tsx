import "./main_404.css"
import { Link } from 'react-router-dom'

export function Main() {
    return (
        <>
        <div className="container-404">
            <div id="main-404">
                <div id="msg-404">Pagina não encontrada</div>
                <div className="content-404">
                    <div id="error">
                        <div id="f1">4</div>
                        <div id="circle">
                            <div id="smalldot">
                            
                            </div>

                        </div>
                        <div id="circle2">
                            <div id="circle3"></div>
                            <div id="smalldot2"></div>
                        </div>
                        <div id="f2">4</div>
                    </div>

                    <div id="info"> Este endereço solicitado não foi encontrado, verifique se a URL está escrita corretamente. Ou acesse a nossa pagina principal clicando no botão abaixo.</div>
                </div>

                <Link to="/">
                    <div id="btn">Página Inicial</div>
                </Link>
            </div>
            </div>
        </>
    )
}