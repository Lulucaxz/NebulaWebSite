import React, { useRef, useEffect } from 'react';

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;

interface VideoCardProps {
  src: string;
  backgroundImage?: string;
  width?: string;
  height?: string;
  showPlayIcon?: boolean;
  autoPlayBlurred?: boolean;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate?: () => void;
  onPlay?: () => void;
}

export function VideoCard({
  src,
  backgroundImage,
  width = '100%',
  height = '100%',
  showPlayIcon = true,
  autoPlayBlurred = false,
  isActive,
  onActivate,
  onDeactivate,
  onPlay,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isExternalLink = Boolean(src) && YOUTUBE_URL_REGEX.test(src);

  // Autoplay em blur ou não ativo
  useEffect(() => {
    if (isExternalLink) return;
    const video = videoRef.current;
    if (!video) return;

    video.loop = true;

    if (autoPlayBlurred || isActive) {
      video.muted = true;
      video.play().catch(() => { });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive, autoPlayBlurred, isExternalLink]);

  // Detectar entrada/saída de fullscreen
  useEffect(() => {
    if (isExternalLink) return;
    const handleFullscreenChange = () => {
      const video = videoRef.current;
      if (!video) return;

      const isFull = document.fullscreenElement === video;

      if (isFull) {
        onActivate();
      } else {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
        if (onDeactivate) onDeactivate();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onActivate, onDeactivate, isExternalLink]);

  const handleClick = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();

    if (isExternalLink) {
      onActivate();
      if (onPlay) onPlay();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Tira o mute e toca o vídeo antes de entrar em fullscreen
    video.muted = false;
    setTimeout(() => {
      video.muted = false;
    }, 100);
    try {
      await video.play(); // Isso precisa ser dentro do clique do usuário para funcionar com som
    } catch (err) {
      console.warn("Erro ao dar play no vídeo:", err);
    }

    if (onPlay) onPlay();

    // Entra em fullscreen depois
    if (video.requestFullscreen) {
      await video.requestFullscreen();
    }
  };


  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          void handleClick(event);
        }
      }}
    >
      {isExternalLink ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #0f172a, #1e293b)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: !isActive ? 'blur(2px)' : 'none',
          }}
        >
          {/* Mantém área clicável mesmo sem vídeo nativo */}
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="auto"
          controls={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: !isActive ? 'blur(4px)' : 'none',
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      {showPlayIcon && !isActive && !autoPlayBlurred && (
        <img
          src="/icons/arrow-video.png"
          alt="Play"
          style={{
            position: 'absolute',
            width: '75px',
            height: '75px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}