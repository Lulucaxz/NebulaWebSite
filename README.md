# Nebula WebSite

> Plataforma educacional full-stack construída com React + Vite no front-end e Express + MySQL no back-end. O projeto entrega módulos de cursos, atividades com correções automáticas (inclusive questões dissertativas validadas pela API OpenAI Graders), gamificação de progresso, ranking, fórum, anotações e recursos sociais como seguidores/seguindo.

## Sumário

- [Principais funcionalidades](#principais-funcionalidades)
- [Stack e requisitos](#stack-e-requisitos)
- [Instalação e execução](#instalação-e-execução)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts úteis](#scripts-úteis)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Fluxo de trabalho sugerido](#fluxo-de-trabalho-sugerido)

## Principais funcionalidades

- **Módulos de cursos multilíngues** com páginas dedicadas (home, cursos, planos, perfil, fórum etc.) e i18n configurado (`src/i18n.ts`).
- **Atividades com questões objetivas e dissertativas**:
  - Objetivas são corrigidas automaticamente no cliente.
  - Dissertativas são avaliadas pelo endpoint `/api/progress/activity/dissertativas/avaliar`, que usa OpenAI Graders para retornar nota 0–1 e feedback resumido.
- **Controle de progresso** (`/api/progress`): registra atividades concluídas, atualiza módulos e pontos do usuário, além de liberar recompensas.
- **Ranking e gamificação** (`server/routes/rankRoutes.ts`): recalcula posições com base em pontos.
- **Fórum com comentários e respostas**, anexos e moderação básica (`server/routes/forumRoutes.ts`).
- **Sistema social** (`followRoutes.ts`) para seguir/acompanhar outros estudantes.
- **Anotações pessoais** e avaliações (`anotacoesRoutes.ts`, `avaliacoesRoutes.ts`).
- **Integração com Google OAuth** (opcional) além de login local.
- **Upload de mídia** via Cloudinary para fotos de perfil e banners.

## Stack e requisitos

- **Pré-requisitos**:
  - Node.js 18+ (recomendado 20 LTS)
  - npm 9+
  - MySQL 8+ (ou compatível)
  - Conta Cloudinary (uploads de mídia)
  - Chave da API OpenAI (para correção dissertativa)
  - (Opcional) credenciais Google OAuth 2.0

- **Front-end**: React 19, Vite 6, TypeScript, React Router, Styled Components, i18next.
- **Back-end**: Express 5, MySQL2, Passport (local + Google), Cloudinary SDK, OpenAI SDK.

## Instalação e execução

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/Lulucaxz/NebulaWebSite.git
   cd NebulaWebSite
   ```

2. **Instalar dependências** (front e back)
   ```bash
   npm install
   cd server && npm install
   cd ..
   ```

3. **Configurar bancos e mídia**
   - Crie um banco MySQL e execute `server/script_nebula.sql` para provisionar tabelas/dados.
   - Configure uma conta Cloudinary e copie `cloud_name`, `api_key`, `api_secret`.

4. **Criar arquivos `.env`** (veja [Variáveis de ambiente](#variáveis-de-ambiente)).

5. **Rodar em desenvolvimento (dois terminais)**
   ```bash
   # Terminal 1 - Front-end
   npm run dev

   # Terminal 2 - Back-end
   cd server
   npm run dev
   ```
   A aplicação web abre em `http://localhost:5173` e a API responde em `http://localhost:4000`.

6. **Build de produção**
   ```bash
   npm run build      # compila TS + bundle Vite
   npm run preview    # servidor estático para o bundle gerado
   ```
   O back-end pode ser compilado com `ts-node-dev` em modo build ou rodado via `node dist/index.js` após `tsc` (ajuste conforme estratégia de deploy).

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (front-end) e outro dentro de `server/`.

### Front-end (`.env`)

```env
VITE_API_URL=http://localhost:4000
```

### Back-end (`server/.env`)

```env
PORT=4000
CLIENT_URL=http://localhost:5173
SESSION_SECRET=sua-chave-ultra-secreta

# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=senha
DB_NAME=nebula

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_GRADER_MODEL=gpt-4.1-mini   # opcional

# OAuth Google (opcional, habilita login social)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

> **Importante:** o sistema de correção dissertativa retorna erro controlado caso o limite da API da OpenAI seja atingido. Ajuste o modelo ou a conta se precisar de volume maior.

## Scripts úteis

| Comando                    | Onde rodar          | Descrição |
|---------------------------|---------------------|-----------|
| `npm run dev`             | raiz                | Inicia Vite em modo HMR |
| `npm run build`           | raiz                | Compila TypeScript e gera bundle de produção |
| `npm run preview`         | raiz                | Servidor estático para testar o bundle |
| `npm run lint`            | raiz                | Executa ESLint com config TypeScript |
| `npm run i-all`           | raiz                | Instala dependências do front e do `server/` |
| `npm run dev`             | `server/`           | Sobe API Express com `ts-node-dev` |

## Estrutura de pastas

```
NebulaWebSite/
├── public/                    # assets estáticos (ícones, imagens, vídeos)
├── src/
│   ├── components/            # componentes compartilhados (menu, footer, etc.)
│   ├── pages/                 # páginas (cursos, fórum, perfil, home, etc.)
│   ├── locales/               # JSONs de tradução i18n
│   ├── api.ts                 # helper central para chamadas autenticadas
│   └── i18n.ts                # configuração i18next
├── server/
│   ├── index.ts               # bootstrap Express, sessão, Passport
│   ├── db.ts                  # pool MySQL
│   ├── routes/                # módulos REST (progress, fórum, follow, etc.)
│   ├── utils.ts               # helpers asyncHandler, etc.
│   ├── script_nebula.sql      # criação da base dados
│   └── package.json           # dependências e scripts da API
├── eslint.config.js, tsconfig*.json, vite config, etc.
└── README.md
```

## Fluxo de trabalho sugerido

1. **Configurar ambientes** (DB, Cloudinary, OpenAI, OAuth) e testar login local.
2. **Criar módulos/atividades** editando `src/pages/cursos/components/cursosDados.tsx`.
3. **Rodar atividades** para validar o fluxo completo (objetivas + dissertativas). O relatório pós-envio sempre mostra o resultado; quando a nota mínima é atingida a API registra progresso e pontos.
4. **Explorar ferramentas sociais** (seguidores, fórum, anotações) para completar a experiência do aluno.

Pronto! Agora você tem uma base completa para evoluir o Nebula WebSite, seja adicionando novos cursos, integrando novos serviços ou customizando o front-end.
