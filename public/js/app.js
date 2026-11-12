/**
 * Aplicação Node.js + Hostinger — JavaScript da página inicial.
 * Sem manipuladores inline: toda a interatividade usa addEventListener.
 */

const API_HEALTH = '/health';
const BUTTON_ID = 'btn-hora';
const MSG_ID = 'msg';
const THEME_KEY = 'hostinger-template-theme';

const btnHora = document.getElementById(BUTTON_ID);
const msgEl = document.getElementById(MSG_ID);
const htmlEl = document.documentElement;

// Restaura o tema salvo (preferência do usuário persistida)
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) {
  htmlEl.setAttribute('data-theme', savedTheme);
}

// Busca a hora do servidor via endpoint /health e exibe na página
async function buscarHoraServidor() {
  if (msgEl) {
    msgEl.textContent = 'Consultando o servidor...';
    msgEl.style.setProperty('--msg-color', 'var(--color-muted)');
  }

  try {
    const response = await fetch(API_HEALTH, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Resposta do servidor: ${response.status}`);
    }

    const data = await response.json();
    const hora = new Date(data.time).toLocaleString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    if (msgEl) {
      msgEl.textContent = `Hora do servidor: ${hora}`;
      msgEl.style.setProperty('--msg-color', 'var(--color-brand)');
    }
  } catch (error) {
    console.error('Erro ao consultar o servidor:', error);
    if (msgEl) {
      msgEl.textContent = 'Não foi possível consultar o servidor. Tente novamente.';
      msgEl.style.setProperty('--msg-color', 'var(--color-muted)');
    }
  }
}

if (btnHora) {
  btnHora.addEventListener('click', buscarHoraServidor);
}

// Alterna modo claro/escuro via variável CSS no elemento raiz
function alternarTema() {
  const atual = htmlEl.getAttribute('data-theme');
  const proximo = atual === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', proximo);
  localStorage.setItem(THEME_KEY, proximo);
}

document.addEventListener('DOMContentLoaded', () => {
  const btnTema = document.getElementById('btn-tema');
  if (btnTema) {
    btnTema.addEventListener('click', alternarTema);
  }
});
