
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './i18n';
import { ThemeProvider } from './theme/ThemeProvider';
import { UserAssinaturaProvider } from './hooks/useUserAssinatura';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <UserAssinaturaProvider>
        <App />
      </UserAssinaturaProvider>
    </ThemeProvider>
  </StrictMode>,
)
