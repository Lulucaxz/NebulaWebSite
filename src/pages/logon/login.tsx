import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:4000";

const LoginPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState<any>(null);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const register = async () => {
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password });
      alert("Cadastro realizado com sucesso!");
      setIsActive(false); // Volta para o login após cadastro
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro no cadastro");
    }
  };

  const login = async () => {
    try {
      await axios.post(`${API_URL}/auth/login`, { email, password });
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro no login");
    }
  };

  const logout = async () => {
    await axios.get(`${API_URL}/auth/logout`);
    setUser(null);
  };

  const loginGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="login-page">
      {user ? (
        <div className="user-logged-in">
          <h1>Bem-vindo, {user.name}!</h1>
          <p>Você está logado com o email: {user.email}</p>
          <Link to="/">
                  <button>Voltar</button>
            </Link>
        </div>
      ) : (
        <div className={`login-container ${isActive ? 'active' : ''}`} id="login-container">
          {/* Formulário de Cadastro */}
          <div className="form-container sign-up">
            <form onSubmit={(e) => { e.preventDefault(); register(); }}>
              <h1>Criar conta</h1>
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Cadastrar</button>
              <button
                type="button"
                className="login-google"
                onClick={loginGoogle}
              >
                <img src="search.png" width={'25px'} alt="Google" />
                Cadastrar com Google
              </button>
            </form>
          </div>

          {/* Formulário de Login */}
          <div className="form-container sign-in">
            <form onSubmit={(e) => { e.preventDefault(); login(); }}>
              <h1>Entrar</h1>



              <span style={{ color: '#9B3BD2' }}> faça login de forma manual:</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a href="#" style={{ color: '#9B3BD2' }}>Esqueceu sua senha?</a>
              <button type="submit">Entrar</button>

              <button
                type="button"
                className="login-google"
                onClick={loginGoogle}
              >
                <img src="search.png" width={'25px'} alt="Google" />
                Entrar com Google
              </button>
            </form>
          </div>

          {/* Painel de Alternância */}
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <Link to="/">
                  <div className="voltar">Voltar</div>
                </Link>
                <h1>Bem-vindo de volta!</h1>
                <p>Entre na sua conta Nebula para ter acesso aos seus cursos!</p>
                <button className="hidden" id="login" onClick={handleLoginClick}>Entrar</button>
              </div>
              <div className="toggle-panel toggle-right">
                <Link to="/">
                  <div className="voltar">Voltar</div>
                </Link>
                <h1>Não possui uma conta?</h1>
                <p>Cadastre-se no curso Nebula!</p>
                <button className="hidden" id="register" onClick={handleRegisterClick}>Cadastrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Questrial', sans-serif;
        }

        .login-page {
          background-color: #070209;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
        }

        .user-logged-in {
          background-color: rgb(41, 41, 41);
          padding: 40px;
          
          text-align: center;
          color: white;
          max-width: 500px;
          width: 100%;
        }

        .user-logged-in h1 {
          color: #9B3BD2;
          margin-bottom: 20px;
        }

        .user-logged-in button {
          background-color: #9B3BD2;
          color: white;
          border: none;
          padding: 10px 20px;
          margin-top: 20px;
          
          cursor: pointer;
          font-size: 16px;
        }

        .login-container {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
          width: 768px;
          max-width: 100%;
          min-height: 480px;
        }

        .login-container p {
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.3px;
          margin: 20px 0;
        }

        .login-container span {
          font-size: 15px;
        }

        .login-container a {
          color: #333;
          font-size: 13px;
          text-decoration: none;
          margin: 15px 0 10px;
        }

        button {
          background-color: #9B3BD2;
          color: #fff;
          font-size: 12px;
          padding: 10px 45px;
          border: 1px solid transparent;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 10px;
          cursor: pointer;
          
        }

        .login-container button.hidden {
          background-color: transparent;
          border-color: #fff;
        }

        .login-container form {
          background-color: rgb(41, 41, 41);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          height: 100%;
        }

        .login-container input {
          background-color: #eee;
          border: none;
          margin: 8px 0;
          padding: 10px 15px;
          font-size: 13px;
          width: 100%;
          outline: none;
          
        }

        form h1 {
          color: #9B3BD2;
          font-family: 'Archivo black', sans-serif;
          text-transform: uppercase;
        }

        .login-google {
          background-color: #fff;
          font-family: "Questrial";
          font-size: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          margin-top: 30px;
          padding: 10px 20px;
          width: 100%;
          color: #9B3BD2;
        }

        .login-google img {
          padding-right: 5%;
        }

        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
          background-color: #070209;
        }

        .sign-in {
          left: 0;
          width: 50%;
          z-index: 2;
        }

        .login-container.active .sign-in {
          transform: translateX(100%);
        }

        .sign-up {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }

        .login-container.active .sign-up {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: move 0.6s;
        }

        @keyframes move {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }

        .social-icons {
          margin: 20px 0;
        }

        .social-icons button {
          border: 1px solid #ccc;
          
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin: 0 3px;
          width: 40px;
          height: 40px;
          padding: 0;
          background: white;
        }

        .toggle-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: all 0.6s ease-in-out;
          z-index: 1000;
        }

        .login-container.active .toggle-container {
          transform: translateX(-100%);
        }

        .toggle {
          background-color: #9B3BD2;
          height: 100%;
          color: #fff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }

        .login-container.active .toggle {
          transform: translateX(50%);
        }

        .toggle-panel {
          position: absolute;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 30px;
          text-align: center;
          top: 0;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }

        .toggle-left {
          transform: translateX(-200%);
        }

        .login-container.active .toggle-left {
          transform: translateX(0);
        }

        .toggle-right {
          right: 0;
          transform: translateX(0);
        }

        .login-container.active .toggle-right {
          transform: translateX(200%);
        }

        .voltar {
          color: #9B3BD2;
          position: absolute;
          top: 5%;
          left: 10%;
          background-color:#eee;
          padding: 10px 20px;
          font-size: 16px;
          font-family: 'Questrial';

        }
      `}</style>
    </div>
  );
};

export default LoginPage;