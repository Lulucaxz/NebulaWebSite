import { Menu } from "../../components/Menu";
import "./Anotacoes.css"
import { useState } from "react";

import SidebarControle from "./components/SidebarControle";
import AnotacoesColunas from "./components/AnotacoesColunas";

function Anotacoes2() {
  const [anotacoes, setAnotacoes] = useState<any[]>([]);

  // Função para adicionar anotação (agora inclui coluna)
  const adicionarAnotacao = (anotacao: { imagem: string|null, pdfNome: string|null, texto: string, coluna: number }) => {
    setAnotacoes(prev => [anotacao, ...prev]);
  };

  // Função para trocar anotação de posição na coluna (cima)
  const handleSwapUp = (colIdx: number, idx: number) => {
    setAnotacoes(prev => {
      const colunas = [[], [], []] as any[][];
      prev.forEach((anot) => {
        if (anot.coluna === 1) colunas[0].push(anot);
        if (anot.coluna === 2) colunas[1].push(anot);
        if (anot.coluna === 3) colunas[2].push(anot);
      });
      if (idx === 0) return prev;
      const coluna = colunas[colIdx];
      [coluna[idx - 1], coluna[idx]] = [coluna[idx], coluna[idx - 1]];
      return [...colunas[0], ...colunas[1], ...colunas[2]];
    });
  };

  // Função para trocar anotação de posição na coluna (baixo)
  const handleSwapDown = (colIdx: number, idx: number) => {
    setAnotacoes(prev => {
      const colunas = [[], [], []] as any[][];
      prev.forEach((anot) => {
        if (anot.coluna === 1) colunas[0].push(anot);
        if (anot.coluna === 2) colunas[1].push(anot);
        if (anot.coluna === 3) colunas[2].push(anot);
      });
      const coluna = colunas[colIdx];
      if (idx === coluna.length - 1) return prev;
      [coluna[idx], coluna[idx + 1]] = [coluna[idx + 1], coluna[idx]];
      return [...colunas[0], ...colunas[1], ...colunas[2]];
    });
  };

  return (
    <>
      <Menu />
  <AnotacoesColunas anotacoes={anotacoes} onSwapUp={handleSwapUp} onSwapDown={handleSwapDown}/>
      <SidebarControle onEnviar={adicionarAnotacao}/>
    </>
  );
}

export default Anotacoes2;