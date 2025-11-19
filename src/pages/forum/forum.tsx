import { useState } from "react";
import { Comentario } from "./components/Comentario";
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import "./Forum.css";

function Forum() {
  const [pesquisa, setPesquisa] = useState("");
  const [tagSelecionada, setTagSelecionada] = useState("");
  const [tagsAbertas, setTagsAbertas] = useState(false);
  const [visualizandoRespostas, setVisualizandoRespostas] = useState(false);
  const [respondendoA, setRespondendoA] = useState<{tipo: 'comentario' | 'resposta', id: number, nome: string} | null>(null);
  const [tituloPublicacao, setTituloPublicacao] = useState("");
  const [conteudoPublicacao, setConteudoPublicacao] = useState("");

  const tags = ["JavaScript", "React", "CSS", "HTML", "TypeScript", "Node.js"];

  const renderizarAreaCriarComentario = () => {
    // Estado 1: Criando nova publicação (quando não está vendo respostas)
    if (!visualizandoRespostas && !respondendoA) {
      return (
        <div className="forum-criar-comentario-conteudo">
          <div className="forum-criar-comentario-styck">
            <h3>Crie sua postagem aqui</h3>
            
            {/* Tags de escolha */}
            <div className="forum-escolha-tags">
              <p>Escolha as etiquetas para sua postagem (obrigatório)</p>
              <div className="forum-tags-opcoes">
                {["Dúvida", "Órbita", "Galáxia", "Universo"].map(tag => (
                  <button key={tag} className="forum-tag-opcao">{tag}</button>
                ))}
              </div>
              <div className="forum-tags-opcoes">
                {["Conselho", "Problema", "Convite", "Material"].map(tag => (
                  <button key={tag} className="forum-tag-opcao">{tag}</button>
                ))}
              </div>
              <div className="forum-tags-opcoes">
                {["Debate", "Observação"].map(tag => (
                  <button key={tag} className="forum-tag-opcao">{tag}</button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div className="forum-titulo-container">
              <p>Coloque um título (obrigatório)</p>
              <input 
                type="text" 
                placeholder="Escreva aqui..."
                value={tituloPublicacao}
                onChange={(e) => setTituloPublicacao(e.target.value)}
                className="forum-input-titulo"
                maxLength={100}
              />
              <div className="forum-contador">0/100</div>
            </div>

            {/* Upload de imagem */}
            <div className="forum-imagem-container">
              <p>Escolha uma imagem</p>
              <div className="forum-upload-area">
                <img src="/icons/upload.svg" alt="Upload" />
                <span>Selecione sua imagem</span>
              </div>
            </div>

            {/* Texto */}
            <div className="forum-texto-container">
              <p>Coloque o seu texto</p>
              <textarea 
                placeholder="Escreva aqui..."
                value={conteudoPublicacao}
                onChange={(e) => setConteudoPublicacao(e.target.value)}
                maxLength={1000}
                className="forum-textarea-conteudo"
              />
              <div className="forum-contador">0/1000</div>
            </div>

            {/* Botões */}
            <div className="forum-botoes">
              <button className="forum-botao-cancelar">Cancelar</button>
              <button className="forum-botao-enviar">Enviar</button>
            </div>
          </div>
        </div>
      );
    }

    // Estado 2: Vendo respostas mas não respondendo (área preta com mensagem)
    if (visualizandoRespostas && !respondendoA) {
      return (
        <div className="forum-criar-comentario-conteudo forum-estado-selecionar">
          <div className="forum-mensagem-selecionar">
            <h3>Selecione um poste para responder</h3>
            <div className="forum-botoes">
              <button 
                className="forum-botao-cancelar"
                onClick={() => setVisualizandoRespostas(false)}
              >
                Cancelar
              </button>
              <button className="forum-botao-enviar" disabled>Enviar</button>
            </div>
          </div>
        </div>
      );
    }

    // Estado 3: Respondendo a um comentário/resposta
    if (visualizandoRespostas && respondendoA) {
      return (
        <div className="forum-criar-comentario-conteudo">
          <div className="forum-criar-comentario-styck">
            <h3>Respondendo {respondendoA.nome}</h3>
            
            {/* Upload de imagem */}
            <div className="forum-imagem-container">
              <p>Escolha uma imagem</p>
              <div className="forum-upload-area">
                <img src="/icons/upload.svg" alt="Upload" />
                <span>Selecione sua imagem</span>
              </div>
            </div>

            {/* Texto */}
            <div className="forum-texto-container">
              <p>Coloque o seu texto</p>
              <textarea 
                placeholder="Escreva aqui..."
                value={conteudoPublicacao}
                onChange={(e) => setConteudoPublicacao(e.target.value)}
                maxLength={1000}
                className="forum-textarea-conteudo"
              />
              <div className="forum-contador">0/1000</div>
            </div>

            {/* Botões */}
            <div className="forum-botoes">
              <button 
                className="forum-botao-cancelar"
                onClick={() => {
                  setRespondendoA(null);
                  setConteudoPublicacao("");
                }}
              >
                Cancelar
              </button>
              <button className="forum-botao-enviar">Enviar</button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Menu />
      <div className="container-forum">
        <div className="forum-conteudo-principal">
          {/* Sessão da Esquerda - Pesquisa e Comentários */}
          <div className="forum-sessao-esquerda">
            {/* Barra de Pesquisa Fixa */}
            <div className="forum-pesquisa-container">
              <div className="forum-pesquisa">
                <input
                  type="text"
                  placeholder="Pesquisar no fórum..."
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                />
                <button className="forum-botao-pesquisa">
                  <img src="/lupa.svg" alt="Pesquisar" />
                </button>
              </div>
              
              <div className="forum-tags-container">
                <button 
                  className="forum-tags-toggle"
                  onClick={() => setTagsAbertas(!tagsAbertas)}
                >
                  Tags {tagsAbertas ? "▲" : "▼"}
                </button>
                
                <div className={`forum-tags ${tagsAbertas ? "forum-tags-aberto" : ""}`}>
                  {tags.map(tag => (
                    <button
                      key={tag}
                      className={`forum-tag ${tagSelecionada === tag ? "forum-tag-selecionada" : ""}`}
                      onClick={() => setTagSelecionada(tag === tagSelecionada ? "" : tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Área de Comentários */}
            <div className="forum-comentarios-container">
              <Comentario 
                onVisualizarRespostas={setVisualizandoRespostas}
                onResponderA={setRespondendoA}
              />
            </div>
          </div>

          {/* Sessão da Direita - Criar Comentários */}
          <div className="forum-sessao-direita">
            {renderizarAreaCriarComentario()}
          </div>
        </div>

        {/* Sessão de Baixo - Footer */}
        <div className="forum-sessao-baixo">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Forum;