/**
 * MJB Prime Vikas Samiti — Shared Site Scripts
 */
(function () {
  "use strict";

  var PORTAL_LINK_ID = "portalLink";
  var HEADER_SCROLL_THRESHOLD = 24;

  function getCurrentPage() {
    var page = window.location.pathname.split("/").pop();
    if (!page || page === "") {
      return "index.html";
    }
    return page;
  }

  /**
   * Highlight the active navigation link based on current page.
   */
  function initActiveNavigation() {
    var currentPage = getCurrentPage();
    var navLinks = document.querySelectorAll(".site-nav__link[data-nav]");

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      var linkPage = href.split("/").pop();
      if (linkPage === currentPage) {
        link.classList.add("site-nav__link--active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /**
   * Load Resident Portal URL from host.cfg (HOST=...) → http://HOST:3000
   */
  function initResidentPortal() {
    var portalLinks = document.querySelectorAll(
      "#" + PORTAL_LINK_ID + ", .js-portal-link"
    );

    if (!portalLinks.length) {
      return;
    }

    fetch("host.cfg")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("host.cfg unavailable");
        }
        return response.text();
      })
      .then(function (text) {
        var match = text.match(/HOST\s*=\s*(.+)/);
        if (!match) {
          return;
        }

        var host = match[1].trim();
        var portalUrl = "http://" + host + ":3000";

        portalLinks.forEach(function (link) {
          link.href = portalUrl;
          link.setAttribute("rel", "noopener noreferrer");
        });
      })
      .catch(function () {
        portalLinks.forEach(function (link) {
          link.setAttribute("aria-disabled", "true");
          link.addEventListener("click", function (event) {
            if (link.getAttribute("href") === "#") {
              event.preventDefault();
            }
          });
        });
      });
  }

  /**
   * Toggle sticky header background on scroll.
   */
  function initStickyHeader() {
    var header = document.querySelector(".site-header");
    if (!header) {
      return;
    }

    function updateHeader() {
      if (window.scrollY > HEADER_SCROLL_THRESHOLD) {
        header.classList.add("site-header--scrolled");
      } else {
        header.classList.remove("site-header--scrolled");
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /**
   * Mobile navigation toggle with keyboard support.
   */
  function initMobileNav() {
    var toggle = document.querySelector(".site-nav__toggle");
    var navList = document.querySelector(".site-nav__list");

    if (!toggle || !navList) {
      return;
    }

    function closeNav() {
      toggle.setAttribute("aria-expanded", "false");
      navList.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    function openNav() {
      toggle.setAttribute("aria-expanded", "true");
      navList.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", function () {
      var isExpanded = toggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeNav();
      } else {
        openNav();
      }
    });

    navList.querySelectorAll(".site-nav__link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        closeNav();
      }
    });
  }

  /**
   * Fade-in animation via Intersection Observer.
   */
  function initFadeIn() {
    var elements = document.querySelectorAll(".fade-in");

    if (!elements.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Initialize all site modules when DOM is ready.
   */
  function init() {
    initActiveNavigation();
    initResidentPortal();
    initStickyHeader();
    initMobileNav();
    initFadeIn();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
