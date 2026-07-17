/* ============================================================
   Nexora Web — script.js
   Vanilla JS, no frameworks. Handles:
   1. Sticky header scrolled state
   2. Mobile navigation overlay (open/close, focus trap, scroll lock)
   3. Active nav highlighting (scrollspy)
   4. Reveal-on-scroll animations
   5. Portfolio video playback (IntersectionObserver)
   6. FAQ accordion
   7. Free Homepage Demo form validation + submit
   8. Current year in the footer
   9. Announcement bar dismiss (session-only)
   10. Launch offer selection (badge, form highlight, prefill, submit label)
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
     2. Mobile navigation overlay
        A true fixed full-viewport panel, direct child of <body>.
        Handles: open/close, focus trap, Escape, resize-to-desktop,
        iOS-safe scroll locking that restores exact scroll position.
     -------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');
  var mobileNavClose = document.getElementById('mobileNavClose');
  var lockedScrollY = 0;

  function getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled])')
    );
  }

  function setMobileNavFocusable(enabled) {
    // Links are tabindex="-1" while the menu is closed so they never
    // steal keyboard focus from the rest of the page.
    getFocusable(mobileNav).forEach(function (el) {
      if (enabled) el.removeAttribute('tabindex');
      else el.setAttribute('tabindex', '-1');
    });
  }

  function lockScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = -lockedScrollY + 'px';
    document.body.classList.add('nav-locked');
  }

  function unlockScroll() {
    document.body.classList.remove('nav-locked');
    document.body.style.top = '';
    // Force a synchronous reflow so the browser has recomputed the page's
    // restored (unlocked) scrollable height before we jump — otherwise the
    // scrollTo below can race the layout and land short of the target.
    // eslint-disable-next-line no-unused-expressions
    document.body.offsetHeight;
    // Force an instant jump — html{scroll-behavior:smooth} would otherwise
    // animate this restore, visibly scrolling the page after the menu closes.
    window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' });
  }

  function openMenu() {
    burger.classList.add('is-open');
    mobileNav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    mobileNav.removeAttribute('aria-hidden');
    setMobileNavFocusable(true);
    lockScroll();
    // Move focus into the panel for keyboard/screen-reader users.
    mobileNavClose.focus({ preventScroll: true });
    document.addEventListener('keydown', onMenuKeydown);
  }

  function closeMenu(opts) {
    var restoreFocus = !opts || opts.restoreFocus !== false;
    burger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    setMobileNavFocusable(false);
    unlockScroll();
    document.removeEventListener('keydown', onMenuKeydown);
    if (restoreFocus) burger.focus({ preventScroll: true });
  }

  function isMenuOpen() {
    return mobileNav.classList.contains('is-open');
  }

  function toggleMenu() {
    if (isMenuOpen()) closeMenu();
    else openMenu();
  }

  function onMenuKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
    if (e.key !== 'Tab') return;
    // Simple focus trap: cycle within the panel's focusable elements.
    var focusable = getFocusable(mobileNav);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  burger.addEventListener('click', toggleMenu);
  mobileNavClose.addEventListener('click', function () { closeMenu(); });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { closeMenu({ restoreFocus: false }); });
  });
  // Close automatically if the viewport grows back to desktop width.
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && isMenuOpen()) closeMenu({ restoreFocus: false });
  });
  // Start fully closed / non-focusable.
  setMobileNavFocusable(false);

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
  var firstRun = true;

  function forceVisible(el) {
    el.style.transition = 'none';
    el.classList.add('in');
    el.style.opacity = '1';
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
            setTimeout(function () { node.style.transition = 'none'; node.style.opacity = '1'; }, 600);
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
     5. Portfolio video playback control
        Both showcase videos autoplay muted/looped/inline, but we
        only let them actually play near the viewport, and pause
        them once they scroll well away — keeps scrolling smooth
        and avoids two videos decoding at full power off-screen.
        If autoplay is blocked by the browser, the poster image
        (set in HTML) simply stays visible — no broken UI.
     -------------------------------------------------------- */
  var videos = Array.prototype.slice.call(document.querySelectorAll('.js-video'));
  if (videos.length) {
    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(function () { /* autoplay blocked — poster stays visible */ });
            }
          } else {
            video.pause();
          }
        });
      }, { rootMargin: '200px 0px', threshold: 0.01 });
      videos.forEach(function (v) { videoObserver.observe(v); });
    } else {
      // No IntersectionObserver support — attempt a single play and
      // let the poster carry the UI if it fails.
      videos.forEach(function (v) {
        var p = v.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});
      });
    }
  }

  /* --------------------------------------------------------
     6. FAQ accordion
        Each item opens/closes independently. Height animation is
        handled entirely in CSS via a 0fr/1fr grid-template-rows
        transition, so there is no JS height measurement and no
        overflow:hidden on any ancestor section.
     -------------------------------------------------------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* --------------------------------------------------------
     7. Free Homepage Demo form — validation + submit
        Front-end validation only. The success message is
        shown ONLY after a successful submit.
     -------------------------------------------------------- */
  var form = document.getElementById('contactForm');
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
     8. Current year in the footer
     -------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* --------------------------------------------------------
     9. Announcement bar — dismissible for the current browser
        session only (sessionStorage, not persisted long-term).
     -------------------------------------------------------- */
  var ANNOUNCEMENT_KEY = 'nexoraAnnouncementDismissed';
  var announcementBar = document.getElementById('announcementBar');
  if (announcementBar) {
    var announcementDismissed = false;
    try { announcementDismissed = sessionStorage.getItem(ANNOUNCEMENT_KEY) === '1'; } catch (e) { /* privacy mode — ignore */ }

    if (announcementDismissed) {
      announcementBar.remove();
    } else {
      var announcementClose = document.getElementById('announcementClose');
      if (announcementClose) {
        announcementClose.addEventListener('click', function () {
          announcementBar.remove();
          try { sessionStorage.setItem(ANNOUNCEMENT_KEY, '1'); } catch (e) { /* privacy mode — ignore */ }
        });
      }
    }
  }

  /* --------------------------------------------------------
     10. Launch offer selection
        Every "Claim a launch space"-style CTA (announcement bar,
        dedicated launch section) sets the enquiry-type select to
        the launch offer and pre-fills the message textarea — but
        only if the visitor hasn't already typed something there.
        A single change handler on the select keeps the selected-
        offer badge, form highlight and submit-button label in
        sync, so manually choosing the option in the dropdown
        behaves identically to clicking a CTA.
     -------------------------------------------------------- */
  var enquirySelect = document.getElementById('f-enquiry-type');
  var launchBadge = document.getElementById('launchOfferBadge');
  var formCardEl = document.querySelector('.form-card');
  var submitLabelEl = document.querySelector('#contactForm button[type="submit"] .btn-label');
  var improveField = document.getElementById('f-improve');

  var LAUNCH_VALUE = 'Launch Offer — £0 setup / £29 per month';
  var DEFAULT_SUBMIT_LABEL = submitLabelEl ? submitLabelEl.textContent : '';
  var LAUNCH_SUBMIT_LABEL = 'Claim My Launch Space';
  var LAUNCH_PREFILL = 'Hi, I’m interested in the First 5 Launch Offer with £0 website setup and £29 per month for hosting and ongoing support. My business is: ';

  function syncLaunchOfferUI() {
    if (!enquirySelect) return;
    var isLaunch = enquirySelect.value === LAUNCH_VALUE;
    if (formCardEl) formCardEl.classList.toggle('is-launch-selected', isLaunch);
    if (launchBadge) launchBadge.hidden = !isLaunch;
    if (submitLabelEl) submitLabelEl.textContent = isLaunch ? LAUNCH_SUBMIT_LABEL : DEFAULT_SUBMIT_LABEL;
    // Only prefill if the visitor hasn't already typed their own message —
    // never overwrite text they've entered. Applies whether the launch
    // offer was selected via a CTA click or the dropdown itself.
    if (isLaunch && improveField && improveField.value.trim() === '') {
      improveField.value = LAUNCH_PREFILL;
    }
  }

  function selectLaunchOffer() {
    if (!enquirySelect) return;
    enquirySelect.value = LAUNCH_VALUE;
    syncLaunchOfferUI();
  }

  if (enquirySelect) {
    enquirySelect.addEventListener('change', syncLaunchOfferUI);
    syncLaunchOfferUI();
  }

  document.querySelectorAll('.js-claim-launch').forEach(function (el) {
    el.addEventListener('click', selectLaunchOffer);
  });
})();
