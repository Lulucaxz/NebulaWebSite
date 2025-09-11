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

  return (
    <>
      <Menu />
      <AnotacoesColunas anotacoes={anotacoes} />
      <SidebarControle onEnviar={adicionarAnotacao}/>
    </>
  );
}

export default Anotacoes2;