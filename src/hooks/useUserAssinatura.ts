import { createContext, createElement, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { API_BASE, fetchWithCredentials } from '../api';
import { AssinaturaSlug, normalizeAssinaturaValue } from '../utils/assinaturaAccess';

interface UseUserAssinaturaResult {
  planSlug: AssinaturaSlug | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const UserAssinaturaContext = createContext<UseUserAssinaturaResult | undefined>(undefined);

const useProvideUserAssinatura = (): UseUserAssinaturaResult => {
  const [planSlug, setPlanSlug] = useState<AssinaturaSlug | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadPlan = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchWithCredentials(`${API_BASE}/auth/me`);

      if (res.status === 401) {
        if (!isMountedRef.current) {
          return;
        }
        setPlanSlug(null);
        return;
      }

      if (!res.ok) {
        throw new Error('Falha ao buscar assinatura.');
      }

      const data = await res.json();
      const normalized = normalizeAssinaturaValue(
        (data?.curso as string | undefined) ?? (data?.assinatura as string | undefined)
      );

      if (!isMountedRef.current) {
        return;
      }

      setPlanSlug(normalized);
    } catch (err) {
      console.error('[Cursos] Erro ao carregar assinatura do usuário', err);
      if (!isMountedRef.current) {
        return;
      }
      setPlanSlug(null);
      setError('Não foi possível carregar sua assinatura no momento.');
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void loadPlan();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadPlan]);

  const refresh = useCallback(() => {
    void loadPlan();
  }, [loadPlan]);
  return { planSlug, isLoading, error, refresh };
};

export const UserAssinaturaProvider = ({ children }: { children: ReactNode }) => {
  const value = useProvideUserAssinatura();
  return createElement(UserAssinaturaContext.Provider, { value }, children);
};

export const useUserAssinatura = (): UseUserAssinaturaResult => {
  const context = useContext(UserAssinaturaContext);
  if (!context) {
    throw new Error('useUserAssinatura must be used within a UserAssinaturaProvider');
  }
  return context;
};
