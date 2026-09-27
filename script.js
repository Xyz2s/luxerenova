(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav drawer ---------- */
  var sideNav = document.getElementById("sideNav");
  var mobileToggle = document.getElementById("mobileToggle");
  var navScrim = document.getElementById("navScrim");

  function closeDrawer() {
    sideNav.classList.remove("is-open");
    navScrim.classList.remove("is-open");
    mobileToggle.classList.remove("is-open");
    mobileToggle.setAttribute("aria-expanded", "false");
  }
  function toggleDrawer() {
    var isOpen = sideNav.classList.toggle("is-open");
    navScrim.classList.toggle("is-open", isOpen);
    mobileToggle.classList.toggle("is-open", isOpen);
    mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  if (mobileToggle && sideNav && navScrim) {
    mobileToggle.addEventListener("click", toggleDrawer);
    navScrim.addEventListener("click", closeDrawer);
    sideNav.querySelectorAll(".nav-link, .btn").forEach(function (el) {
      el.addEventListener("click", closeDrawer);
    });
  }

  /* ---------- Scrollspy ---------- */
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = Array.prototype.slice.call(document.querySelectorAll(".section[id]"));

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-target") === id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(".reveal, .cap-card, .project-card, .note-card");

  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Build sequence accordion ---------- */
  var layerToggles = document.querySelectorAll(".layer-toggle");
  var layerPanels = document.querySelectorAll(".layer-panel");

  layerToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var target = toggle.getAttribute("data-layer");
      var alreadyActive = toggle.classList.contains("is-active");

      layerToggles.forEach(function (t) { t.classList.remove("is-active"); });
      layerPanels.forEach(function (p) { p.classList.remove("is-active"); });

      if (!alreadyActive) {
        toggle.classList.add("is-active");
        var panel = document.querySelector('.layer-panel[data-panel="' + target + '"]');
        if (panel) panel.classList.add("is-active");
      }
    });
  });

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  function validateField(field) {
    var wrap = field.closest(".field");
    if (!wrap) return true;
    var valid = field.checkValidity();
    wrap.classList.toggle("has-error", !valid);
    return valid;
  }

  if (form) {
    var requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        if (field.closest(".field").classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var allValid = true;
      requiredFields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        if (formNote) {
          formNote.textContent = "Please complete the highlighted fields.";
          formNote.style.color = "#FF8A5C";
        }
        return;
      }

      var submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.textContent = "Submitting…";
        submitBtn.disabled = true;
      }

      // Simulated submission — replace with a real endpoint when deploying.
      setTimeout(function () {
        if (formNote) {
          formNote.textContent = "Received — a project lead will call within one business day.";
          formNote.style.color = "#6FCF9E";
        }
        form.reset();
        if (submitBtn) {
          submitBtn.textContent = "Submit for review";
          submitBtn.disabled = false;
        }
      }, 900);
    });
  }
})();