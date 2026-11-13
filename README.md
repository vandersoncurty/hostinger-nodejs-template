# Node.js + MySQL Template — Deploy na Hostinger

Esqueleto de aplicação Node.js com Express e MySQL, pronto para ser publicado na Hostinger. Inclui conexão com banco de dados, migrations automáticas na inicialização e rotas CRUD de exemplo.

## Estrutura

```
hostinger-nodejs-template/
├── server.js            # Servidor Express: API + inicialização do MySQL
├── package.json         # Dependências e scripts
├── package-lock.json    # Versões travadas (gerado por npm install)
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore           # O que não versionar nem enviar à Hostinger
├── README.md
├── public/
│   └── index.html       # Página simples (HTML estático)
└── database/
    ├── init.js          # Conexão MySQL + execução automática de migrations
    └── migrations/
        └── 001_create_contatos.sql  # Schema inicial (tabela contatos)
```

## Requisitos

- Node.js >= 20 (recomendado Node 22 LTS)
- Plano de hospedagem Hostinger com MySQL incluso

## Rodando localmente

```bash
# Instale as dependências
npm install

# Copie o exemplo de variáveis de ambiente e edite com seus dados
cp .env.example .env

# Inicie o servidor (produção)
npm start

# Ou em desenvolvimento com recarga automática
npm run dev
```

A aplicação estará disponível em `http://localhost:3000` (ou na `PORT` definida em `.env`).

## Banco de dados MySQL (Hostinger)

O template se conecta ao MySQL incluso no seu plano Hostinger. As migrations rodam automaticamente na inicialização da aplicação (`initDatabase()` em `server.js`), então você não precisa criar tabelas manualmente.

### Variáveis de ambiente (`.env`)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor Node.js | `3000` |
| `DB_HOST` | Host do MySQL (use `127.0.0.1`, não `localhost`) | `127.0.0.1` |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_NAME` | Nome do banco de dados | `u468875491_node_tpl` |
| `DB_USER` | Usuário do banco de dados | `u468875491_node_tpl` |
| `DB_PASSWORD` | Senha do usuário do banco | `sua_senha` |

> Nunca coloque senhas no código nem commit no Git. Use `.env` e defina as variáveis no painel da Hostinger.

### Migrations automáticas

Na primeira inicialização, o arquivo `database/migrations/001_create_contatos.sql` é executado automaticamente. Ele cria a tabela `contatos` se ainda não existir (`CREATE TABLE IF NOT EXISTS`), então é seguro re-executar quantas vezes quiser.

Para adicionar novas migrations, crie um novo arquivo `.sql` em `database/migrations/` (ex: `002_create_categorias.sql`) com `CREATE TABLE IF NOT EXISTS`. Eles são executados em ordem alfabética.

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Página inicial (HTML estático) |
| `GET` | `/health` | Status do servidor e conexão com o banco |
| `GET` | `/api/contatos` | Listar todos os contatos |
| `POST` | `/api/contatos` | Criar um novo contato |
| `GET` | `/api/contatos/:id` | Obter um contato por ID |
| `PUT` | `/api/contatos/:id` | Atualizar um contato |
| `DELETE` | `/api/contatos/:id` | Deletar um contato |

Exemplo de criação de contato:

```bash
curl -X POST http://localhost:3000/api/contatos \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com","telefone":"11999999999","mensagem":"Olá!"}'
```

## Deploy na Hostinger

1. Conecte o repositório GitHub na Hostinger (Node.js App Hosting → Git).
2. Na hPanel, acesse **Hosting → Node.js → Setup Node.js App**.
3. Escolha a versão do Node.js (**LTS**, recomendado Node 22), defina **`server.js`** como arquivo de inicialização e informe a porta (ex.: `3000`).
4. No painel da Hostinger, defina as variáveis de ambiente (`PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).
   - `DB_HOST` deve ser `127.0.0.1` (conexão local ao MySQL no mesmo servidor).
5. No terminal da Hostinger (ou SSH), execute:

   ```bash
   npm install
   ```

6. Crie o arquivo `.env` com as variáveis do banco de dados.
7. Inicie a aplicação no painel Node.js da Hostinger.

O Git auto-deployment está configurado: a cada `push` na branch `main`, a Hostinger reconstrói e reinicia a aplicação.

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia o servidor em produção |
| `npm run dev` | Inicia com nodemon (desenvolvimento) |
