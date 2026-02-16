/**
 * app.js
 * Lógica específica do site (menu mobile, scroll suave, form -> WhatsApp).
 */
(function () {
  "use strict";

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  }

  function setYear() {
    var y = new Date().getFullYear();
    var target = document.querySelector("[data-year]");
    if (target) target.textContent = String(y);
  }

  function setupNavScroll() {
    document.querySelectorAll("[data-scroll]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-scroll");
        if (!id) return;
        scrollToId(id);
        closeMobileMenu();
      });
    });
  }

  var menuBtn, mobileNav, iconOpen, iconClose;

  function openMobileMenu() {
    if (!mobileNav || !menuBtn) return;
    mobileNav.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    if (iconOpen) iconOpen.classList.add("is-hidden");
    if (iconClose) iconClose.classList.remove("is-hidden");
  }

  function closeMobileMenu() {
    if (!mobileNav || !menuBtn) return;
    mobileNav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    if (iconOpen) iconOpen.classList.remove("is-hidden");
    if (iconClose) iconClose.classList.add("is-hidden");
  }

  function toggleMobileMenu() {
    if (!mobileNav) return;
    if (mobileNav.classList.contains("is-open")) closeMobileMenu();
    else openMobileMenu();
  }

  function setupMobileMenu() {
    menuBtn = document.querySelector("[data-menu-btn]");
    mobileNav = document.querySelector("[data-mobile-nav]");
    iconOpen = document.querySelector('[data-menu-icon="open"]');
    iconClose = document.querySelector('[data-menu-icon="close"]');

    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener("click", toggleMobileMenu);

    // Fecha ao clicar fora
    document.addEventListener("click", function (ev) {
      if (!mobileNav.classList.contains("is-open")) return;
      var target = ev.target;
      var clickedInside = mobileNav.contains(target) || menuBtn.contains(target);
      if (!clickedInside) closeMobileMenu();
    });

    // Fecha no ESC
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeMobileMenu();
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  /**
   * setupForm
   * Integra a lógica do formulário para enviar mensagem via WhatsApp (wa.me).
   */
  function setupForm() {
    var form = document.getElementById("orderForm");
    var btn = document.querySelector("#submitbtn");
    var resultado = document.querySelector("#resultado");

    // Se não existir o formulário e nem o botão, não faz nada.
    if (!form && !btn) return;

    // Número da empresa (WhatsApp)
    var telefoneEmpresa = "5511934994424";

    // Função central de envio (reutilizável)
    function handleSend(ev) {
      if (ev) ev.preventDefault();

      // Preferir capturar do form (se existir), senão do document
      var scope = form || document;

      var nomeEl = scope.querySelector("#name");
      var emailEl = scope.querySelector("#email");
      var phoneEl = scope.querySelector("#phone");
      var msgEl = scope.querySelector("#message");

      var nome = nomeEl ? nomeEl.value.trim() : "";
      var email = emailEl ? emailEl.value.trim() : "";
      var telefoneCliente = phoneEl ? phoneEl.value.trim() : "";
      var mensagemCliente = msgEl ? msgEl.value.trim() : "";

      // Validações
      if (!nome || !email || !telefoneCliente || !mensagemCliente) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      if (!validateEmail(email)) {
        alert("Informe um e-mail válido.");
        return;
      }

      console.table({
        nome: nome,
        email: email,
        telefoneCliente: telefoneCliente,
        mensagemCliente: mensagemCliente
      });

      if (resultado) {
        resultado.textContent = "Olá " + nome + ", sua mensagem está sendo enviada para o WhatsApp!";
      }

      var mensagem =
        "Olá, tudo bem?\n\n" +
        "Meu nome é: " + nome + "\n" +
        "E-mail: " + email + "\n" +
        "Telefone: " + telefoneCliente + "\n\n" +
        "Mensagem:\n" + mensagemCliente + "\n\n" +
        "Gostaria de mais informações!";

      var url = "https://wa.me/" + telefoneEmpresa + "?text=" + encodeURIComponent(mensagem);

      // Redireciona para o WhatsApp
      window.location.href = url;
    }

    // Submit do formulário (Enter ou botão tipo submit)
    if (form) {
      form.addEventListener("submit", handleSend);
    }

    // Clique no botão específico (caso o botão não seja submit)
    if (btn) {
      btn.addEventListener("click", handleSend);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setYear();
    setupMobileMenu();
    setupNavScroll();
    setupForm();
  });
})();
