import { Menu } from "../../components/Menu";
import "./Anotacoes.css"
import { useState } from "react";

import SidebarControle from "./components/SidebarControle";

function Anotacoes2() {
  const [anotacoes, setAnotacoes] = useState<any[]>([]);

  // Função para adicionar anotação
  const adicionarAnotacao = (anotacao: { imagem: string|null, pdfNome: string|null, texto: string }) => {
    setAnotacoes(prev => [anotacao, ...prev]);
  };

  return (
    <>
      <Menu />
      <SidebarControle onEnviar={adicionarAnotacao}/>

      <div className="colunadeanotacoes" style={{ width: "600px", marginLeft: "500px", marginTop: "40px", display: "flex", flexDirection: "column", gap: "30px" }}>
        {anotacoes.map((anot, idx) => (
          <div key={idx} style={{ background: "var(--cinza-escuro2)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {anot.imagem && (
              <img src={anot.imagem} alt="Imagem anotação" style={{ width: "100%", objectFit: "cover"}} />
            )}
            {anot.pdfNome && (
              <div style={{ color: "var(--roxo1)", fontWeight: 600, fontSize: 18, margin: "8px 0" }}>
                <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--roxo1)" style={{ marginRight: 8 }}><path d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5-23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" /></svg>
                </span>
                {anot.pdfNome}
              </div>
            )}
            {anot.texto && (
              <div style={{ color: "var(--branco)", fontSize: 16, whiteSpace: "pre-line" }}>{anot.texto}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Anotacoes2;