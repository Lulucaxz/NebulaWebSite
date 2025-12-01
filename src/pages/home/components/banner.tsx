import "./banner.css";
import { useTranslation } from 'react-i18next';

function Banner() {
  const { t } = useTranslation();
  
  return (
    <div className="banner">
      <div className="bnn-filtro">
        <div className="bnn-container">
          <span className="bnn-subtitulo">{t('home.banner.subtitle')}</span>
          <span className="bnn-titulo">{t('home.banner.title')}</span>
          <span className="bnn-descricao">{t('home.banner.description')}</span>
        </div>
      </div>
    </div>
  );
}

export default Banner;
