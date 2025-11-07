import { Menu } from "../../components/Menu"
import Footer from "../../components/footer"
import { TemplateModulos } from './components/templateModulos'
import './cursos.css'
import { useTranslation } from 'react-i18next';

function Cursos() {
  const { t } = useTranslation();
  
  return (
    <>
      <Menu />
      <div className="container">
        <div className="cursos-espacamento">
          <div className="sessao">
            <h1>{t('CURSO UNIVERSO')}</h1>
            <hr />
          </div>
          <div className="cursos-alinhar-tamplates">
            <TemplateModulos assinatura='universo' />
          </div>

          <div className="sessao">
            <h1>{t('CURSO GALÁXIA')}</h1>
            <hr />
          </div>
          <div className="cursos-alinhar-tamplates">
            <TemplateModulos assinatura='galaxia' />
          </div>

          <div className="sessao">
            <h1>{t('CURSO ÓRBITA')}</h1>
            <hr />
          </div>
          <div className="cursos-alinhar-tamplates">
            <TemplateModulos assinatura='orbita' />
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
}

export default Cursos;
