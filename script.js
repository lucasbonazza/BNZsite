// script.js
document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Controle de abas
  // =========================
  const tabs = document.querySelectorAll('.sidebar a');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();

      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      const content = document.getElementById(target);
      if (content) content.classList.add('active');

      hideAllDetails();
    });
  });

  // =========================
  // Mostrar/Esconder detalhes
  // =========================
  function hideAllDetails() {
    document.querySelectorAll('.executor-details, .script-details').forEach(d => {
      d.classList.add('hidden');
    });
  }

  function showDetail(id) {
    hideAllDetails();
    const detail = document.getElementById(id);
    if (detail) {
      detail.classList.remove('hidden');
      detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // =========================
  // Cards de executores
  // =========================
  document.querySelectorAll('#executores .card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) showDetail(id);
    });
  });

  // Cards de scripts
  document.querySelectorAll('#scripts .script-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) showDetail(id);
    });
  });

  // =========================
  // Botões fechar
  // =========================
  document.querySelectorAll('.btn-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.executor-details, .script-details');
      if (parent) parent.classList.add('hidden');
    });
  });

  // =========================
  // Botões copiar
  // =========================
  function attachCopyButtons() {
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const codeBlock = btn.previousElementSibling;
        if (codeBlock && codeBlock.tagName.toLowerCase() === 'code') {
          navigator.clipboard.writeText(codeBlock.innerText.trim())
            .then(() => {
              const original = btn.textContent;
              btn.textContent = 'Copiado!';
              setTimeout(() => btn.textContent = original, 2000);
            })
            .catch(() => {
              const original = btn.textContent;
              btn.textContent = 'Erro ao copiar';
              setTimeout(() => btn.textContent = original, 2000);
            });
        }
      });
    });
  }
  attachCopyButtons();

  // =========================
  // Loadstring Generator
  // =========================
  const input = document.getElementById('load-input');
  const btnGenerate = document.getElementById('btn-generate');
  const loadResult = document.getElementById('load-result');
  const loadOutput = document.getElementById('load-output');
  const btnClearLoad = document.getElementById('btn-clear-load');

  function escapeForDoubleQuotes(str) {
    return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  if (btnGenerate && input && loadOutput && loadResult) {
    btnGenerate.addEventListener('click', ev => {
      ev.preventDefault();
      const url = (input.value || '').trim();
      if (!url) {
        input.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 });
        input.focus();
        return;
      }
      const safe = escapeForDoubleQuotes(url);
      loadOutput.textContent = `loadstring(game:HttpGet("${safe}"))()`;
      loadResult.classList.remove('hidden');
      attachCopyButtons();
      loadResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (btnClearLoad && input && loadOutput && loadResult) {
    btnClearLoad.addEventListener('click', () => {
      input.value = '';
      loadOutput.textContent = '';
      loadResult.classList.add('hidden');
      input.focus();
    });
  }

  // Pressionar Enter no input gera loadstring
  if (input && btnGenerate) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnGenerate.click();
      }
    });
  }
});
