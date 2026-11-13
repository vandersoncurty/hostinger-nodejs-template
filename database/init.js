import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

/**
 * Inicializa a conexão com o MySQL e executa as migrations automáticas.
 * Cada arquivo .sql em database/migrations/ é executado em ordem alfabética.
 * Usa CREATE TABLE IF NOT EXISTS para ser idempotente (safe para re-executar).
 */

let pool = null;

export async function initDatabase() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'node_tpl',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'node_tpl',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Testa a conexão
  const conn = await pool.getConnection();
  console.log('Conectado ao MySQL com sucesso');

  // Executa migrations automáticas
  const migrationsDir = path.join(process.cwd(), 'database', 'migrations');
  if (fs.existsSync(migrationsDir)) {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      // Separa statements por ';' e executa cada um não-vazio
      const statements = sql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const stmt of statements) {
        await conn.query(stmt);
      }
      console.log(`Migration executada: ${file}`);
    }
  }

  conn.release();
  return pool;
}

export async function getPool() {
  if (!pool) {
    throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
  }
  return pool;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
