/* ============================================================
   Nexora Web — script.js
   Vanilla JS, no frameworks. Handles:
   1. Sticky header scrolled state
   2. Mobile hamburger navigation
   3. Active nav highlighting (scrollspy)
   4. Reveal-on-scroll animations
   5. Free Website Review form validation + submit
   6. Current year in the footer
   ============================================================ */
(function () {
  'use strict';

  /* --------------------------------------------------------
     1. Sticky header — add a border once the page scrolls
     -------------------------------------------------------- */
  var header = document.querySelector('.header');
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------------
     2. Mobile hamburger navigation
     -------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu() {
    burger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    var open = burger.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', toggleMenu);
  // Close the menu after tapping any link inside it
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* --------------------------------------------------------
     3. Active nav highlighting (scrollspy)
        Watches the main sections and marks the matching
        header link as active.
     -------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length) {
    var spyCheck = function () {
      var pos = window.scrollY + (window.innerHeight || 0) * 0.32;
      var currentId = null;
      sections.forEach(function (s) {
        if (s.offsetTop <= pos) currentId = '#' + s.id;
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === currentId);
      });
    };
    window.addEventListener('scroll', spyCheck, { passive: true });
    window.addEventListener('resize', spyCheck);
    spyCheck();
  }

  /* --------------------------------------------------------
     4. Reveal-on-scroll animations
        Robust across environments:
        • Content visible above the fold immediately on load
        • Items lower down animate in as they enter the viewport
        • A hard failsafe forces everything visible after 1.5s
          (so nothing can ever get stuck hidden)
     -------------------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var firstRun = true;

  function forceVisible(el) {
    el.style.transition = 'none';
    el.classList.add('in');
    el.style.opacity = '1';
    el.style.transform = 'none';
  }

  function revealCheck() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      var rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.9 && rect.bottom > 0) {
        if (firstRun || reduceMotion) {
          // Already on screen at load — show immediately (no anim dependency)
          forceVisible(el);
        } else {
          // Entering on scroll — let CSS animate it, with a fallback
          el.classList.add('in');
          (function (node) {
            setTimeout(function () { node.style.transition = 'none'; node.style.opacity = '1'; node.style.transform = 'none'; }, 600);
          })(el);
        }
        reveals.splice(i, 1);
      }
    }
    firstRun = false;
  }

  window.addEventListener('scroll', revealCheck, { passive: true });
  window.addEventListener('resize', revealCheck);
  revealCheck();
  setTimeout(revealCheck, 250);

  // Hard failsafe: never leave content hidden
  setTimeout(function () {
    document.querySelectorAll('.reveal').forEach(function (el) { forceVisible(el); });
  }, 1500);

  /* --------------------------------------------------------
     5. Free Website Review form — validation + submit
        Front-end validation only. The success message is
        shown ONLY after a successful submit.
     -------------------------------------------------------- */
  var form = document.getElementById('reviewForm');
  var success = document.getElementById('formSuccess');
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phoneRe = /^[0-9 +()\-]{7,}$/;

  function getField(input) { return input.closest('.field'); }

  function validateField(input) {
    var field = getField(input);
    var value = (input.value || '').trim();
    var ok = true;

    if (input.hasAttribute('required') && value === '') ok = false;
    else if (input.type === 'email' && value !== '' && !emailRe.test(value)) ok = false;
    else if (input.type === 'tel' && value !== '' && !phoneRe.test(value)) ok = false;

    field.classList.toggle('has-error', !ok);
    return ok;
  }

  if (form) {
    // Live-clear errors as the user fixes a field
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        if (getField(input).classList.contains('has-error')) validateField(input);
      });
      input.addEventListener('blur', function () {
        if (input.hasAttribute('required')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = form.querySelectorAll('[required]');
      var allValid = true;
      var firstInvalid = null;

      required.forEach(function (input) {
        var ok = validateField(input);
        if (!ok && !firstInvalid) firstInvalid = input;
        if (!ok) allValid = false;
      });

      if (!allValid) {
        success.classList.remove('is-visible');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* ---------------------------------------------------
         SUBMIT — sends to Formspree via AJAX so the page
         stays put and we can show the inline success message.
         --------------------------------------------------- */
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            success.classList.add('is-visible');
            form.reset();
          } else {
            return res.json().then(function (data) {
              var msg = (data && data.errors && data.errors.map(function (e) { return e.message; }).join(', ')) || 'Something went wrong. Please try again or message us on WhatsApp.';
              throw new Error(msg);
            });
          }
        })
        .catch(function (err) {
          success.classList.remove('is-visible');
          alert(err.message || 'Could not send your request. Please try again or message us on WhatsApp.');
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalLabel; }
        });
    });
  }

  /* --------------------------------------------------------
     6. Current year in the footer
     -------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
