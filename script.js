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
      if (content) content.classList.add('active');

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
      if (!id) return;
      hideAllDetails();
      const detail = document.getElementById(id);
      if (detail) {
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
      if (!id) return;
      hideAllDetails();
      const detail = document.getElementById(id);
      if (detail) {
        detail.classList.remove('hidden');
        detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Botões fechar detalhes
  function attachCloseButtons() {
    const closeButtons = document.querySelectorAll('.btn-close');
    closeButtons.forEach(btn => {
      // remove listeners duplicates by cloning (simple approach)
      btn.replaceWith(btn.cloneNode(true));
    });
    // re-query after clone
    document.querySelectorAll('.btn-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.executor-details, .script-details');
        if (parent) {
          parent.classList.add('hidden');
        }
      });
    });
  }
  attachCloseButtons();

  // Botões copiar no script (também usado pelo generator)
  function attachCopyButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(btn => {
      // avoid duplicate listeners by replacing node
      btn.replaceWith(btn.cloneNode(true));
    });
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const codeBlock = btn.previousElementSibling; // O <code> antes do botão
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

  // LOADSTRING GENERATOR
  const input = document.getElementById('load-input');
  const btnGenerate = document.getElementById('btn-generate');
  const loadResult = document.getElementById('load-result');
  const loadOutput = document.getElementById('load-output');
  const btnClearLoad = document.getElementById('btn-clear-load');

  function escapeForDoubleQuotes(str) {
    // simples escape de aspas duplas e barras invertidas para inserir entre ""
    return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  if (btnGenerate && input && loadOutput && loadResult) {
    btnGenerate.addEventListener('click', (ev) => {
      ev.preventDefault();
      let url = (input.value || '').trim();
      if (!url) {
        // show inline feedback: shake input briefly
        input.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 });
        input.focus();
        return;
      }

      // If user forgot protocol, keep as-is but warn in hint — optionally prepend https:
      // Basic normalization: trim spaces
      // Escape double quotes inside the user input to avoid breaking the generated string
      const safe = escapeForDoubleQuotes(url);
      const snippet = `loadstring(game:HttpGet("${safe}"))()`;
      loadOutput.textContent = snippet;
      // show result area
      loadResult.classList.remove('hidden');

      // ensure copy button listeners are attached (in case replaced)
      attachCopyButtons();

      // scroll to result for better UX
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

  // Re-attach copy listeners for the generator copy button specifically (in case not present first run)
  attachCopyButtons();

  // Accessibility: press Enter on input triggers generate
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnGenerate.click();
      }
    });
  }

  // Small improvement: clicking outside details hides them
  document.addEventListener('click', (ev) => {
    const target = ev.target;
    if (!target.closest('.executor-details') && !target.closest('.script-details') && !target.closest('.card')) {
      // keep nothing aggressive, do nothing
    }
  });
});
