// components/SidebarControle.tsx

import { useState, useEffect } from "react";
import "./SidebarControle.css";
import { showAlert } from "../../../Alert"; // Certifique-se que o caminho está correto
import type { Anotacao } from "../Anotacoes"; // Importe o tipo unificado
import { API_BASE, fetchWithCredentials } from '../../../api';
import { useTranslation } from "react-i18next";

type SidebarControleProps = {
  onEnviar?: (anotacaoSalva: Anotacao) => void;
  editando?: { anotacao: Anotacao, colIdx: number, idx: number } | null;
  onCancelarEdicao?: () => void;
  isVisible?: boolean;
  isMobileView?: boolean;
};

function SidebarControle({
  onEnviar,
  editando,
  onCancelarEdicao,
  isVisible = true,
  isMobileView = false,
}: SidebarControleProps) {
  const [blocoSelecionado, setBlocoSelecionado] = useState<number | null>(null);
  const [texto, setTexto] = useState<string>("");
  const [enviando, setEnviando] = useState(false);

  // Armazena os ARQUIVOS (File)
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Armazena as URLs de PREVIEW
  const [previewImagem, setPreviewImagem] = useState<string | null>(null);
  const [previewPdfNome, setPreviewPdfNome] = useState<string | null>(null);

  useEffect(() => {
    if (editando) {
      setBlocoSelecionado(editando.anotacao.coluna);
      setTexto(editando.anotacao.conteudo || "");
      setPreviewImagem(editando.anotacao.img || null);
      setPreviewPdfNome(editando.anotacao.pdfNome || null);
      
      // Limpa seleção de novos arquivos
      setImagemFile(null);
      setPdfFile(null);
    } else {
      // Limpa tudo
      setBlocoSelecionado(null);
      setTexto("");
      setImagemFile(null);
      setPdfFile(null);
      setPreviewImagem(null);
      setPreviewPdfNome(null);
    }
  }, [editando]);

  // Handler de Imagem (cria URL local)
  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImagemFile(file); // Salva o ARQUIVO
      setPreviewImagem(URL.createObjectURL(file)); // Gera URL local para preview
    }
  };

  // Handler de PDF (salva nome)
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPdfFile(file); // Salva o ARQUIVO
      setPreviewPdfNome(file.name); // Salva o NOME para preview
    }
  };

  const handleTextoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 2000) {
      setTexto(e.target.value);
    }
  };

  // Handler de Envio (usa FormData)
  const handleEnviar = async () => {
    if (enviando) return;
    
    // --- LÓGICA DE VALIDAÇÃO CORRIGIDA ---
    // A lógica é: "está tudo vazio?"
    // Se não há preview de imagem, nem de pdf, e nem texto, a anotação está vazia.
    if (!previewImagem && !previewPdfNome && texto.trim() === "") {
      showAlert(t("anotacoes.alerts.fillFields"));
      return; // Para a execução
    }
    // --- FIM DA CORREÇÃO ---

    if (!blocoSelecionado) {
      showAlert(t("anotacoes.alerts.selectColumn"));
      return; // Para a execução
    }

    setEnviando(true);

    const formData = new FormData();
    formData.append('conteudo', texto.trim());
    formData.append('coluna', String(blocoSelecionado));

    if (imagemFile) {
      formData.append('imagem', imagemFile);
    }
    if (pdfFile) {
      formData.append('pdf', pdfFile);
    }
    
    if (editando && !pdfFile) {
      formData.append('pdfNome', previewPdfNome || '');
    }

    try {
      const isEditing = !!editando;
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `${API_BASE}/api/anotacoes/${editando!.anotacao.id}` : `${API_BASE}/api/anotacoes`;

      const response = await fetchWithCredentials(endpoint, {
        method: method,
        body: formData,
      });

      // --- BLOCO DE ERRO MAIS ROBUSTO ---
      if (!response.ok) {
        let errorMessage = `Erro: ${response.status} ${response.statusText}`;
        try {
          // Tenta ler o erro como JSON (que o backend agora envia)
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || "Falha ao salvar anotação";
        } catch (jsonError) {
          // Se falhar (ex: o backend não enviou JSON), usa o status text
          console.error("A resposta de erro não era JSON:", jsonError);
        }
        throw new Error(errorMessage);
      }
      // --- FIM DA CORREÇÃO ---

      const anotacaoSalva = await response.json(); // Se response.ok, deve ser JSON

      if (onEnviar) {
        onEnviar(anotacaoSalva);
      }


      // Limpa o formulário
      setBlocoSelecionado(null);
      setTexto("");
      setImagemFile(null);
      setPdfFile(null);
      setPreviewImagem(null);
      setPreviewPdfNome(null);
      
      const inputImg = document.getElementById('input-imagem') as HTMLInputElement | null;
      if (inputImg) inputImg.value = '';
      const inputPdf = document.getElementById('input-pdf') as HTMLInputElement | null;
      if (inputPdf) inputPdf.value = '';

    } catch (err: any) {
      console.error(err);
      showAlert(err.message || "Erro ao salvar anotação!");
    } finally {
      setEnviando(false);
    }
  };
  
  return (
    <div
      id="sdbc-container"
      className={!isVisible ? "sdbc-hidden" : undefined}
      aria-hidden={isMobileView && !isVisible}
    >
      <div id="sdbc-container2">
        <div className="sdbc-partes">
          <span className="controle-titulo">{editando ? t("anotacoes.sidebar.title.edit") : t("anotacoes.sidebar.title.create")}</span>
          <span>{editando ? t("anotacoes.sidebar.subtitle.edit") : t("anotacoes.sidebar.subtitle.create")}</span>
          <div id="sdbc-blocos-anotacao">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`sdbc-bloco${blocoSelecionado === num ? " sdbc-bloco-selecionado" : ""}`}
                id={`sdbc-bloco${num}`}
                style={editando ? {
                  backgroundColor: blocoSelecionado === num ? 'var(--roxo1)' : 'var(--cinza-escuro2)',
                  cursor: blocoSelecionado === num ? 'default' : 'not-allowed',
                  opacity: blocoSelecionado === num ? 1 : 0.6
                } : {}}
                onClick={() => {
                  if (editando) return;
                  setBlocoSelecionado(blocoSelecionado === num ? null : num);
                }}
                title={editando && blocoSelecionado !== num ? t("anotacoes.sidebar.columnLocked") : ""}
              ></div>
            ))}
          </div>
        </div>

        <div className="sdbc-partes">
          <span>{t("anotacoes.sidebar.chooseImage")}</span>
          <div
            id="sdbc-imagem"
            style={previewImagem ? {
              backgroundImage: `url(${previewImagem})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            } : {}}
            onClick={() => {
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
            {!previewImagem && (
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
                <span>{t("anotacoes.sidebar.selectImage")}</span>
              </div>
            )}
          </div>
        </div>

        <div className="sdbc-partes">
          <span>{t("anotacoes.sidebar.choosePdf")}</span>
          <div
            id="sdbc-pdf"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: previewPdfNome ? 'var(--roxo1)' : 'var(--cinza-escuro2)',
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
            {!previewPdfNome ? (
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
                <span>{t("anotacoes.sidebar.selectPdf")}</span>
              </div>
            ) : (
              <span style={{ width: 'calc(100% - 20px)', color: 'var(--branco)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{previewPdfNome}</span>
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
            placeholder={t("anotacoes.sidebar.textPlaceholder")}
            maxLength={2000}
            style={{ color: 'var(--branco)' }}
          />
        </div>

        <div id="sdbc-botoes">
            <span className="sdbc-botao" id="sdbc-botao-cancelar" onClick={() => {
              if (editando && typeof onCancelarEdicao === 'function') {
                onCancelarEdicao(); // Dispara o useEffect
              } else {
                // Limpa manualmente
                setBlocoSelecionado(null);
                setTexto("");
                setImagemFile(null);
                setPdfFile(null);
                setPreviewImagem(null);
                setPreviewPdfNome(null);
              }
            }}>{editando ? t("common.cancel") : t("anotacoes.sidebar.button.clear")}</span>
            
            <span className="sdbc-botao" id="sdbc-botao-enviar" onClick={handleEnviar}
              style={{ opacity: enviando ? 0.7 : 1, cursor: enviando ? 'wait' : 'pointer' }}
            >
              {enviando
                ? t("anotacoes.sidebar.button.saving")
                : editando
                  ? t("anotacoes.sidebar.button.save")
                  : t("anotacoes.sidebar.button.send")}
            </span>
        </div>
      </div>
    </div>
  );
}

export default SidebarControle;