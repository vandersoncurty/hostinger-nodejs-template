# Node.js Template — Deploy na Hostinger

Esqueleto de aplicação Node.js com Express, contendo uma página com folha de estilo e JavaScript, pronta para ser publicada na Hostinger.

## Estrutura

```
hostinger-nodejs-template/
├── server.js            # Servidor Express (arquivo de inicialização)
├── package.json         # Dependências e scripts
├── package-lock.json    # Versões travadas das dependências (gerado por npm install)
├── .env.example         # Exemplo de variáveis de ambiente
├── public/
│   ├── index.html       # Página principal (HTML semântico)
│   ├── css/
│   │   └── style.css    # Folha de estilo
│   └── js/
│       └── app.js       # JavaScript da página
└── README.md
```

## Requisitos

- Node.js >= 20 (recomendado Node 22+)

## Rodando localmente

```bash
# Instale as dependências (versões mais recentes compatíveis)
npm install

# Copie o exemplo de variáveis de ambiente
cp .env.example .env

# Inicie o servidor (produção)
npm start

# Ou em desenvolvimento com recarga automática
npm run dev
```

A aplicação estará disponível em `http://localhost:3000` (ou na `PORT` definida em `.env`).

## Deploy na Hostinger

1. Envie os arquivos do projeto para sua conta na Hostinger via FTP ou Gerenciador de Arquivos da hPanel. Não é necessário enviar a pasta `node_modules`.
2. Na hPanel, acesse **Hosting → Node.js → Setup Node.js App**.
3. Escolha a versão do Node.js, defina **`server.js`** como arquivo de inicialização e informe a porta (mesma do `.env`, por exemplo `3000`).
4. No terminal da Hostinger (ou via SSH), na raiz do projeto, execute:

   ```bash
   npm install
   ```

5. Crie o arquivo `.env` com a porta:

   ```
   PORT=3000
   ```

6. Inicie a aplicação no painel Node.js da Hostinger.

Acesse `http://seu-dominio.com/` para ver a página em execução.

## Scripts

| Script         | Descrição                  |
| -------------- | -------------------------- |
| `npm start`    | Inicia o servidor em produção |
| `npm run dev`  | Inicia com nodemon (desenvolvimento) |

## Endpoints

- `GET /` — Página inicial com CSS e JS
- `GET /health` — Status do servidor (usado pelo JavaScript da página)
