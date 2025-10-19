/* script.js
   Javascript para:
   - navegação de abas (sidebar)
   - sub-tabs (scripts / executores)
   - abrir/fechar details de cards
   - copiar códigos (btn-copy)
   - gerar / limpar loadstring (btn-generate / btn-clear)
   - efeito trail ao clicar (btn-trail)
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- Abas principais (sidebar) ---
  const sidebarLinks = document.querySelectorAll('.sidebar a[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');

  function showTab(tabId) {
    tabContents.forEach(tc => {
      if (tc.id === tabId) {
        tc.classList.add('active');
        tc.style.display = ''; // allow css to handle visibility
      } else {
        tc.classList.remove('active');
        tc.style.display = ''; // keep it flexible for CSS (display controlled by .active)
      }
    });
    sidebarLinks.forEach(a => a.classList.toggle('active', a.dataset.tab === tabId));
    // update hash without scrolling
    try { history.replaceState(null, '', '#' + tabId); } catch (e) {}
  }

  sidebarLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const t = a.dataset.tab;
      if (!t) return;
      showTab(t);
    });
  });

  // Show initial tab based on hash (if any)
  const hash = location.hash.replace('#', '');
  if (hash) {
    const target = document.getElementById(hash);
    if (target) showTab(hash);
  }

  // --- Sub-tabs ---
  document.querySelectorAll('.sub-tabs').forEach(group => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.sub-tab');
      if (!btn) return;
      const sub = btn.dataset.sub;
      if (!sub) return;
      // deactivate siblings
      group.querySelectorAll('.sub-tab').forEach(s => s.classList.toggle('active', s === btn));
      // hide/show sub tab contents inside the same section
      const section = group.closest('section');
      if (!section) return;
      section.querySelectorAll('.sub-tab-content').forEach(c => c.classList.toggle('active', c.id === sub));
    });
  });

  // --- Cards (abrir detalhes) ---
  function hideAllDetails() {
    document.querySelectorAll('.executor-details, .script-details').forEach(d => d.classList.add('hidden'));
  }

  // Use getElementById because some IDs contain spaces (user's HTML)
  document.querySelectorAll('.card, .script-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (!id) return;
      const detail = document.getElementById(id);
      if (!detail) return;
      hideAllDetails();
      detail.classList.remove('hidden');
      // smooth scroll to detail
      setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
    });
  });

  // Close buttons
  document.addEventListener('click', (e) => {
    const close = e.target.closest('.btn-close');
    if (!close) return;
    const parent = close.closest('.executor-details, .script-details');
    if (parent) parent.classList.add('hidden');
  });

  // --- Copy buttons in script details ---
  function copyText(text) {
    if (!text) return Promise.reject('no-text');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // fallback
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        document.body.removeChild(ta);
        reject(err);
      }
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;
    // if this is the loadstring copy button
    if (btn.id === 'btn-copy-load') {
      const out = document.getElementById('load-output');
      if (!out) return;
      copyText(out.textContent || out.innerText || '').then(() => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1400);
      }).catch(() => {
        alert('Não foi possível copiar para a área de transferência.');
      });
      return;
    }

    // otherwise, script-details copy buttons
    const detail = btn.closest('.script-details, .executor-details');
    if (!detail) return;
    // find code inside (pre > code or code)
    const codeEl = detail.querySelector('pre code, code');
    const codeText = codeEl ? codeEl.textContent.trim() : '';
    if (!codeText) return;
    copyText(codeText).then(() => {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1400);
    }).catch(() => {
      alert('Não foi possível copiar o texto.');
    });
  });

  // --- Loadstring generate & clear + trail effect ---
  const btnGenerate = document.getElementById('btn-generate');
  const btnClear = document.getElementById('btn-clear-load');
  const input = document.getElementById('load-input');
  const loadResult = document.getElementById('load-result');
  const loadOutput = document.getElementById('load-output');

  function createTrail(x, y, parent) {
    if (!parent) parent = document.body;
    const rect = parent.getBoundingClientRect();
    const t = document.createElement('span');
    t.className = 'btn-trail';
    // position relative to parent
    t.style.left = (x - rect.left) + 'px';
    t.style.top = (y - rect.top) + 'px';
    parent.appendChild(t);
    // remove after animation
    setTimeout(() => {
      if (t && t.parentNode) t.parentNode.removeChild(t);
    }, 700);
  }

  if (btnGenerate) {
    btnGenerate.addEventListener('click', (e) => {
      const url = (input.value || '').trim();
      // short validation
      if (!url) {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 420);
        input.focus();
        return;
      }
      // create trail visual inside the button
      createTrail(e.clientX, e.clientY, btnGenerate);

      btnGenerate.setAttribute('aria-busy', 'true');
      // small delay for ux
      setTimeout(() => {
        // sanitize quotes inside URL
        const sanitized = url.replace(/"/g, '\\"');
        const snippet = `loadstring(game:HttpGet("${sanitized}"))()`;
        loadOutput.textContent = snippet;
        loadResult.classList.remove('hidden');
        btnGenerate.removeAttribute('aria-busy');
      }, 220);
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', (e) => {
      createTrail(e.clientX, e.clientY, btnClear);
      input.value = '';
      loadResult.classList.add('hidden');
      loadOutput.textContent = '';
      input.focus();
    });
  }

  // Enter key generates the loadstring
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnGenerate && btnGenerate.click();
      }
    });
  }

  // Small helper: hide details when clicking outside them
  document.addEventListener('click', (e) => {
    const isCard = e.target.closest('.card, .script-card, .executor-details, .script-details, .btn-close');
    const isSidebar = e.target.closest('.sidebar');
    if (!isCard && !isSidebar) {
      // keep details visible only when user interacts intentionally
      // (if you prefer to auto-close, uncomment next line)
      // hideAllDetails();
    }
  });

  // Small CSS shake style injection for empty input (non intrusive)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes _shake { 0%{transform:translateX(0)} 25%{transform:translateX(-6px)} 50%{transform:translateX(6px)} 75%{transform:translateX(-4px)} 100%{transform:translateX(0)} }
    .shake { animation: _shake 420ms ease; }
  `;
  document.head.appendChild(style);
});
