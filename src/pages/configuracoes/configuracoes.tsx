import { Menu } from "../../components/Menu";
import "./configuracoes.css";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 
import Footer from "../../components/footer";

axios.defaults.withCredentials = true; // Importante para sessões

const API_URL = "http://localhost:4000"; // Backend local

function Configuracoes() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [idioma, setIdioma] = useState<LanguagePreference>(() => normalizeLanguagePreference(i18n.language));
  const [tema, setTema] = useState(false);

  const handleLanguageChange = async (lang: LanguagePreference) => {
    const normalized = normalizeLanguagePreference(lang);
    setIdioma(normalized);
    i18n.changeLanguage(toI18nLanguage(normalized));

    try {
      const formData = new FormData();
      formData.append('idioma', normalized);
      
      await axios.put(`${API_URL}/auth/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error("Erro ao salvar idioma:", error);
    }
  };

  const logout = async () => {
    try{
      await axios.get(`${API_URL}/auth/logout`);
      emitAuthLogout();
      navigate('/');
    }
    catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <Menu />
      <div className="container">
      <div id="container-config">
  <h1>{t('change_language')}</h1>
  <p>{t('Escolha o idioma que melhor te ajude a navegar pelo nosso site.')}</p>
        <div className="cnfg-botoes">
          <div
            className="cnfg-btn"
            style={{ backgroundColor: idioma === "pt-br" ? "var(--primary-500)" : "var(--surface-raised)" }}
            onClick={() => {
              void handleLanguageChange('pt-br');
            }}
          >
            {t('PORTUGUÊS (BRASIL)')}
          </div>
          <div
            className="cnfg-btn"
            style={{ backgroundColor: idioma === "en-us" ? "var(--primary-500)" : "var(--surface-raised)" }}
            onClick={() => {
              void handleLanguageChange('en-us');
            }}
          >
            {t('ENGLISH (US)')}
          </div>
        </div>
  <h1>{t('Trocar Tema')}</h1>
  <p>{t('Escolha o tema que melhor te ajude a navegar pelo nosso site.')}</p>
        <div className="cnfg-botoes">
          <div
            className="cnfg-btn"
            style={{ backgroundColor: tema ? "var(--primary-500)" : "var(--surface-raised)" }}
            onClick={() => {
              setTema(true);
            }}
          >
            {t('TEMA ESCURO')}
          </div>
          <div
            className="cnfg-btn"
            style={{ backgroundColor: !tema ? "var(--primary-500)" : "var(--surface-raised)" }}
            onClick={() => {
              setTema(false);
            }}
          >
            {t('TEMA CLARO')}
          </div>
        </div>
        <h1>{t('Trocar Conta ou Sair')}</h1>
        <p>{t('Voce pode trocar o seu usuario ou sair')}</p>
        <Link to="/cadastrar" className="cnfg-btn">
          <div>{t('TROCAR USUARIO')}</div>
        </Link>
        <div className="cnfg-btn" onClick={logout}>{t('SAIR')}</div>


        <Footer />
      </div>
      </div>
    </>
  );
}

export default Configuracoes;
