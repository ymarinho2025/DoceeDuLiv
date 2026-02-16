/* Pequenas utilidades de UI em JavaScript puro (sem dependências).
 * Inclui: Toast, fallback de imagem, helpers de classe/seletores.
 */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  // Expondo utilidades mínimas (sem poluir demais)
  window.UI = {
    $: $,
    $all: $all,
    toast: toast,
    applyImageFallbacks: applyImageFallbacks
  };

  function applyImageFallbacks() {
    $all("img[data-fallback]").forEach(function (img) {
      var fallback = img.getAttribute("data-fallback");
      if (!fallback) return;

      img.addEventListener("error", function onErr() {
        // Evita loop infinito
        img.removeEventListener("error", onErr);
        img.src = fallback;
      });
    });
  }

  // Toasts (inspirado no "sonner", mas em JS puro)
  function toast(opts) {
    var region = $("#toastRegion");
    if (!region) return;

    var title = (opts && opts.title) ? String(opts.title) : "Aviso";
    var description = (opts && opts.description) ? String(opts.description) : "";
    var duration = (opts && opts.duration) ? Number(opts.duration) : 3600;

    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");

    var content = document.createElement("div");

    var h = document.createElement("p");
    h.className = "toast-title";
    h.textContent = title;

    var p = document.createElement("p");
    p.className = "toast-desc";
    p.textContent = description;

    content.appendChild(h);
    if (description) content.appendChild(p);

    var close = document.createElement("button");
    close.className = "toast-close";
    close.type = "button";
    close.setAttribute("aria-label", "Fechar");
    close.textContent = "×";
    close.addEventListener("click", function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });

    el.appendChild(content);
    el.appendChild(close);
    region.appendChild(el);

    window.setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, duration);
  }

  // Inicializações globais
  document.addEventListener("DOMContentLoaded", function () {
    applyImageFallbacks();
  });
})();
