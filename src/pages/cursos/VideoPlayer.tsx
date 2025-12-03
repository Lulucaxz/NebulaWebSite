import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import { Menu } from '../../components/Menu';

import { useUserAssinatura } from '../../hooks/useUserAssinatura';
import { ALWAYS_AVAILABLE_VIDEO_URLS } from '../../data/freeVideos';

const getParam = (value: string | null, fallback = '') => value?.trim() || fallback;

const LockIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M17 9H16V7C16 4.243 13.757 2 11 2C8.243 2 6 4.243 6 7V9H5C3.897 9 3 9.897 3 11V20C3 21.103 3.897 22 5 22H17C18.103 22 19 21.103 19 20V11C19 9.897 18.103 9 17 9ZM8 7C8 5.346 9.346 4 11 4C12.654 4 14 5.346 14 7V9H8V7ZM17 20H5V11H17L17.002 20H17Z"
      fill="currentColor"
    />
  </svg>
);

export default function VideoPlayer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { isLoading: authLoading, isAuthenticated } = useUserAssinatura();
  const defaultTitle = t('videoPlayer.defaultTitle');
  const backButtonLabel = t('videoPlayer.backButton');
  const loadError = t('videoPlayer.loadError');

  const videoUrl = getParam(search.get('url'));
  const title = getParam(search.get('title'), defaultTitle);
  const subtitle = getParam(search.get('subtitle'));
  const description = getParam(search.get('description'));
  const background = getParam(search.get('background'));

  const canPlay = useMemo(() => ReactPlayer.canPlay(videoUrl), [videoUrl]);
  const isPreviewVideo = Boolean(videoUrl && ALWAYS_AVAILABLE_VIDEO_URLS.has(videoUrl));
  const waitingAuth = authLoading && !isPreviewVideo;
  const requiresLogin = !authLoading && !isAuthenticated && !isPreviewVideo;

  const goBack = () => {
    navigate(-1);
  };

  if (waitingAuth) {
    return (
      <>
        <Menu />
        <div className="locked-page locked-page-loading" aria-busy="true">
          <div className="locked-page-card locked-page-card--loading">
            <div className="locked-page-icon" aria-hidden="true" />
            <p>{t('videoPlayer.loading')}</p>
          </div>
        </div>
      </>
    );
  }

  if (requiresLogin) {
    return (
      <>
        <Menu />
        <div className="locked-page" aria-live="polite">
          <div className="locked-page-card" role="alert">
            <div className="locked-page-icon">
              <LockIcon />
            </div>
            <h1>{t('videoPlayer.loginRequiredTitle')}</h1>
            <p>{t('videoPlayer.loginRequiredDescription')}</p>
            <Link to="/cadastrar" className="locked-page-cta">
              {t('videoPlayer.loginRequiredCta')}
            </Link>
          </div>
        </div>
      </>
    );
  }

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
            {backButtonLabel}
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
              {loadError}
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h1 style={{ lineHeight: "35px"}}>{title}</h1>
            {subtitle && <h2 style={{ fontWeight: 400, marginTop: '0.5rem' }}>{subtitle}</h2>}
            {description && <p style={{ marginTop: '1rem', lineHeight: 1.6 }}>{description}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
