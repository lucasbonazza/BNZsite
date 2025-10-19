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

  // Função para esconder todos os detalhes
  function hideAllDetails() {
    document.querySelectorAll('.executor-details, .script-details, #load-result').forEach(d => {
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
      btn.replaceWith(btn.cloneNode(true)); // remove listeners duplicados
    });
    document.querySelectorAll('.btn-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.executor-details, .script-details');
        if (parent) parent.classList.add('hidden');
      });
    });
  }
  attachCloseButtons();

  // Botões copiar
  function attachCopyButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(btn => {
      btn.replaceWith(btn.cloneNode(true)); // remove listeners duplicados
    });
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        let codeBlock = btn.previousElementSibling;
        if (!codeBlock) return;
        // caso seja <pre><code>
        if (codeBlock.tagName.toLowerCase() === 'pre') {
          codeBlock = codeBlock.querySelector('code');
        }
        if (codeBlock) {
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
    return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  if (btnGenerate && input && loadOutput && loadResult) {
    btnGenerate.addEventListener('click', (ev) => {
      ev.preventDefault();
      let url = (input.value || '').trim();
      if (!url) {
        input.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 });
        input.focus();
        return;
      }

      const safe = escapeForDoubleQuotes(url);
      const snippet = `loadstring(game:HttpGet("${safe}"))()`;
      loadOutput.textContent = snippet;
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
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnGenerate.click();
      }
    });
  }
});
