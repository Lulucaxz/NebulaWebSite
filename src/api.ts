// Small API helper: central base URL for backend requests
export const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

export const fetchWithCredentials = (input: RequestInfo, init?: RequestInit) => {
  const merged: RequestInit = {
    credentials: 'include',
    ...init,
  };
  return fetch(input, merged);
}
