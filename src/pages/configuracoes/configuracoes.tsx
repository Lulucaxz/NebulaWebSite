import { Menu } from "../../components/Menu";
import "./configuracoes.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 
import Footer from "../../components/footer";

axios.defaults.withCredentials = true; // Importante para sessões

const API_URL = "http://localhost:4000"; // Backend local


interface User {
  idsite: string;
  id: string;
  name: string;
  email: string;
  photo: string;
  provider: string;
  prf_user: string;
  bio: string;
}

function Configuracoes() {
  const navigate = useNavigate();

  const [idioma, setIdioma] = useState(false);
  const [tema, setTema] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const logout = async () => {
    try{
      await axios.get(`${API_URL}/auth/logout`);
      setUser(null);
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
        <h1>Trocar Idioma</h1>
        <p>Escolha o idioma que melhor te ajude a navegar pelo nosso site.</p>
        <div className="cnfg-botoes">
          <div
            className="cnfg-btn"
            style={{ backgroundColor: idioma ? "#9A30EB" : "#282828" }}
            onClick={() => {
              setIdioma(true);
            }}
          >
            PORTUGUES (BRASIL)
          </div>
          <div
            className="cnfg-btn"
            style={{ backgroundColor: !idioma ? "#9A30EB" : "#282828" }}
            onClick={() => {
              setIdioma(false);
            }}
          >
            ENGLISH (US)
          </div>
        </div>
        <h1>Trocar Tema</h1>
        <p>Escolha o tema que melhor te ajude a navegar pelo nosso site.</p>
        <div className="cnfg-botoes">
          <div
            className="cnfg-btn"
            style={{ backgroundColor: tema ? "#9A30EB" : "#282828" }}
            onClick={() => {
              setTema(true);
            }}
          >
            TEMA ESCURO
          </div>
          <div
            className="cnfg-btn"
            style={{ backgroundColor: !tema ? "#9A30EB" : "#282828" }}
            onClick={() => {
              setTema(false);
            }}
          >
            TEMA CLARO
          </div>
        </div>
        <h1>Trocar Conta ou Sair</h1>
        <p>Voce pode trocar o seu usuario ou sair</p>
        <Link to="/cadastrar" className="cnfg-btn">
          <div>TROCAR USUARIO</div>
        </Link>
        <div className="cnfg-btn" onClick={logout}>SAIR</div>


        <Footer />
      </div>
      </div>
    </>
  );
}

export default Configuracoes;
