import { useParams } from 'react-router-dom';
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import { initial_cursos } from './components/cursosDados';
import { useState, useEffect } from 'react';
import { VideoCard } from './videos';
import { API_BASE, fetchWithCredentials } from '../../api';
import { Link } from "react-router-dom";

function Modulos() {
  const { assinatura, moduloId } = useParams<{ assinatura: string; moduloId: string }>();

  // Minimal local types for this component to avoid `any` lint errors
  type Video = { id: number; titulo?: string; video?: string; subtitulo?: string; descricao?: string };
  type Atividade = { id: number; template?: { titulo?: string; descricao?: string }; terminado?: boolean };
  type ModuloType = { id: number; introducao: { id: number; descricao: string; videoBackground: string; video: string }; atividades: Atividade[]; videoAulas: Video[] };

  const curso = (initial_cursos as unknown as Record<string, ModuloType[]>)[assinatura ?? ''];
  const modulo = curso?.find((mod: ModuloType) => mod.id === Number(moduloId));

  // Local copy to overlay per-user completion from /api/progress
  const [moduloData, setModuloData] = useState<ModuloType | null>(modulo ?? null);

  // Avoid calling hooks conditionally: compute counts first and provide safe defaults
  const videoCount = modulo?.videoAulas?.length ?? 0;
  // atividadeCount removed (not needed)

  // Matriz para controlar destaque do carrossel
  const [matrizVideos, setMatrizVideos] = useState<boolean[]>(() => Array.from({ length: Math.max(0, videoCount) }, (_, i) => i === 0));
  const [matrizVideoIndex, setMatrizVideoIndex] = useState<number>(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  const [matrizAtividadesIndex, setMatrizAtividadesIndex] = useState<number>(1);

  function updateMatrizVideos(index: number) {
    setMatrizVideos(prev => prev.map((_, i) => i === index));
    setMatrizVideoIndex(index);
  }

  const [itemsPerView, setItemsPerView] = useState<number>(() =>
    typeof window !== 'undefined' && window.innerWidth > 1500 ? 3 : window.innerWidth > 1250 ? 2 : 1
  );

  // Update itemsPerView on resize. Use resize listener and cleanup.
  useEffect(() => {
    const update = () => {
      setItemsPerView(
        typeof window !== 'undefined' && window.innerWidth > 1500 ?
          3 : window.innerWidth > 1250 ?
          2 : window.innerWidth > 768 ?
          1 :
          0
      );
    };

    // set initial
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Load per-user progress and overlay terminado for activities and module
  useEffect(() => {
    const load = async () => {
      if (!modulo) return;
      try {
        const res = await fetchWithCredentials(`${API_BASE}/api/progress`);
        if (!res.ok) { setModuloData(modulo); return; }
        const data: { modules: Array<{ assinatura: string; modulo_id: number }>, activities: Array<{ assinatura: string; modulo_id: number; atividade_id: number }> } = await res.json();
        const activitySet = new Set(data.activities.map(a => `${a.assinatura}:${a.modulo_id}:${a.atividade_id}`));
        const updatedAtividades: Atividade[] = Array.isArray(modulo.atividades) ? modulo.atividades.map(a => ({
          ...a,
          terminado: activitySet.has(`${assinatura}:${modulo.id}:${a.id}`) || !!a.terminado
        })) : [];
        setModuloData({ ...modulo, atividades: updatedAtividades });
      } catch {
        setModuloData(modulo);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assinatura, moduloId]);

  // If modulo is not found, render a friendly message. Hooks above ensure consistent hook order.
  if (!modulo) {
    return <div>Módulo não encontrado.</div>;
  }

  const m = moduloData ?? modulo;

  function updateMatrizAtividades(index: number) {
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
          <p>{m.introducao.descricao}</p>
          <div key={m.introducao.id} className='cursos-video-sessao'>
            <VideoCard
              src={m.introducao.video}
              backgroundImage={m.introducao.videoBackground}
              width="100%"
              height="300px"
              showPlayIcon={true}
              isActive={activeVideoIndex === m.introducao.id}
              onActivate={() => setActiveVideoIndex(m.introducao.id)}
              onDeactivate={() => setActiveVideoIndex(null)}
            />
            <img src="/icons/arrow-video.png" alt="" />
          </div>

          <div className="curso-download">Baixar PDF</div>

          <div className="sessao">
            <h1>ATIVIDADES</h1>
            <hr />
          </div>
          <hr />
          <div className="carrocel-atividades">
            {m.atividades.map((atividade: Atividade, index: number) => {
              return (
                <div key={`atividades${atividade.id}`} className='carrocel-atividades-card-cont' style={{
                  width: `${itemsPerView < 3 ? itemsPerView < 2 ? 'calc(100% / 2)' : 'calc(100% / 3)' : 'calc(100% / 4)'}`,
                  marginLeft: index === 0
                    ? itemsPerView < 3
                      ? itemsPerView < 2
                        ? `calc((100%/2 + 30px) * ${-matrizAtividadesIndex} + 100%*3/4 + 30px)`
                        : `calc((100%/3 + 30px) * ${-matrizAtividadesIndex} + 100%/2 + 15px)`
                      : `calc((100%/4 + 30px) * ${-matrizAtividadesIndex} + 100%/2 - 100%/8)`
                    : '',
                  scale: index < matrizAtividadesIndex - 1 || index > (itemsPerView < 3 ? itemsPerView < 2 ? matrizAtividadesIndex - 1 : matrizAtividadesIndex : matrizAtividadesIndex + 1) ? '0.8' : '1',
                  filter: index < matrizAtividadesIndex - 1 || index > (itemsPerView < 3 ? itemsPerView < 2 ? matrizAtividadesIndex - 1 : matrizAtividadesIndex : matrizAtividadesIndex + 1) ? 'brightness(0.7)' : 'none',
                }} onClick={() => {
                  if (index - 1 >= 0 && index < modulo.atividades.length) {
                    updateMatrizAtividades(index)
                  }
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
                      <div className="carrocel-atividades-card-titulo">{atividade.template?.titulo ?? ''}</div>
                      <div className="carrocel-atividades-card-descricao">{atividade.template?.descricao ?? ''}</div>
                    </div>

                    <Link to={`/modulos/${assinatura}/${m.id}/atividades/${index}`} className="carrocel-atividades-card-baixo" style={{
                      backgroundColor: atividade.terminado ? '#F8EFFF' : '#323232',
                      cursor: 'pointer'
                    }}>
                      <div className="carrocel-atividades-card-butao" style={{
                        color: atividade.terminado ? '#323232' : '#ffffff',
                      }}>ABRIR ATIVIDADE {index + 1}</div>
                    </Link>
                  </div>
                </div>
              )
            })}
            <div className="videos-sessao-arrow-left" onClick={() => {
              if (matrizAtividadesIndex - 2 >= 0) {
                updateMatrizAtividades(matrizAtividadesIndex - 1)
              }
            }}></div>
            <div className="videos-sessao-arrow-rigth" onClick={() => {
              if (itemsPerView < 3 ? itemsPerView < 2 ? matrizAtividadesIndex < modulo.atividades.length + 1 : matrizAtividadesIndex < modulo.atividades.length : matrizAtividadesIndex + 1 < modulo.atividades.length) {
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
                {m.videoAulas.map((videoCard: Video, videoCargIndex: number) => (
                  <div
                    key={videoCard.id}
                    className="videos-sessao-card"
                    style={{
                      width: 
                      matrizVideos[videoCargIndex] ?
                        itemsPerView < 2 ?
                          itemsPerView < 1 ?
                            `calc((100% - (60px * 3))`
                          :
                            `calc(((100% - (60px * 3)) * 2.5 / 4.5) * 1.5)`
                        :
                        `calc((100% - (60px * 3)) * 2.5 / 4.5)`
                      : 
                        itemsPerView < 2 ?
                          itemsPerView < 1 ?
                            `calc(((100% - (60px * 3)) / 2))`
                          :
                            `calc(((100% - (60px * 3)) / 4.5) * 1.5)`
                        :
                          `calc((100% - (60px * 3)) / 4.5)`,
                      flexShrink: 0,
                      marginLeft: 
                      videoCargIndex === 0 ?
                        itemsPerView < 2 ?
                          itemsPerView < 1 ?
                            `calc(((100% - (60px * 3)) / 2) * ${matrizVideoIndex * -1} + ${matrizVideoIndex * -30}px + 60px)`
                          :
                            `calc((((100% - (60px * 3)) / 4.5) * ${matrizVideoIndex * -1}) * 1.5 + ${matrizVideoIndex * -30}px + 60px)`
                        :
                        `calc(((100% - (60px * 3)) / 4.5) * ${matrizVideoIndex * -1} + ${matrizVideoIndex * -30}px + 60px)`
                      :
                        '0px',
                      filter: videoCargIndex < matrizVideoIndex || videoCargIndex >= matrizVideoIndex + 3 ? 'brightness(0.3)' : 'none',
                      border: videoCargIndex === matrizVideoIndex ? '1px solid white' : 'none',
                    }}
                  >
                    <VideoCard
                      src={videoCard.video ?? ''}
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
              <div className="videos-sessao-subtitulo">{m.videoAulas[matrizVideoIndex]?.subtitulo ?? ''}</div>
              <div className="videos-sessao-descricao">{m.videoAulas[matrizVideoIndex]?.descricao ?? ''}</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Modulos;
