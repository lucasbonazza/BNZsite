document.addEventListener("DOMContentLoaded", () => {

    // =======================
    // CONTROLE DE ABAS PRINCIPAIS
    // =======================
    const tabs = document.querySelectorAll(".sidebar a");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", e => {
            e.preventDefault();
            const target = tab.dataset.tab;

            // Remove active de todas abas
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Remove active de todos os conteúdos
            tabContents.forEach(tc => tc.classList.remove("active"));
            const mainContent = document.getElementById(target);
            mainContent.classList.add("active");

            // Esconde todos detalhes
            hideAllDetails();

            // Ativa sub-aba padrão se existir
            const defaultSub = mainContent.querySelector(".sub-tab.default");
            if (defaultSub) {
                defaultSub.click();
            }
        });
    });

    // =======================
    // FUNÇÃO PARA ESCONDER DETALHES
    // =======================
    function hideAllDetails() {
        document.querySelectorAll(
            ".executor-details, .script-details, #load-result"
        ).forEach(d => {
            d.classList.add("hidden");
        });
    }

    // =======================
    // SUB-ABAS
    // =======================
    const subTabs = document.querySelectorAll(".sub-tab");
    const subContents = document.querySelectorAll(".sub-tab-content");

    subTabs.forEach(sub => {
        sub.addEventListener("click", () => {
            const parent = sub.closest(".tab-content");

            // Remove active de todas sub-abas do mesmo container
            parent.querySelectorAll(".sub-tab").forEach(s => s.classList.remove("active"));
            parent.querySelectorAll(".sub-tab-content").forEach(c => c.classList.remove("active"));

            // Ativa a sub-aba clicada
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
    // BOTÕES FECHAR DETALHES
    // =======================
    function attachCloseButtons() {
        const closeButtons = document.querySelectorAll(".btn-close");
        closeButtons.forEach(btn => btn.replaceWith(btn.cloneNode(true))); // remove listeners duplicados
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
        const copyButtons = document.querySelectorAll(".btn-copy");
        copyButtons.forEach(btn => btn.replaceWith(btn.cloneNode(true))); // remove listeners duplicados
        document.querySelectorAll(".btn-copy").forEach(btn => {
            btn.addEventListener("click", () => {
                let codeBlock = btn.previousElementSibling;
                if (!codeBlock) return;
                // Caso seja <pre><code>
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
    // LOADSTRING GENERATOR
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
            let url = (input.value || "").trim();
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
            loadResult.classList.remove("hidden");
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
