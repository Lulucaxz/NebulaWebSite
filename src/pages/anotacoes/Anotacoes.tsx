import Footer from "../../components/footer";
import { Menu } from "../../components/Menu";
import "./Anotacoes.css"
import BotaoAdicionar from "./components/botaoAdicionar";
import { useState } from "react";

function Anotacoes() {
  const [ativoIndex, setAtivoIndex] = useState<number | null>(null);

  return (
    <>
      <Menu />
      <div className="container">
        <div className="ant-container" style={{ minHeight: "100vh" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="ant-container-part part">
              <BotaoAdicionar
                index={i}
                ativo={ativoIndex === i}
                setAtivoIndex={setAtivoIndex}
              />
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Anotacoes;