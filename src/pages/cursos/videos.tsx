import React, { useRef, useEffect } from 'react';

interface VideoCardProps {
  src: string;
  backgroundImage?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  showPlayIcon?: boolean;
  autoPlayBlurred?: boolean;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate?: () => void;
}

export function VideoCard({
  src,
  backgroundImage,
  width = '100%',
  height = '100%',
  borderRadius = '12px',
  showPlayIcon = true,
  autoPlayBlurred = false,
  isActive,
  onActivate,
  onDeactivate,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay em blur ou não ativo
  useEffect(() => {
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
  }, [isActive, autoPlayBlurred]);

  // Detectar entrada/saída de fullscreen
  useEffect(() => {
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
  }, [onActivate, onDeactivate]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

    // Entra em fullscreen depois
    if (video.requestFullscreen) {
      await video.requestFullscreen();
    }
  };


  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="auto"
        onClick={handleClick}
        controls={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: !isActive ? 'blur(4px)' : 'none',
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer',
        }}
      />
      {showPlayIcon && !isActive && !autoPlayBlurred && (
        <img
          src="/arrow-video.png"
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