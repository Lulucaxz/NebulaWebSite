import "./banner.css";
import { useTranslation } from 'react-i18next';

function Banner() {
  const { t } = useTranslation();
  
  return (
    <div className="banner">
      <div className="bnn-filtro">
        <div className="bnn-container">
          <span className="bnn-subtitulo">{t('SEJA MUITO BEM-VINDO AO')}</span>
          <span className="bnn-titulo">{t('NEBULA')}</span>
          <span className="bnn-descricao">{t('Você já olhou para o céu noturno e se perguntou sobre os mistérios do cosmos? Na NEBULA, somos apaixonados por astronomia e astrofísica, e nossa missão é transformar essa curiosidade em conhecimento profundo.')}</span>
        </div>
      </div>
    </div>
  );
}

export default Banner;
