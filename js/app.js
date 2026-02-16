/**
 * app.js
 * Lógica específica do site (menu mobile, scroll suave, form).
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

  function setupForm() {
    var form = document.getElementById("orderForm");
    if (!form) return;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var phone = form.querySelector("#phone");
      var message = form.querySelector("#message");

      var n = name ? name.value.trim() : "";
      var e = email ? email.value.trim() : "";
      var p = phone ? phone.value.trim() : "";
      var m = message ? message.value.trim() : "";

      // Validação simples
      if (!n) return UI.toast({ title: "Preencha seu nome", description: "Informe seu nome completo para continuar." });
      if (!e || !validateEmail(e)) return UI.toast({ title: "E-mail inválido", description: "Informe um e-mail válido para contato." });
      if (!p) return UI.toast({ title: "Telefone obrigatório", description: "Informe um telefone/WhatsApp para retorno." });
      if (!m) return UI.toast({ title: "Mensagem obrigatória", description: "Descreva o que você deseja encomendar." });

      // Simulação de envio
      UI.toast({
        title: "Mensagem enviada!",
        description: "Recebemos seu pedido e entraremos em contato em breve.",
        duration: 4200
      });

      form.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setYear();
    setupMobileMenu();
    setupNavScroll();
    setupForm();
  });
})();
