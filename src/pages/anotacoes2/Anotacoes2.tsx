import { Menu } from "../../components/Menu";
import "./Anotacoes.css"
import { useState } from "react";

import SidebarControle from "./components/SidebarControle";
import AnotacoesColunas from "./components/AnotacoesColunas";

function Anotacoes2() {
  const [anotacoes, setAnotacoes] = useState<any[]>([]);
  const [editando, setEditando] = useState<{ anotacao: any, colIdx: number, idx: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ colIdx: number, idx: number } | null>(null);
  const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(() => localStorage.getItem('skipDeleteConfirm') === 'true');

  // Função para adicionar anotação (agora inclui coluna)
  const adicionarAnotacao = (anotacao: { imagem: string|null, pdfNome: string|null, texto: string, coluna: number }) => {
    if (editando) {
      // Editando existente
      setAnotacoes(prev => {
        const colunas = [[], [], []] as any[][];
        prev.forEach((anot) => {
          if (anot.coluna === 1) colunas[0].push(anot);
          if (anot.coluna === 2) colunas[1].push(anot);
          if (anot.coluna === 3) colunas[2].push(anot);
        });
        const coluna = colunas[editando.colIdx];
        coluna[editando.idx] = { ...anotacao, coluna: editando.anotacao.coluna };
        return [...colunas[0], ...colunas[1], ...colunas[2]];
      });
      setEditando(null);
    } else {
      setAnotacoes(prev => [anotacao, ...prev]);
    }
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
  
  const handleDelete = (colIdx: number, idx: number) => {
    if (skipDeleteConfirm) {
      executeDelete(colIdx, idx);
    } else {
      setConfirmDelete({ colIdx, idx });
    }
  };

  const executeDelete = (colIdx: number, idx: number) => {
    setAnotacoes(prev => {
      const colunas = [[], [], []] as any[][];
      prev.forEach((anot) => {
        if (anot.coluna === 1) colunas[0].push(anot);
        if (anot.coluna === 2) colunas[1].push(anot);
        if (anot.coluna === 3) colunas[2].push(anot);
      });
      const coluna = colunas[colIdx];
      coluna.splice(idx, 1);
      return [...colunas[0], ...colunas[1], ...colunas[2]];
    });
    setConfirmDelete(null);
  };

  const handleEditar = (colIdx: number, idx: number) => {
    const colunas = [[], [], []] as any[][];
    anotacoes.forEach((anot) => {
      if (anot.coluna === 1) colunas[0].push(anot);
      if (anot.coluna === 2) colunas[1].push(anot);
      if (anot.coluna === 3) colunas[2].push(anot);
    });
    setEditando({ anotacao: colunas[colIdx][idx], colIdx, idx });
  };

  const handleCancelarEdicao = () => {
    setEditando(null);
  };

  return (
    <>
      <Menu />
      <AnotacoesColunas
        anotacoes={anotacoes}
        onSwapUp={handleSwapUp}
        onSwapDown={handleSwapDown}
        onDelete={handleDelete}
        onEditar={handleEditar}
        editando={editando}
      />
      <SidebarControle
        onEnviar={adicionarAnotacao}
        editando={editando}
        onCancelarEdicao={handleCancelarEdicao}
      />

      {confirmDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--cinza-escuro3)',
            padding: "25px",
            minWidth: 340,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <span style={{ fontSize: 24, color: 'var(--branco)', fontFamily: '"Questrial", sans-serif', marginBottom: "25px", textAlign: 'center' }}>
              Você tem certeza que deseja deletar está anotação?
            </span>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <button
                onClick={() => {
                  setSkipDeleteConfirm(!skipDeleteConfirm);
                  localStorage.setItem('skipDeleteConfirm', (!skipDeleteConfirm).toString());
                }}
                style={{
                  width: "20px",
                  height: "20px",
                  border: '2px solid var(--roxo1)',
                  background: skipDeleteConfirm ? 'var(--roxo1)' : 'transparent',
                  cursor: 'pointer',
                  marginRight: "10px",
                  outline: 'none',
                  borderColor: 'var(--roxo1)'
                }}
                aria-label="Não mostrar mais confirmação"
              >
                {skipDeleteConfirm && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </button>
              <span style={{ fontSize: "16px", color: 'var(--branco)', fontFamily: '"Questrial", sans-serif' }}>
                Não mostrar mais esta confirmação
              </span>
              
            </div>
            <div style={{ display: 'flex', gap: "25px", justifyContent: 'end' }}>
              <button className="antc-btn-cancelar"
                onClick={() => setConfirmDelete(null)}
              >Cancelar</button>
              <button className="antc-btn-deletar"
                onClick={() => executeDelete(confirmDelete.colIdx, confirmDelete.idx)}
              >Deletar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Anotacoes2;