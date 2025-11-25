import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AlertProvider } from './Alert';
import NotificationListener from "./NotificationListener";

import Perfil from './pages/perfil/Perfil';
import Perfil2 from './pages/perfil/Perfil2';
import Home from './pages/home/paginaInicial';
import Page404 from './pages/404/page404';
import Anotacoes from './pages/anotacoes/Anotacoes';
import Login from './pages/logon/login';
import Configuracoes from './pages/configuracoes/configuracoes';
import Cursos from './pages/cursos/cursos';
import Modulos from './pages/cursos/modulos';
import Atividades from './pages/cursos/atividades';
import Planos from './pages/planos/planos';
import Forum from './pages/forum/forum';
import Chat from './pages/chat/Chat';
import ChatConversation from './pages/chat/ChatConversation';
import Notificacoes from './pages/notificacoes/notificacoes';

function App() {
  return (
    <AlertProvider>
    <Router>
      <NotificationListener />
      <Routes>
        <Route path="/" element={
          <Home />
        } />
        <Route path="/perfil" element={
          <Perfil />
        } />
        <Route path="/perfil2" element={
          <Perfil2 />
        } />
        <Route path="/anotacoes" element={
          <Anotacoes />
        } />
        <Route path="/cursos" element={
          <Cursos />
        } />
        <Route path="/modulos/:assinatura/:moduloId" element={
          <Modulos />
        } />
        <Route path="/modulos/:assinatura/:moduloId/atividades/:atividadeInd" element={
          <Atividades />
        } />
        <Route path="/forum" element={
          <Forum />
        } />
        <Route path="/chat" element={
          <Chat />
        } />
        <Route path="/chat/:chatId" element={
          <ChatConversation />
        } />
        <Route path="/planos" element={
          <Planos />
        } />
        <Route path="/configuracoes" element={
          <Configuracoes />
        } />
        <Route path="/notificacoes" element={
          <Notificacoes />
        } />
        <Route path="/cadastrar" element={
          <Login />
        } />
        <Route path="*" element={
          <Page404 />
        } />
      </Routes>
    </Router>
    </AlertProvider>
  );
}

export default App;
