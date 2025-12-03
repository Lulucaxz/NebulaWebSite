import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AlertProvider } from './Alert';
import NotificationListener from "./NotificationListener";
import { UnreadProvider } from "./unreadContext";
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthLogoutReset from "./AuthLogoutReset";

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
import ProfessorWorkspace from './pages/cursos/ProfessorWorkspace';
import Planos from './pages/planos/planos';
import Forum from './pages/forum/forum';
import Chat from './pages/chat/Chat';
import ChatConversation from './pages/chat/ChatConversation';
import Notificacoes from './pages/notificacoes/notificacoes';
import VideoPlayer from './pages/cursos/VideoPlayer';

function App() {
  return (
    <AlertProvider>
      <UnreadProvider>
        <Router>
          <NotificationListener />
          <AuthLogoutReset />
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
              <ProtectedRoute page="anotacoes">
                <Anotacoes />
              </ProtectedRoute>
            } />
            <Route path="/cursos" element={
              <ProtectedRoute page="cursos">
                <Cursos />
              </ProtectedRoute>
            } />
            <Route path="/professor" element={
              <ProtectedRoute page="professor">
                <ProfessorWorkspace />
              </ProtectedRoute>
            } />
            <Route path="/modulos/:assinatura/:moduloId" element={
              <ProtectedRoute page="modulos">
                <Modulos />
              </ProtectedRoute>
            } />
            <Route path="/modulos/:assinatura/:moduloId/atividades/:atividadeInd" element={
              <ProtectedRoute page="atividades">
                <Atividades />
              </ProtectedRoute>
            } />
            <Route path="/video-player" element={
              <ProtectedRoute page="modulos">
                <VideoPlayer />
              </ProtectedRoute>
            } />
            <Route path="/forum" element={
              <ProtectedRoute page="forum">
                <Forum />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute page="chat">
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/chat/:chatId" element={
              <ProtectedRoute page="chatConversation">
                <ChatConversation />
              </ProtectedRoute>
            } />
            <Route path="/planos" element={
              <Planos />
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute page="configuracoes">
                <Configuracoes />
              </ProtectedRoute>
            } />
            <Route path="/notificacoes" element={
              <ProtectedRoute page="notificacoes">
                <Notificacoes />
              </ProtectedRoute>
            } />
            <Route path="/cadastrar" element={
              <Login />
            } />
            <Route path="*" element={
              <Page404 />
            } />
          </Routes>
        </Router>
      </UnreadProvider>
    </AlertProvider>
  );
}

export default App;
