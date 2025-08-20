import { useParams } from 'react-router-dom';
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import { initial_cursos } from './components/cursosDados';
import { useState } from 'react';
import { VideoCard } from './videos';
import { Link } from "react-router-dom";

function Modulos() {
  const { assinatura, moduloId } = useParams<{ assinatura: string; moduloId: string }>();

  const curso = initial_cursos[assinatura ?? ''];
  const modulo = curso?.find((mod) => mod.id === Number(moduloId));

  if (!modulo) {
    return <div>Módulo não encontrado.</div>;
  }

  // Matriz para controlar destaque do carrossel
  const [matrizVideos, setMatrizVideos] = useState(Array.from({ length: modulo.videoAulas.length }, (_, i) => i === 0));
  const [matrizVideoIndex, setMatrizVideoIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  function updateMatrizVideos(index: number) {
    setMatrizVideos(prev => prev.map((_, i) => i === index));
    setMatrizVideoIndex(index);
  }

  const [matrizAtividades, setMatrizAtividades] = useState(Array.from({ length: modulo.atividades.length }, (_, i) => i === 0));
  const [matrizAtividadesIndex, setMatrizAtividadesIndex] = useState(0);


  function updateMatrizAtividades(index: number) {
    setMatrizAtividades(prev => prev.map((_, i) => i === index));
    setMatrizAtividadesIndex(index);
  }

  return (
    <>
      <Menu />
      <div className="container">
        <div className="cursos-espacamento">

          <div className="sessao">
            <h1>INTRODUÇÃO</h1>
            <hr />
          </div>
          <p>{modulo.introducao.descricao}</p>
          <div key={modulo.introducao.id} className='cursos-video-sessao'>
            <VideoCard
              src={modulo.introducao.video}
              backgroundImage={modulo.introducao.videoBackground}
              width="100%"
              height="300px"
              showPlayIcon={true}
              isActive={activeVideoIndex === modulo.introducao.id}
              onActivate={() => setActiveVideoIndex(modulo.introducao.id)}
              onDeactivate={() => setActiveVideoIndex(null)}
            />
            <img src="/arrow-video.png" alt="" />
          </div>

          <div className="curso-download">Baixar PDF</div>

          <div className="sessao">
            <h1>ATIVIDADES</h1>
            <hr />
          </div>
          <hr />
          <div className="carrocel-atividades">
            {modulo.atividades.map((atividade, index) => {
              return (
                <div key={`atividades${atividade.id}`} className='carrocel-atividades-card-cont' style={{
                  marginLeft: index === 0 ? `calc((100%/4 + 30px) * ${-matrizAtividadesIndex} + 100%/2 - 100%/8)` : '',
                  scale: index < matrizAtividadesIndex - 1 || index > matrizAtividadesIndex + 1 ? '0.8' : '1',
                  filter: index < matrizAtividadesIndex - 1 || index > matrizAtividadesIndex + 1 ? 'brightness(0.7)' : 'none',
                }} onClick={() => {
                  updateMatrizAtividades(index)
                }}>
                  <div className="carrocel-atividades-card-fundo">
                    <div className="carrocel-atividades-card-cima" style={{
                      backgroundColor: atividade.terminado ? '#6B11B1' : '#323232'
                    }}></div>
                    <div className="carrocel-atividades-card-baixo" style={{
                      backgroundColor: atividade.terminado ? '#C9BDD3' : '#222222'
                    }}></div>
                  </div>
                  <div className="carrocel-atividades-card">
                    <div className="carrocel-atividades-card-cima" style={{
                      backgroundColor: atividade.terminado ? '#9A30EB' : '#4E4E4E'
                    }}>
                      <div className="carrocel-atividades-card-titulo">{atividade.template.titulo}</div>
                      <div className="carrocel-atividades-card-descricao">{atividade.template.descricao}</div>
                    </div>
                    
                    <Link to={`/modulos/${assinatura}/${modulo.id}/atividades/${index}`} className="carrocel-atividades-card-baixo" style={{
                        backgroundColor: atividade.terminado ? '#F8EFFF' : '#323232',
                        cursor: 'pointer'
                      }}>
                        <div className="carrocel-atividades-card-butao" style={{
                          color: atividade.terminado ? '#323232' : '#ffffff',
                        }}>ABRIR ATIVIDADE</div>
                    </Link>
                  </div>
                </div>
              )
            })}
            <div className="videos-sessao-arrow-left" onClick={() => {
              if (matrizAtividadesIndex - 1 >= 0) {
                updateMatrizAtividades(matrizAtividadesIndex - 1)
              }
            }}></div>
            <div className="videos-sessao-arrow-rigth" onClick={() => {
              if (matrizAtividadesIndex + 1 < matrizVideos.length) {
                updateMatrizAtividades(matrizAtividadesIndex + 1)
              }
            }}></div>
          </div>
          <hr />

          <div className="sessao">
            <h1>VÍDEO AULAS</h1>
            <hr />
          </div>
          <div className="sessao">
            <div className="videos-sessao-container">
              <div className="videos-sessao-container-int">
                {modulo.videoAulas.map((videoCard, videoCargIndex) => (
                  <div
                    key={videoCard.id}
                    className="videos-sessao-card"
                    style={{
                      width: matrizVideos[videoCargIndex] ? `calc((100% - (60px * 3)) * 2.5 / 4.5)` : `calc((100% - (60px * 3)) / 4.5)`,
                      flexShrink: 0,
                      marginLeft: videoCargIndex === 0 ? `calc(((100% - (60px * 3)) / 4.5) * ${matrizVideoIndex * -1} + ${matrizVideoIndex * -30}px)` : '0px',
                      filter: videoCargIndex < matrizVideoIndex || videoCargIndex >= matrizVideoIndex + 3 ? 'brightness(0.3)' : 'none',
                      border: videoCargIndex === matrizVideoIndex ? '1px solid white' : 'none',
                    }}
                  >
                    <VideoCard
                      src={videoCard.video}
                      width="100%"
                      height="100%"
                      showPlayIcon={true}
                      isActive={activeVideoIndex === videoCard.id}
                      autoPlayBlurred={matrizVideos[videoCargIndex]}
                      onActivate={() => setActiveVideoIndex(videoCard.id)}
                      onDeactivate={() => setActiveVideoIndex(null)}
                    />
                    <div
                      className="videos-sessao-card-click"
                      onClick={() => updateMatrizVideos(videoCargIndex)}
                      style={{
                        pointerEvents: matrizVideos[videoCargIndex] ? 'none' : 'auto',
                      }}
                    />
                    <div className="videos-sessao-card-titulo">{videoCard.titulo}</div>
                  </div>
                ))}
                <div className="videos-sessao-arrow-left" onClick={() => {
                  if (matrizVideoIndex - 1 >= 0) {
                    updateMatrizVideos(matrizVideoIndex - 1)
                  }
                }}></div>
                <div className="videos-sessao-arrow-rigth" onClick={() => {
                  if (matrizVideoIndex + 1 < matrizVideos.length) {
                    updateMatrizVideos(matrizVideoIndex + 1)
                  }
                }}></div>
              </div>
              <div className="videos-sessao-subtitulo">{modulo.videoAulas[matrizVideoIndex].subtitulo}</div>
              <div className="videos-sessao-descricao">{modulo.videoAulas[matrizVideoIndex].descricao}</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Modulos;
