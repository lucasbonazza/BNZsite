document.addEventListener("DOMContentLoaded", () => {

  // =======================
  // ABAS PRINCIPAIS
  // =======================
  const tabs = document.querySelectorAll(".sidebar a");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      const target = tab.dataset.tab;

      // ativa a aba clicada
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // mostra conteúdo correspondente
      tabContents.forEach(tc => tc.classList.remove("active"));
      const mainContent = document.getElementById(target);
      if (mainContent) mainContent.classList.add("active");

      hideAllDetails();

      // ativa sub-aba padrão se existir
      const defaultSub = mainContent.querySelector(".sub-tab.default");
      if (defaultSub) defaultSub.click();
    });
  });

  // =======================
  // ESCONDER DETALHES
  // =======================
  function hideAllDetails() {
    document.querySelectorAll(".executor-details, .script-details").forEach(d => d.classList.add("hidden"));
    const loadResult = document.getElementById("load-result");
    if (loadResult && document.querySelector(".tab-content.active")?.id !== "loadstring") {
      loadResult.classList.add("hidden");
    }
  }

  // =======================
  // SUB-ABAS
  // =======================
  const subTabs = document.querySelectorAll(".sub-tab");
  subTabs.forEach(sub => {
    sub.addEventListener("click", () => {
      const parent = sub.closest(".tab-content");
      if (!parent) return;

      // remove active de todas sub-abas
      parent.querySelectorAll(".sub-tab").forEach(s => s.classList.remove("active"));
      parent.querySelectorAll(".sub-tab-content").forEach(c => c.classList.remove("active"));

      // ativa a sub-aba clicada
      sub.classList.add("active");
      const subTarget = sub.dataset.sub;
      const subContent = parent.querySelector(`#${subTarget}`);
      if (subContent) subContent.classList.add("active");
    });
  });

  // =======================
  // EXECUTORES
  // =======================
  const executorCards = document.querySelectorAll("#executores .card");
  executorCards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (!id) return;
      hideAllDetails();
      const detail = document.getElementById(id);
      if (detail) {
        detail.classList.remove("hidden");
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // =======================
  // SCRIPTS
  // =======================
  const scriptCards = document.querySelectorAll("#scripts .script-card");
  scriptCards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (!id) return;
      hideAllDetails();
      const detail = document.getElementById(id);
      if (detail) {
        detail.classList.remove("hidden");
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // =======================
  // BOTÕES FECHAR
  // =======================
  function attachCloseButtons() {
    document.querySelectorAll(".btn-close").forEach(btn => {
      btn.replaceWith(btn.cloneNode(true)); // remove listeners duplicados
    });
    document.querySelectorAll(".btn-close").forEach(btn => {
      btn.addEventListener("click", () => {
        const parent = btn.closest(".executor-details, .script-details");
        if (parent) parent.classList.add("hidden");
      });
    });
  }
  attachCloseButtons();

  // =======================
  // BOTÕES COPIAR
  // =======================
  function attachCopyButtons() {
    document.querySelectorAll(".btn-copy").forEach(btn => {
      btn.replaceWith(btn.cloneNode(true));
    });
    document.querySelectorAll(".btn-copy").forEach(btn => {
      btn.addEventListener("click", () => {
        let codeBlock = btn.previousElementSibling;
        if (!codeBlock) return;

        if (codeBlock.tagName.toLowerCase() === "pre") {
          codeBlock = codeBlock.querySelector("code");
        }

        if (codeBlock) {
          navigator.clipboard.writeText(codeBlock.innerText.trim())
            .then(() => {
              const original = btn.textContent;
              btn.textContent = "Copiado!";
              setTimeout(() => btn.textContent = original, 2000);
            })
            .catch(() => {
              const original = btn.textContent;
              btn.textContent = "Erro ao copiar";
              setTimeout(() => btn.textContent = original, 2000);
            });
        }
      });
    });
  }
  attachCopyButtons();

  // =======================
  // LOADSTRING
  // =======================
  const input = document.getElementById("load-input");
  const btnGenerate = document.getElementById("btn-generate");
  const loadResult = document.getElementById("load-result");
  const loadOutput = document.getElementById("load-output");
  const btnClearLoad = document.getElementById("btn-clear-load");

  function escapeForDoubleQuotes(str) {
    return String(str).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  if (btnGenerate && input && loadOutput && loadResult) {
    btnGenerate.addEventListener("click", ev => {
      ev.preventDefault();
      const url = (input.value || "").trim();
      if (!url) {
        input.animate([
          { transform: "translateX(-6px)" },
          { transform: "translateX(6px)" },
          { transform: "translateX(0)" }
        ], { duration: 300 });
        input.focus();
        return;
      }

      const safe = escapeForDoubleQuotes(url);
      const snippet = `loadstring(game:HttpGet("${safe}"))()`;
      loadOutput.textContent = snippet;

      if (document.querySelector(".tab-content.active")?.id === "loadstring") {
        loadResult.classList.remove("hidden");
      }

      attachCopyButtons();
      loadResult.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  if (btnClearLoad && input && loadOutput && loadResult) {
    btnClearLoad.addEventListener("click", () => {
      input.value = "";
      loadOutput.textContent = "";
      loadResult.classList.add("hidden");
      input.focus();
    });
  }

  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        btnGenerate.click();
      }
    });
  }

});
