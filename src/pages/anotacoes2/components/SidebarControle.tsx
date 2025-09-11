import { useState } from "react";
import "./SidebarControle.css";

type SidebarControleProps = {
  onEnviar?: (anotacao: { imagem: string|null, pdfNome: string|null, pdfBase64?: string|null, texto: string, coluna: number }) => void;
};

function SidebarControle({ onEnviar }: SidebarControleProps) {
  const [blocoSelecionado, setBlocoSelecionado] = useState<number | null>(null);
  const [imagem, setImagem] = useState<string | null>(null);
  const [pdfNome, setPdfNome] = useState<string | null>(null);
  const [texto, setTexto] = useState<string>("");

  const [imagemNome, setImagemNome] = useState<string | null>(null);
  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImagemNome(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setImagem(base64);
        // Salva temporariamente no localStorage
        localStorage.setItem('imagemTemp', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPdfNome(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        localStorage.setItem('pdfTemp', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 2000) {
      setTexto(e.target.value);
    }
  };

  const handleEnviar = async () => {
    // Só permite enviar se pelo menos um dos campos estiver preenchido
    if (!imagemNome && !pdfNome && texto.trim() === "") {
      alert("Preencha pelo menos imagem, PDF ou texto para enviar.");
      return;
    }
    if (!blocoSelecionado) {
      alert("Selecione uma coluna para sua anotação.");
      return;
    }
    // Recupera imagem/pdf do localStorage se existir
    const imagemBase64 = imagem || localStorage.getItem('imagemTemp');
    const pdfBase64 = localStorage.getItem('pdfTemp');
    const novaAnotacao = {
      imagem: imagemBase64,
      pdfNome: pdfNome,
      pdfBase64: pdfBase64,
      texto: texto.trim(),
      coluna: blocoSelecionado
    };
    try {
      await fetch("/api/anotacoes2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novaAnotacao)
      });
    } catch (err) {
      alert("Erro ao salvar anotação!");
      return;
    }
    if (onEnviar) {
      onEnviar(novaAnotacao);
    }
  setImagem(null);
  setImagemNome(null);
  setPdfNome(null);
  setTexto("");
  setBlocoSelecionado(null);
  localStorage.removeItem('imagemTemp');
  localStorage.removeItem('pdfTemp');
  };

  return (
    <div id="sdbc-container">
      <div id="sdbc-container2">
        <div className="sdbc-partes">
          <span className="controle-titulo">Crie sua anotação aqui</span>
          <span>Escolha uma para sua anotação ser criada</span>
          <div id="sdbc-blocos-anotacao">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`sdbc-bloco${blocoSelecionado === num ? " sdbc-bloco-selecionado" : ""}`}
                id={`sdbc-bloco${num}`}
                onClick={() => setBlocoSelecionado(blocoSelecionado === num ? null : num)}
              ></div>
            ))}
          </div>
        </div>

        <div className="sdbc-partes">
          <span>Escolha uma imagem</span>
          <div
            id="sdbc-imagem"
            style={imagem ? {
              backgroundImage: `url(${imagem})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            } : {}}
            onClick={() => {
              // dispara o input file ao clicar na div
              document.getElementById('input-imagem')?.click();
            }}
          >
            <input
              id="input-imagem"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImagemChange}
            />
            {!imagem && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="var(--branco)"
                >
                  <path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm480-280v-167l-64 63-56-56 160-160 160 160-56 56-64-63v167h-80Z" />
                </svg>
                <span>Selecione sua imagem</span>
                {imagemNome && (
                  <span style={{ marginLeft: 8, color: 'var(--branco)', fontWeight: 500 }}>{imagemNome}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="sdbc-partes">
          <span>Escolha um PDF</span>
          <div
            id="sdbc-pdf"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pdfNome ? 'var(--roxo1)' : 'var(--cinza-escuro2)',
              color: 'var(--branco)'
            }}
            onClick={() => {
              document.getElementById('input-pdf')?.click();
            }}
          >
            <input
              id="input-pdf"
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={handlePdfChange}
            />
            {!pdfNome ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="var(--branco)"
                >
                  <path d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5-23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                </svg>
                <span>Selecione seu PDF</span>
              </div>
            ) : (
              <span style={{ color: 'var(--branco)', fontWeight: 500 }}>{pdfNome}</span>
            )}
          </div>
        </div>

        <div className="sdbc-partes">
          <div id="sdbc-texto-caracter">
            <span style={{
              color: texto.length >= 1990 ? 'red' : 'var(--cinza-claro2)',
              fontWeight: texto.length >= 1990 ? 700 : 400
            }}>{texto.length}/2000</span>
          </div>
          <textarea
            value={texto}
            onChange={handleTextoChange}
            rows={5}
            placeholder="Digite aqui..."
            maxLength={2000}
            style={{ color: 'var(--branco)' }}
          />
        </div>

        <div id="sdbc-botoes">
            <span className="sdbc-botao" id="sdbc-botao-cancelar" onClick={() => {
              setImagem(null);
              setPdfNome(null);
              setTexto("");
              setBlocoSelecionado(null);
            }}>Cancelar</span>
            <span className="sdbc-botao" id="sdbc-botao-enviar" onClick={handleEnviar}>Enviar</span>
        </div>
      </div>
    </div>
  );
}

export default SidebarControle;
