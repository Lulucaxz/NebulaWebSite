import "./carrosselAulas.css";

function CarrosselAulas() {
  
  return (
    <>
      <div className="sessao sessao-descentralizada">
        <h1>VÍDEOS GRATUITOS</h1>
        <hr />
      </div>

      <div className="container-carrossel">
        <div className="carrosel-card">
          <div
            style={{ backgroundImage: "url(/video1.jpg" }}
            className="imagem-card-carrossel"
          ></div>
          <div className="grupo-informacao">
            <h3>O QUE É A ASTRONOMIA?</h3>
            <h4>Prof° Luiz Tavares</h4>
          </div>
          <a href="pages/video1.html">ASSISTIR</a>
        </div>
        <div className="carrosel-card bloqueado">
          <div
            style={{ backgroundImage: "url(/video2.jpg)" }}
            className="imagem-card-carrossel"
          ></div>
          <div className="grupo-informacao">
            <h3>COMO TUDO SURGIU?</h3>
            <h4>Prof° Luiz Tavares</h4>
          </div>
          <a href="#">BLOQUEADO</a>
        </div>
        <div className="carrosel-card bloqueado">
          <div
            style={{ backgroundImage: "url(/video3.jpg)" }}
            className="imagem-card-carrossel"
          ></div>
          <div className="grupo-informacao">
            <h3>PROBLEMA DOS 3 CORPOS</h3>
            <h4>Prof° Luiz Tavares</h4>
          </div>
          <a href="#">BLOQUEADO</a>
        </div>
        <div className="carrosel-card bloqueado">
          <div
            style={{ backgroundImage: "url(/video4.jpg)" }}
            className="imagem-card-carrossel"
          ></div>
          <div className="grupo-informacao">
            <h3>SISTEMAS INTERPLANETÁRIOS</h3>
            <h4>Prof° Luiz Tavares</h4>
          </div>
          <a href="#">BLOQUEADO</a>
        </div>
        <div className="carrosel-card bloqueado">
          <div
            style={{ backgroundImage: "url(/video5.jpg)" }}
            className="imagem-card-carrossel"
          ></div>
          <div className="grupo-informacao">
            <h3>RELATIVIDADE GERAL</h3>
            <h4>Prof° Luiz Tavares</h4>
          </div>
          <a href="#">BLOQUEADO</a>
        </div>
        <div className="carrosel-card bloqueado">
          <div
            style={{ backgroundImage: "url(/video6.jpg)" }}
            className="imagem-card-carrossel"
          ></div>
          <div className="grupo-informacao">
            <h3>ONDAS DE SCHRODINGER</h3>
            <h4>Prof° Luiz Tavares</h4>
          </div>
          <a href="#">BLOQUEADO</a>
        </div>
        <div className="carrosel-card bloqueado">
          <div
            style={{ backgroundImage: "url(/video7.jpg)" }}
            className="imagem-card-carrossel"
          ></div>
          <div className="grupo-informacao">
            <h3>LEIS DE KEPLER</h3>
            <h4>Prof° Luiz Tavares</h4>
          </div>
          <a href="#">BLOQUEADO</a>
        </div>
      </div>
    </>
  );
}

export default CarrosselAulas;
