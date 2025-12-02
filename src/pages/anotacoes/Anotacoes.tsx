// Anotacoes.tsx
import { Menu } from "../../components/Menu";
import "./Anotacoes.css"
// 1. Importe useState E useEffect
import { useState, useEffect } from "react"; 

import SidebarControle from "./components/SidebarControle";
import AnotacoesColunas from "./components/AnotacoesColunas";
// import { showAlert } from "../../../Alert"; // Descomente se for usar
import { API_BASE, fetchWithCredentials } from '../../api';


// MUDE AQUI: Adicione "export"
export type Anotacao = {
  id: string; 
  usuario_id: number;
  conteudo: string; 
  img: string | null;     
  pdf: string | null;     
  pdfNome: string | null; 
  coluna: number;
  posicao?: number;
};

function Anotacoes2() {
  // 3. USE O NOVO TIPO NO ESTADO
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [editando, setEditando] = useState<{ anotacao: Anotacao, colIdx: number, idx: number } | null>(null);
  // Mude confirmDelete para salvar a anotação inteira
  const [confirmDelete, setConfirmDelete] = useState<{ anotacao: Anotacao } | null>(null);
  const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(() => localStorage.getItem('skipDeleteConfirm') === 'true');
  const [carregando, setCarregando] = useState(true); // Estado de loading
  const [isSidebarNarrow, setIsSidebarNarrow] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [sidebarAberto, setSidebarAberto] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth > 768 : true
  );

  // 4. CARREGAR DADOS DO BACKEND NA INICIALIZAÇÃO
  const carregarAnotacoes = async () => {
    try {
      setCarregando(true);
      const response = await fetchWithCredentials(`${API_BASE}/api/anotacoes`); // Rota GET da sua API (usa backend)

      if (response.status === 401) {
        // Usuário não logado, talvez redirecionar?
        console.error("Usuário não autenticado.");
        return; // Para de carregar
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const data: Anotacao[] = await response.json();
      setAnotacoes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAnotacoes();
  }, []); // O array vazio [] garante que isso rode só uma vez

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let wasNarrow = window.innerWidth <= 768;

    const atualizarLargura = () => {
      const estreito = window.innerWidth <= 768;
      setIsSidebarNarrow(estreito);
      if (!estreito) {
        setSidebarAberto(true);
      } else if (!wasNarrow && estreito) {
        setSidebarAberto(false);
      }
      wasNarrow = estreito;
    };

    atualizarLargura();
    window.addEventListener("resize", atualizarLargura);
    return () => window.removeEventListener("resize", atualizarLargura);
  }, []);

  const alternarSidebarMobile = () => {
    if (!isSidebarNarrow) {
      return;
    }
    setSidebarAberto((prev) => !prev);
  };

  // 5. FUNÇÃO ATUALIZADA (agora recebe a anotação salva do backend)
  const adicionarAnotacao = (anotacaoSalva: Anotacao) => {
    if (editando) {
      // Editando existente: substitui a anotação antiga pela nova
      setAnotacoes(prev =>
        prev.map(anot =>
          anot.id === editando.anotacao.id ? anotacaoSalva : anot
        )
      );
      setEditando(null);
    } else {
      // Nova anotação: adiciona no início
      setAnotacoes(prev => [anotacaoSalva, ...prev]);
    }
  };

  // Funções de Swap (AVISO: Não persiste no banco ainda)
  // Para salvar a ordem, você precisaria de uma lógica de API
  const handleSwapUp = async (colIdx: number, idx: number) => {
    // Find the item id
    const colunas = [[], [], []] as Anotacao[][];
    anotacoes.forEach((anot) => {
      if (anot.coluna === 1) colunas[0].push(anot);
      if (anot.coluna === 2) colunas[1].push(anot);
      if (anot.coluna === 3) colunas[2].push(anot);
    });
    if (!colunas[colIdx] || idx === 0) return;
    const anotacao = colunas[colIdx][idx];
    if (!anotacao) return;

    try {
      setCarregando(true);
      const res = await fetchWithCredentials(`${API_BASE}/api/anotacoes/${anotacao.id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: 'up' }),
      });
      if (!res.ok) throw new Error('Falha ao mover anotação');
      // reload annotations
      await carregarAnotacoes();
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleSwapDown = async (colIdx: number, idx: number) => {
    const colunas = [[], [], []] as Anotacao[][];
    anotacoes.forEach((anot) => {
      if (anot.coluna === 1) colunas[0].push(anot);
      if (anot.coluna === 2) colunas[1].push(anot);
      if (anot.coluna === 3) colunas[2].push(anot);
    });
    const coluna = colunas[colIdx];
    if (!coluna || idx === coluna.length - 1) return;
    const anotacao = coluna[idx];
    if (!anotacao) return;

    try {
      setCarregando(true);
      const res = await fetchWithCredentials(`${API_BASE}/api/anotacoes/${anotacao.id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: 'down' }),
      });
      if (!res.ok) throw new Error('Falha ao mover anotação');
      await carregarAnotacoes();
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };
  
  // 6. ATUALIZAR FUNÇÃO DE DELETAR (PARA USAR O ID)
  const handleDelete = (colIdx: number, idx: number) => {
    // Encontra a anotação correta para deletar
    const colunas = [[], [], []] as Anotacao[][];
    anotacoes.forEach((anot) => {
      if (anot.coluna === 1) colunas[0].push(anot);
      if (anot.coluna === 2) colunas[1].push(anot);
      if (anot.coluna === 3) colunas[2].push(anot);
    });
    const anotacaoParaDeletar = colunas[colIdx][idx];
    if (!anotacaoParaDeletar) return;

    if (skipDeleteConfirm) {
      executeDelete(anotacaoParaDeletar);
    } else {
      setConfirmDelete({ anotacao: anotacaoParaDeletar });
    }
  };

  // 7. FUNÇÃO EXECUTE DELETE (FALA COM A API)
  const executeDelete = async (anotacao: Anotacao) => {
    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/anotacoes/${anotacao.id}`, { // Use .id
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Falha ao deletar');
      
      // Sucesso: remove do estado local
      setAnotacoes(prev => prev.filter(anot => anot.id !== anotacao.id)); // Use .id
      setConfirmDelete(null);

    } catch (err) {
      console.error(err);
      // showAlert("Erro ao deletar anotação.");
    }
  };

  const handleEditar = (colIdx: number, idx: number) => {
    const colunas = [[], [], []] as Anotacao[][];
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
      {isSidebarNarrow && (
        <button
          type="button"
          className={`anotacoes-sidebar-toggle${sidebarAberto ? " ativo" : ""}`}
          onClick={alternarSidebarMobile}
          aria-expanded={sidebarAberto}
          aria-controls="sdbc-container"
          aria-label={sidebarAberto ? "Fechar painel de anotações" : "Abrir painel de anotações"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z"/></svg>
        </button>
      )}
      {carregando ? (
        <div className="anotacoes-loading">
          <div className="anotacoes-loading__spinner" role="status" aria-live="polite">
            <span className="anotacoes-loading__sr-only">Carregando anotações</span>
          </div>
        </div>
      ) : (
        <AnotacoesColunas
          anotacoes={anotacoes} // Passa o estado
          onSwapUp={handleSwapUp}
          onSwapDown={handleSwapDown}
          onDelete={handleDelete}
          onEditar={handleEditar}
          editando={editando}
        />
      )}
      <SidebarControle
        onEnviar={adicionarAnotacao} // Passa a função de callback
        editando={editando}
        onCancelarEdicao={handleCancelarEdicao}
        isVisible={!isSidebarNarrow || sidebarAberto}
        isMobileView={isSidebarNarrow}
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
                  const novoValor = !skipDeleteConfirm;
                  setSkipDeleteConfirm(novoValor);
                  localStorage.setItem('skipDeleteConfirm', novoValor.toString());
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
              {/* 8. ATUALIZE O ONCLICK AQUI */}
              <button className="antc-btn-deletar"
                onClick={() => executeDelete(confirmDelete.anotacao)}
              >Deletar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Anotacoes2;