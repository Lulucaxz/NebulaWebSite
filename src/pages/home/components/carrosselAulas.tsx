import "./carrosselAulas.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE, fetchWithCredentials } from "../../../api";
import { FREE_VIDEO_ENTRIES } from "../../../data/freeVideos";

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
        {FREE_VIDEO_ENTRIES.map((video) => {
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
