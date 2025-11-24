export interface AvaliacaoCard {
  id: number;
  nome: string;
  curso: string;
  estrelas: number;
  foto: string;
  texto: string;
  createdAt: string;
}

declare global {
  interface WindowEventMap {
    'nebula-avaliacao-criada': CustomEvent<AvaliacaoCard>;
  }
}

export {};