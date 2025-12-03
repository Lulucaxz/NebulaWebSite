import "./carrosselAulas.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE, fetchWithCredentials } from "../../../api";

interface CarouselVideo {
  key: string;
  image: string;
  url?: string;
  fallbackTitle: string;
  alwaysUnlocked?: boolean;
}

const CAROUSEL_VIDEOS: CarouselVideo[] = [
  {
    key: "video1",
    image: "/img/videos/video1.jpg",
    url: "https://youtu.be/wvZH-IC4G_U",
    fallbackTitle: "AULA 1",
    alwaysUnlocked: true,
  },
  {
    key: "video2",
    image: "/img/videos/video2.jpg",
    url: "https://youtu.be/zYOeQNq347c",
    fallbackTitle: "AULA 2",
  },
  {
    key: "video3",
    image: "/img/videos/video3.jpg",
    url: "https://youtu.be/TYejsohIFWI",
    fallbackTitle: "AULA 3",
  },
  {
    key: "video4",
    image: "/img/videos/video4.jpg",
    url: "https://youtu.be/H2SlLWFlnCU",
    fallbackTitle: "AULA 4",
  },
  {
    key: "video5",
    image: "/img/videos/video5.jpg",
    url: "https://youtu.be/QqwPbX5HRTY",
    fallbackTitle: "AULA 5",
  },
  {
    key: "video6",
    image: "/img/videos/video6.jpg",
    url: "https://youtu.be/wvZH-IC4G_U",
    fallbackTitle: "AULA 6",
  },
  {
    key: "video7",
    image: "/img/videos/video7.jpg",
    url: "https://youtu.be/sfi5eyJqq2k",
    fallbackTitle: "AULA 7",
  },
];

const buildVideoPlayerLink = ({
  url,
  title,
  subtitle,
  background,
}: {
  url: string;
  title?: string;
  subtitle?: string;
  background?: string;
}) => {
  const params = new URLSearchParams();
  params.set("url", url);
  if (title) params.set("title", title);
  if (subtitle) params.set("subtitle", subtitle);
  if (background) params.set("background", background);
  return `/video-player?${params.toString()}`;
};

function CarrosselAulas() {
  const { t } = useTranslation();
  const [isLogged, setIsLogged] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const teacherLabel = t("home.carousel.teacher");
  const lockedLabel = t("home.carousel.locked");
  const watchLabel = t("home.carousel.watch");

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const response = await fetchWithCredentials(`${API_BASE}/auth/me`);
        if (!isMounted) return;
        setIsLogged(response.ok);
      } catch (error) {
        console.error("[CarrosselAulas] Falha ao verificar autenticação", error);
        if (!isMounted) return;
        setIsLogged(false);
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    };

    void verifyAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="sessao sessao-descentralizada">
        <h1>{t("home.carousel.title")}</h1>
        <hr />
      </div>

      <div className="container-carrossel">
        {CAROUSEL_VIDEOS.map((video) => {
          const localizedTitle = t(`home.carousel.videos.${video.key}.title`);
          const finalTitle = localizedTitle || video.fallbackTitle;
          const isLocked = !video.url || (!video.alwaysUnlocked && (checkingAuth || !isLogged));
          const videoPlayerLink = !isLocked && video.url
            ? buildVideoPlayerLink({
                url: video.url,
                title: finalTitle,
                subtitle: teacherLabel,
                background: video.image,
              })
            : "#";

          return (
            <div
              key={video.key}
              className={`carrosel-card ${isLocked ? "bloqueado" : ""}`.trim()}
            >
              <div
                style={{ backgroundImage: `url(${video.image})` }}
                className="imagem-card-carrossel"
              ></div>
              <div className="grupo-informacao">
                <h3>{localizedTitle || video.fallbackTitle}</h3>
                <h4>{teacherLabel}</h4>
              </div>
              <Link
                to={videoPlayerLink}
                onClick={(event) => {
                  if (isLocked) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }}
                aria-disabled={isLocked}
              >
                {isLocked ? lockedLabel : watchLabel}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default CarrosselAulas;
