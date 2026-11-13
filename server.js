import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { initDatabase, getPool, closeDatabase } from './database/init.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Inicializa o banco de dados (executa migrations automaticamente)
initDatabase()
  .then(() => {
    console.log('Banco de dados inicializado com sucesso');

    // ==================== ROTAS DA API (Contatos) ====================

    // Listar todos os contatos
    app.get('/api/contatos', async (_req, res) => {
      try {
        const pool = await getPool();
        const [rows] = await pool.query(
          'SELECT id, nome, email, telefone, mensagem, created_at FROM contatos ORDER BY created_at DESC'
        );
        res.json(rows);
      } catch (error) {
        console.error('Erro ao listar contatos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    // Obter um contato por ID
    app.get('/api/contatos/:id', async (req, res) => {
      try {
        const pool = await getPool();
        const [rows] = await pool.query(
          'SELECT id, nome, email, telefone, mensagem, created_at FROM contatos WHERE id = ?',
          [req.params.id]
        );
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Contato não encontrado' });
        }
        res.json(rows[0]);
      } catch (error) {
        console.error('Erro ao obter contato:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    // Criar um novo contato
    app.post('/api/contatos', async (req, res) => {
      try {
        const { nome, email, telefone, mensagem } = req.body;

        if (!nome || !email) {
          return res.status(400).json({ error: 'Nome e email são obrigatórios' });
        }

        const pool = await getPool();
        const [result] = await pool.query(
          'INSERT INTO contatos (nome, email, telefone, mensagem) VALUES (?, ?, ?, ?)',
          [nome, email, telefone || null, mensagem || null]
        );

        const [rows] = await pool.query(
          'SELECT id, nome, email, telefone, mensagem, created_at FROM contatos WHERE id = ?',
          [result.insertId]
        );

        res.status(201).json(rows[0]);
      } catch (error) {
        console.error('Erro ao criar contato:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    // Atualizar um contato existente
    app.put('/api/contatos/:id', async (req, res) => {
      try {
        const { nome, email, telefone, mensagem } = req.body;

        const pool = await getPool();
        const [existing] = await pool.query(
          'SELECT id FROM contatos WHERE id = ?',
          [req.params.id]
        );
        if (existing.length === 0) {
          return res.status(404).json({ error: 'Contato não encontrado' });
        }

        await pool.query(
          'UPDATE contatos SET nome = ?, email = ?, telefone = ?, mensagem = ? WHERE id = ?',
          [nome, email, telefone || null, mensagem || null, req.params.id]
        );

        const [rows] = await pool.query(
          'SELECT id, nome, email, telefone, mensagem, created_at FROM contatos WHERE id = ?',
          [req.params.id]
        );

        res.json(rows[0]);
      } catch (error) {
        console.error('Erro ao atualizar contato:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    // Deletar um contato
    app.delete('/api/contatos/:id', async (req, res) => {
      try {
        const pool = await getPool();
        const [existing] = await pool.query(
          'SELECT id FROM contatos WHERE id = ?',
          [req.params.id]
        );
        if (existing.length === 0) {
          return res.status(404).json({ error: 'Contato não encontrado' });
        }

        await pool.query('DELETE FROM contatos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Contato deletado com sucesso' });
      } catch (error) {
        console.error('Erro ao deletar contato:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    // ==================== ROTAS ESTÁTICAS ====================

    app.get('/', (_req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.get('/health', async (_req, res) => {
      try {
        const pool = await getPool();
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected', time: new Date().toISOString() });
      } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected', time: new Date().toISOString() });
      }
    });

    // Inicia o servidor apenas depois que o banco está pronto
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Falha ao inicializar o banco de dados:', error);
    process.exit(1);
  });

// Tratamento graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Encerrando servidor...');
  await closeDatabase ? closeDatabase() : null;
  process.exit(0);
});
