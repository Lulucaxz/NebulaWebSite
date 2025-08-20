import "./objetivos.css";

function Objetivos() {
  return (
    <>
      <div className="obj-container">

        <div className="sessao">
          <h1>QUEM SOMOS</h1>
          <hr />
        </div>

        <div className="obj-container-objetivos">
          <div className="obj-container-objetivo">
            <div className="obj-icone">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
              </svg>
            </div>
            <div className="obj-barra-texto">
              <span>Nossa missão: ensinar astronomia e astrofísica de forma completa, guiando os alunos do nível mais básico ao mais avançado. Nosso propósito é preparar adolescentes recém-saídos do ensino médio e adultos de todas as idades para dominarem o conhecimento do universo, oferecendo um caminho real para seguirem carreiras de destaque nos diversos campos da física e da ciência espacial.</span>
            </div>
          </div>

          <div className="obj-container-objetivo">
            <div className="obj-icone">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M80-120v-80h360v-447q-26-9-45-28t-28-45H240l120 280q0 50-41 85t-99 35q-58 0-99-35t-41-85l120-280h-80v-80h247q12-35 43-57.5t70-22.5q39 0 70 22.5t43 57.5h247v80h-80l120 280q0 50-41 85t-99 35q-58 0-99-35t-41-85l120-280H593q-9 26-28 45t-45 28v447h360v80H80Zm585-320h150l-75-174-75 174Zm-520 0h150l-75-174-75 174Zm335-280q17 0 28.5-11.5T520-760q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760q0 17 11.5 28.5T480-720Z" />
              </svg>
            </div>
            <div className="obj-barra-texto">
              <span>Nossa visão: ser reconhecido nacional e internacionalmente como o curso mais completo, acessível e inspirador de astronomia e astrofísica, presente tanto online quanto em instituições de ensino. Queremos ser o ponto de partida para grandes carreiras científicas, formando alunos que se destaquem em universidades, centros de pesquisa e agências espaciais ao redor do mundo.</span>
            </div>
          </div>

          <div className="obj-container-objetivo">
            <div className="obj-icone">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
            </div>
            <div className="obj-barra-texto obj-barra-texto-valores">
              <span>Nossos valores: acreditamos em um ensino de qualidade, acessível para todos, independentemente da idade ou formação. Valorizamos o amor pela ciência, a curiosidade, o respeito à diversidade e o compromisso com cada aluno em sua jornada de aprendizado. Nosso conteúdo é baseado em fontes confiáveis e atualizadas, sempre com o objetivo de transformar vidas por meio do conhecimento.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Objetivos;
