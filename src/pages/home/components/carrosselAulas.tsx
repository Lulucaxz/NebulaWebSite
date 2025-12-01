import "./carrosselAulas.css";
import { useTranslation } from "react-i18next";

const videos = [
  { key: "video1", image: "/img/videos/video1.jpg", locked: false, link: "pages/video1.html" },
  { key: "video2", image: "/img/videos/video2.jpg", locked: true },
  { key: "video3", image: "/img/videos/video3.jpg", locked: true },
  { key: "video4", image: "/img/videos/video4.jpg", locked: true },
  { key: "video5", image: "/img/videos/video5.jpg", locked: true },
  { key: "video6", image: "/img/videos/video6.jpg", locked: true },
  { key: "video7", image: "/img/videos/video7.jpg", locked: true },
];

function CarrosselAulas() {
  const { t } = useTranslation();

  return (
    <>
      <div className="sessao sessao-descentralizada">
        <h1>{t("home.carousel.title")}</h1>
        <hr />
      </div>

      <div className="container-carrossel">
        {videos.map((video) => (
          <div
            key={video.key}
            className={`carrosel-card ${video.locked ? "bloqueado" : ""}`.trim()}
          >
            <div
              style={{ backgroundImage: `url(${video.image})` }}
              className="imagem-card-carrossel"
            ></div>
            <div className="grupo-informacao">
              <h3>{t(`home.carousel.videos.${video.key}.title`)}</h3>
              <h4>{t("home.carousel.teacher")}</h4>
            </div>
            <a href={video.link ?? "#"}>
              {video.locked ? t("home.carousel.locked") : t("home.carousel.watch")}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

export default CarrosselAulas;
