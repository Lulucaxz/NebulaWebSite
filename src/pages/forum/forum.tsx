import { useState } from "react";
import { Comentario } from "./components/Comentario";
import { Menu } from "../../components/Menu";
import Footer from "../../components/footer";
import "./Forum.css";

function Forum() {
  const [pesquisa, setPesquisa] = useState("");
  const [tagSelecionada, setTagSelecionada] = useState("");
  const [tagsAbertas, setTagsAbertas] = useState(false);

  const tags = ["JavaScript", "React", "CSS", "HTML", "TypeScript", "Node.js"];

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
              <Comentario />
            </div>
          </div>

          {/* Sessão da Direita - Criar Comentários */}
          <div className="forum-sessao-direita">
            <div className="forum-criar-comentario-conteudo">
              <div className="forum-criar-comentario-styck">
                <h3>Criar Nova Publicação</h3>
                <input 
                  type="text" 
                  placeholder="Título da publicação..."
                  className="forum-input-titulo"
                />
                <textarea 
                  placeholder="Escreva sua publicação aqui..."
                  maxLength={2000}
                  className="forum-textarea-conteudo"
                />
                <div className="forum-contador-caracteres">0/2000</div>
                <button className="forum-botao-publicar">
                  Publicar
                </button>
              </div>
            </div>
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