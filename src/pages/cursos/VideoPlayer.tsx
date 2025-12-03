import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Menu } from '../../components/Menu';
import Footer from '../../components/footer';

const getParam = (value: string | null, fallback = '') => value?.trim() || fallback;

export default function VideoPlayer() {
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const videoUrl = getParam(search.get('url'));
  const title = getParam(search.get('title'), 'Vídeo da aula');
  const subtitle = getParam(search.get('subtitle'));
  const description = getParam(search.get('description'));
  const background = getParam(search.get('background'));

  const canPlay = useMemo(() => ReactPlayer.canPlay(videoUrl), [videoUrl]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Menu />
      <div className="container" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="cursos-espacamento" style={{ paddingBottom: '2rem' }}>
          <button
            type="button"
            onClick={goBack}
            style={{
              marginBottom: '1.5rem',
              background: 'transparent',
              border: '1px solid var(--border-muted, rgba(255,255,255,0.2))',
              color: 'var(--text-primary)',
              padding: '0.5rem 1.5rem',
              cursor: 'pointer'
            }}
          >
            VOLTAR
          </button>

          {canPlay ? (
            <div
              style={{
                background: background ? `url(${background}) center/cover` : 'var(--surface-raised)',
                padding: '1rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
                <ReactPlayer
                  url={videoUrl}
                  controls
                  playing
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              </div>
            </div>
          ) : (
            <div style={{ padding: '2rem', border: '1px solid var(--border-muted, rgba(255,255,255,0.2))', borderRadius: '12px' }}>
              Não foi possível carregar este vídeo. Verifique se o link é válido.
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h1>{title}</h1>
            {subtitle && <h2 style={{ fontWeight: 400 }}>{subtitle}</h2>}
            {description && <p style={{ marginTop: '1rem', lineHeight: 1.6 }}>{description}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
