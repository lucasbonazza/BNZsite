// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Controle de abas
  const tabs = document.querySelectorAll('.sidebar a');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();

      // Remove active de todas abas e conteúdos
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      // Ativa a aba clicada e o conteúdo correspondente
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      const content = document.getElementById(target);
      if(content) content.classList.add('active');

      // Esconde todos detalhes (executor/script)
      hideAllDetails();
    });
  });

  // Mostrar detalhe executor/script ao clicar no card
  function hideAllDetails() {
    document.querySelectorAll('.executor-details, .script-details').forEach(d => {
      d.classList.add('hidden');
    });
  }

  // Executores
  const executorCards = document.querySelectorAll('#executores .card');
  executorCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if(!id) return;
      hideAllDetails();
      const detail = document.getElementById(id);
      if(detail) {
        detail.classList.remove('hidden');
        detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scripts
  const scriptCards = document.querySelectorAll('#scripts .script-card');
  scriptCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if(!id) return;
      hideAllDetails();
      const detail = document.getElementById(id);
      if(detail) {
        detail.classList.remove('hidden');
        detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Botões fechar detalhes
  const closeButtons = document.querySelectorAll('.btn-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.executor-details, .script-details');
      if(parent) {
        parent.classList.add('hidden');
      }
    });
  });

  // Botões copiar no script
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.previousElementSibling; // O <code> antes do botão
      if(codeBlock && codeBlock.tagName.toLowerCase() === 'code') {
        navigator.clipboard.writeText(codeBlock.textContent)
          .then(() => {
            btn.textContent = 'Copiado!';
            setTimeout(() => btn.textContent = 'Copiar', 2000);
          })
          .catch(() => {
            btn.textContent = 'Erro ao copiar';
            setTimeout(() => btn.textContent = 'Copiar', 2000);
          });
      }
    });
  });
});
