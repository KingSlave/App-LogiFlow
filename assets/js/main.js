/* LogiFlow Edu — interacciones de la página de producto.
   Sin dependencias. Todo es mejora progresiva: el contenido funciona sin JS. */
(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "lf-theme";
  var reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var systemDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function each(selector, callback, scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll(selector), callback);
  }

  function readStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      /* El tema sigue funcionando durante la sesión. */
    }
  }

  /* ---------- Tema claro / oscuro ---------- */
  function currentTheme() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function syncThemeButtons(theme) {
    var target = theme === "dark" ? "claro" : "oscuro";
    each("[data-theme-toggle]", function (button) {
      button.setAttribute("aria-label", "Cambiar a tema " + target);
      button.setAttribute("title", "Cambiar a tema " + target);
    });
  }

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    syncThemeButtons(theme);
    if (persist) storeTheme(theme);
  }

  applyTheme(currentTheme(), false);

  each("[data-theme-toggle]", function (button) {
    button.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  });

  if (systemDark) {
    var onSystemTheme = function (event) {
      if (!readStoredTheme()) applyTheme(event.matches ? "dark" : "light", false);
    };
    if (systemDark.addEventListener) systemDark.addEventListener("change", onSystemTheme);
    else if (systemDark.addListener) systemDark.addListener(onSystemTheme);
  }

  /* ---------- Encabezado al hacer scroll ---------- */
  var header = document.querySelector("[data-header]");

  function syncHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  /* ---------- Menú móvil ---------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function setNav(open) {
    if (!navToggle || !nav) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });

    each("a", function (link) {
      link.addEventListener("click", function () {
        setNav(false);
      });
    }, nav);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      setNav(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setNav(false);
    });
  }

  /* ---------- Pestañas accesibles (código generado) ---------- */
  each("[data-tabs]", function (container) {
    var tabs = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(container.querySelectorAll('[role="tabpanel"]'));
    if (!tabs.length || !panels.length) return;

    function select(index, moveFocus) {
      tabs.forEach(function (tab, tabIndex) {
        var isSelected = tabIndex === index;
        tab.setAttribute("aria-selected", isSelected ? "true" : "false");
        tab.tabIndex = isSelected ? 0 : -1;
        tab.classList.toggle("is-active", isSelected);

        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) panel.hidden = !isSelected;
      });
      if (moveFocus && tabs[index]) tabs[index].focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        select(index, false);
      });

      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;

        if (next !== null) {
          event.preventDefault();
          select(next, true);
        }
      });
    });

    var initial = 0;
    tabs.forEach(function (tab, index) {
      if (tab.getAttribute("aria-selected") === "true") initial = index;
    });
    select(initial, false);
  });

  /* ---------- Descargas configurables ---------- */
  var releaseConfig = window.LOGIFLOW_RELEASES || {};
  var releasePlatforms = releaseConfig.platforms || {};
  var releaseReady = false;

  each("[data-platform]", function (card) {
    var key = card.getAttribute("data-platform");
    var info = releasePlatforms[key] || {};
    var action = card.querySelector("[data-release-action]");
    var label = card.querySelector("[data-release-label]");
    if (!action) return;

    var available = Boolean(releaseConfig.published) && Boolean(info.url);

    if (available) {
      releaseReady = true;
      action.setAttribute("href", info.url);
      action.classList.remove("is-pending");
      action.classList.add("is-ready");
      action.removeAttribute("aria-disabled");
      action.removeAttribute("tabindex");
      if (info.fileName) action.setAttribute("download", info.fileName);
      if (label) label.textContent = "Descargar para " + (info.label || key);
      card.classList.add("is-available");

      if (info.size) {
        var specList = card.querySelector(".spec-list");
        if (specList) {
          var row = document.createElement("div");
          var term = document.createElement("dt");
          var value = document.createElement("dd");
          term.textContent = "Tamaño";
          value.textContent = info.size;
          row.appendChild(term);
          row.appendChild(value);
          specList.appendChild(row);
        }
      }
    } else {
      action.addEventListener("click", function (event) {
        event.preventDefault();
      });
    }
  });

  var pendingBanner = document.querySelector("[data-release-banner]");
  var readyBanner = document.querySelector("[data-release-ready]");

  if (releaseConfig.published && releaseReady) {
    if (pendingBanner) pendingBanner.hidden = true;
    if (readyBanner) readyBanner.hidden = false;

    each("[data-release-status]", function (badge) {
      badge.textContent = "Disponible";
      badge.classList.remove("badge-pending");
      badge.classList.add("badge-ready");
    });

    each("[data-release-hero-badge]", function (badge) {
      badge.textContent = "Disponible";
    });

    each("[data-release-footer-status]", function (node) {
      node.textContent = "Disponible";
    });

    each("[data-release-lead]", function (node) {
      node.textContent = "ya está disponible para Windows y macOS.";
    });

    each("[data-release-faq-question]", function (node) {
      node.textContent = "¿Dónde descargo LogiFlow Edu?";
    });

    each("[data-release-faq-answer]", function (node) {
      node.textContent = "LogiFlow Edu ya está disponible para Windows y macOS. En la sección Descargas encontrarás el instalador de cada plataforma, los requisitos y las notas de la versión.";
    });

    each("[data-release-howto-title]", function (node) {
      node.textContent = "Cómo empezar";
    });

    each("[data-release-howto-note]", function (node) {
      node.textContent = "Revisa los requisitos de cada plataforma antes de instalar. El texto de la licencia de uso acompaña a los instaladores.";
    });

    each("[data-release-final-copy]", function (node) {
      node.textContent = "Descarga LogiFlow Edu para Windows o macOS y empieza a dibujar tu primer diagrama.";
    });

    if (releaseConfig.notesUrl && readyBanner) {
      var notes = document.createElement("a");
      notes.className = "release-notes-link";
      notes.href = releaseConfig.notesUrl;
      notes.textContent = "Notas de la versión";
      var bannerCopy = readyBanner.querySelector("div");
      if (bannerCopy) bannerCopy.appendChild(notes);
    }
  }

  /* ---------- Detección del sistema operativo ---------- */
  function detectOS() {
    var userAgent = navigator.userAgent || "";
    var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";

    if (/iPhone|iPad|iPod|Android/i.test(userAgent)) return "mobile";
    if (/Win/i.test(platform) || /Windows/i.test(userAgent)) return "windows";
    if (/Mac/i.test(platform) && navigator.maxTouchPoints > 1) return "mobile";
    if (/Mac/i.test(platform) || /Mac OS X/i.test(userAgent)) return "macos";
    return "";
  }

  var detectedOS = detectOS();
  var osNote = document.querySelector("[data-os-note]");

  if (detectedOS === "windows" || detectedOS === "macos") {
    var currentCard = document.querySelector('[data-platform="' + detectedOS + '"]');
    var osName = detectedOS === "windows" ? "Windows" : "macOS";

    if (currentCard) {
      currentCard.classList.add("is-current");
      var osBadge = currentCard.querySelector("[data-os-badge]");
      if (osBadge) osBadge.hidden = false;
    }

    if (osNote) {
      osNote.hidden = false;
      osNote.textContent = releaseReady
        ? "Parece que usas " + osName + ". Este es el instalador para tu sistema."
        : "Parece que usas " + osName + ". Este es el instalador que necesitarás cuando se publique la versión.";
    }
  } else if (detectedOS === "mobile" && osNote) {
    osNote.hidden = false;
    osNote.textContent = "Estás en un dispositivo móvil. Abre esta página en tu computadora para descargar LogiFlow Edu.";
  }

  /* ---------- Aparición progresiva ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (revealItems.length) {
    var canObserve = "IntersectionObserver" in window && !(reduceMotion && reduceMotion.matches);

    if (!canObserve) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    } else {
      root.classList.add("reveal-enabled");
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

      revealItems.forEach(function (item) {
        revealObserver.observe(item);
      });
    }
  }

  /* ---------- Enlace activo en la navegación ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));

  if (navLinks.length && "IntersectionObserver" in window) {
    var sectionLinks = [];
    navLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      if (target) sectionLinks.push({ section: target, link: link });
    });

    if (sectionLinks.length) {
      var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.removeAttribute("aria-current");
          });
          sectionLinks.forEach(function (pair) {
            if (pair.section === entry.target) pair.link.setAttribute("aria-current", "location");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

      sectionLinks.forEach(function (pair) {
        navObserver.observe(pair.section);
      });
    }
  }

  /* ---------- Año del pie ---------- */
  each("[data-year]", function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
