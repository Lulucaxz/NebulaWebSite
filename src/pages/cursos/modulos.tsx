import { useParams, useNavigate } from 'react-router-dom';
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import { useState, useEffect } from 'react';
import { VideoCard } from './videos';
import { API_BASE, fetchWithCredentials } from '../../api';
import { Link } from "react-router-dom";
import { useUserAssinatura } from '../../hooks/useUserAssinatura';
import { ASSINATURA_LABEL_BY_SLUG, hasAccessToAssinatura, normalizeAssinaturaValue } from '../../utils/assinaturaAccess';

const DEFAULT_VIDEO_FALLBACKS = [
  { title: 'AULA 1', url: 'https://youtu.be/wvZH-IC4G_U' },
  { title: 'AULA 2', url: 'https://youtu.be/zYOeQNq347c' },
  { title: 'AULA 3', url: 'https://youtu.be/TYejsohIFWI' },
  { title: 'AULA 4', url: 'https://youtu.be/H2SlLWFlnCU' },
  { title: 'AULA 5', url: 'https://youtu.be/QqwPbX5HRTY' },
  { title: 'AULA 7', url: 'https://youtu.be/sfi5eyJqq2k' },
];

const PDF_DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1WDIRkL4pIhnVaJVssIG06RI_fIB_QxGI';

const getVideoFallback = (index: number) => DEFAULT_VIDEO_FALLBACKS[index] ?? DEFAULT_VIDEO_FALLBACKS[0];

function Modulos() {
  const params = useParams<{ assinatura: string; moduloId: string }>();
  const navigate = useNavigate();
  const assinaturaParam = params.assinatura ?? '';
  const moduloId = params.moduloId;
  const assinaturaSlug = normalizeAssinaturaValue(assinaturaParam);
  const assinaturaKey = assinaturaSlug ?? assinaturaParam;
  const { planSlug, isLoading: isLoadingPlan } = useUserAssinatura();
  const canAccessCourse = assinaturaSlug ? hasAccessToAssinatura(planSlug, assinaturaSlug) : false;

  // Minimal local types for this component to avoid `any` lint errors
  type Video = { id: number; titulo?: string; video?: string; subtitulo?: string; descricao?: string; backgroundImage?: string };
  type Questao = { questao?: string; dissertativa?: boolean; alternativas?: string[]; respostaCorreta?: string };
  type Atividade = { id: number; template?: { titulo?: string; descricao?: string }; terminado?: boolean; questoes?: Questao[] };
  type ModuloType = {
    id: number;
    introducao: { id: number; descricao: string; videoBackground: string; video: string };
    atividades: Atividade[];
    videoAulas: Video[];
  };

  const cloneModule = (mod?: ModuloType | null): ModuloType | null => {
    if (!mod) return null;
    return {
      ...mod,
      introducao: { ...mod.introducao },
      atividades: Array.isArray(mod.atividades)
        ? mod.atividades.map((atividade) => ({
            ...atividade,
            template: atividade.template ? { ...atividade.template } : undefined,
            questoes: Array.isArray(atividade.questoes)
              ? atividade.questoes.map((questao) => ({
                  ...questao,
                  alternativas: questao?.alternativas ? [...questao.alternativas] : undefined,
                }))
              : atividade.questoes,
          }))
        : [],
      videoAulas: Array.isArray(mod.videoAulas) ? mod.videoAulas.map((video) => ({ ...video })) : [],
    };
  };

  const [baseModule, setBaseModule] = useState<ModuloType | null>(null);
  const [moduloData, setModuloData] = useState<ModuloType | null>(null);
  const [loadingModule, setLoadingModule] = useState(false);
  const [moduleError, setModuleError] = useState<string | null>(null);
  const [progressSets, setProgressSets] = useState<{ moduleSet: Set<string>; activitySet: Set<string> } | null>(null);

  // Matriz para controlar destaque do carrossel
  const [matrizVideos, setMatrizVideos] = useState<boolean[]>([]);
  const [matrizVideoIndex, setMatrizVideoIndex] = useState<number>(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  const [matrizAtividadesIndex, setMatrizAtividadesIndex] = useState<number>(1);

  useEffect(() => {
    const totalVideos = moduloData?.videoAulas?.length ?? 0;
    setMatrizVideos(Array.from({ length: Math.max(0, totalVideos) }, (_, i) => i === 0));
    setMatrizVideoIndex(0);
    setActiveVideoIndex(null);
    setMatrizAtividadesIndex(1);
  }, [moduloData?.id]);

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

  useEffect(() => {
    if (!moduloId) {
      setBaseModule(null);
      setModuloData(null);
      setModuleError('Módulo não encontrado.');
      setLoadingModule(false);
      return;
    }

    let active = true;
    setLoadingModule(true);
    setModuleError(null);

    const loadModule = async () => {
      try {
        const res = await fetchWithCredentials(`${API_BASE}/api/course-content/modules/${moduloId}`);
        const data = await res.json().catch(() => ({}));
        if (!active) return;
        if (!res.ok || !data.module) {
          setBaseModule(null);
          setModuloData(null);
          setModuleError(data.error || 'Não foi possível carregar este módulo.');
          return;
        }
        const normalized = cloneModule(data.module as ModuloType);
        setBaseModule(normalized);
      } catch (error) {
        if (!active) return;
        console.error('Erro ao carregar módulo', error);
        setBaseModule(null);
        setModuloData(null);
        setModuleError('Erro ao carregar o módulo selecionado.');
      } finally {
        if (active) {
          setLoadingModule(false);
        }
      }
    };

    void loadModule();
    return () => {
      active = false;
    };
  }, [moduloId]);

  useEffect(() => {
    let active = true;
    const loadProgress = async () => {
      try {
        const res = await fetchWithCredentials(`${API_BASE}/api/progress`);
        if (!res.ok) {
          if (active) setProgressSets(null);
          return;
        }
        const data: { modules: Array<{ assinatura: string; modulo_id: number }>, activities: Array<{ assinatura: string; modulo_id: number; atividade_id: number }> } = await res.json();
        if (!active) return;
        setProgressSets({
          moduleSet: new Set(data.modules.map(m => `${m.assinatura}:${m.modulo_id}`)),
          activitySet: new Set(data.activities.map(a => `${a.assinatura}:${a.modulo_id}:${a.atividade_id}`)),
        });
      } catch {
        if (active) setProgressSets(null);
      }
    };
    loadProgress();
    return () => {
      active = false;
    };
  }, [assinaturaKey]);

  useEffect(() => {
    if (!baseModule) {
      setModuloData(null);
      return;
    }
    const cloned = cloneModule(baseModule);
    if (!cloned) {
      setModuloData(null);
      return;
    }
    if (!progressSets) {
      setModuloData(cloned);
      return;
    }
    const atividades = Array.isArray(cloned.atividades)
      ? cloned.atividades.map((atividade) => ({
          ...atividade,
          terminado:
            progressSets.activitySet.has(`${assinaturaKey}:${cloned.id}:${atividade.id}`) ||
            atividade.terminado,
        }))
      : [];
    setModuloData({ ...cloned, atividades });
  }, [assinaturaKey, baseModule, progressSets]);

  if (!assinaturaSlug) {
    return (
      <>
        <Menu />
        <div className="container">
          <div className="cursos-espacamento">
            Assinatura informada não é válida.
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isLoadingPlan) {
    return (
      <>
        <Menu />
        <div className="container">
          <div className="cursos-espacamento">Verificando sua assinatura...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isLoadingPlan && !canAccessCourse) {
    return (
      <>
        <Menu />
        <div className="container">
          <div className="cursos-espacamento">
            <div className="modulos-  ">
              Este conteúdo é exclusivo do plano {ASSINATURA_LABEL_BY_SLUG[assinaturaSlug]}.
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!moduloData) {
    return (
      <>
        <Menu />
        <div className="container">
          <div className="cursos-espacamento">
            {loadingModule ? 'Carregando módulo...' : (moduleError || 'Módulo não encontrado.')}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const m = moduloData;

  const handlePdfDownload = () => {
    if (typeof window === 'undefined') return;
    window.open(PDF_DOWNLOAD_URL, '_blank', 'noopener');
  };

  function updateMatrizAtividades(index: number) {
    setMatrizAtividadesIndex(index);
  }

  const goToVideoPlayer = ({
    videoUrl,
    title,
    subtitle,
    description,
    background,
  }: {
    videoUrl?: string | null;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    background?: string | null;
  }) => {
    const normalizedUrl = videoUrl?.trim();
    if (!normalizedUrl) return;

    const params = new URLSearchParams();
    params.set('url', normalizedUrl);
    if (title) params.set('title', title);
    if (subtitle) params.set('subtitle', subtitle);
    if (description) params.set('description', description);
    if (background) params.set('background', background);

    navigate(`/video-player?${params.toString()}`);
  };

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
              onPlay={() => goToVideoPlayer({
                videoUrl: m.introducao.video,
                title: m.template?.titulo ?? 'Introdução',
                subtitle: m.introducao.descricao,
                description: m.template?.descricao ?? undefined,
                background: m.introducao.videoBackground,
              })}
            />
            <img src="/icons/arrow-video.png" alt="" />
          </div>

          <div
            className="curso-download"
            role="button"
            tabIndex={0}
            onClick={handlePdfDownload}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handlePdfDownload();
              }
            }}
          >
            Baixar PDF
          </div>

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
                  if (index - 1 >= 0 && index < m.atividades.length) {
                    updateMatrizAtividades(index)
                  }
                }}>
                  <div className="carrocel-atividades-card-fundo">
                    <div className="carrocel-atividades-card-cima" style={{
                      backgroundColor: atividade.terminado ? 'var(--primary-600)' : 'color-mix(in srgb, var(--surface-raised) 97%, var(--palette-contrast) 3%)'
                    }}></div>
                    <div className="carrocel-atividades-card-baixo" style={{
                      backgroundColor: atividade.terminado
                        ? 'color-mix(in srgb, var(--primary-600) 85%, #000 15%)'
                        : 'color-mix(in srgb, var(--surface-page) 92%, var(--palette-contrast) 8%)'
                    }}></div>
                  </div>
                    <div className="carrocel-atividades-card">
                    <div className="carrocel-atividades-card-cima" style={{
                      backgroundColor: atividade.terminado ? 'var(--primary-500)' : 'color-mix(in srgb, var(--surface-raised) 90%, var(--palette-contrast) 10%)'
                    }}>
                      <div className="carrocel-atividades-card-titulo" style={{
                        color: atividade.terminado ? 'var(--text-on-primary)' : 'var(--text-primary)'
                      }}>{atividade.template?.titulo ?? ''}</div>
                      <div className="carrocel-atividades-card-descricao" style={{
                        color: atividade.terminado ? 'var(--text-on-primary)' : 'var(--text-primary)'
                      }}>{atividade.template?.descricao ?? ''}</div>
                    </div>

                    <Link to={`/modulos/${assinaturaSlug}/${m.id}/atividades/${index}`} className="carrocel-atividades-card-baixo" style={{
                      backgroundColor: atividade.terminado ? 'color-mix(in srgb, var(--primary-600) 92%, #000 8%)' : 'color-mix(in srgb, var(--surface-page) 90%, var(--palette-contrast) 10%)',
                      cursor: 'pointer'
                    }}>
                      <div className="carrocel-atividades-card-butao" style={{
                        color: atividade.terminado ? 'var(--text-on-primary)' : 'var(--text-primary)'
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
              if (itemsPerView < 3 ? itemsPerView < 2 ? matrizAtividadesIndex < m.atividades.length + 1 : matrizAtividadesIndex < m.atividades.length : matrizAtividadesIndex + 1 < m.atividades.length) {
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
                {m.videoAulas.map((videoCard: Video, videoCargIndex: number) => {
                  const fallback = getVideoFallback(videoCargIndex);
                  const safeVideoSource = videoCard.video?.trim() || fallback.url;
                  const safeVideoTitle = videoCard.titulo?.trim() || fallback.title;

                  return (
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
                    onClickCapture={() => updateMatrizVideos(videoCargIndex)}
                  >
                      <VideoCard
                        src={safeVideoSource}
                        backgroundImage={videoCard.backgroundImage}
                        width="100%"
                        height="100%"
                        showPlayIcon={true}
                        isActive={activeVideoIndex === videoCard.id}
                        autoPlayBlurred={matrizVideos[videoCargIndex]}
                        onActivate={() => setActiveVideoIndex(videoCard.id)}
                        onDeactivate={() => setActiveVideoIndex(null)}
                        onPlay={() => goToVideoPlayer({
                          videoUrl: safeVideoSource,
                          title: safeVideoTitle,
                          subtitle: videoCard.subtitulo,
                          description: videoCard.descricao,
                          background: videoCard.backgroundImage ?? m.introducao.videoBackground,
                        })}
                      />
                      <div className="videos-sessao-card-titulo">{safeVideoTitle}</div>
                    </div>
                  );
                })}
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
