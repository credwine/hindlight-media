// HindLight Media - improvement layer JS (playhead + mobile menu safety net)

/* Hero CTA sits beside the headline inside Squarespace's flex row
   .content-wrapper; tag the wrapper so CSS can stack it on phones. */
(function () {
  function tag() {
    var ctas = document.querySelectorAll('.hl-hero-cta');
    for (var i = 0; i < ctas.length; i++) {
      if (ctas[i].parentElement) ctas[i].parentElement.classList.add('hl-cta-wrap');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tag);
  } else {
    tag();
  }
})();

/* Mobile menu: Squarespace's own bundle (ss/js) handles the burger and was
   verified working (toggles body.header--menu-open + burger--active).
   This layer only (a) keeps aria-expanded in sync, and (b) provides a
   DEFENSIVE fallback that fires ONLY if SS JS failed to change menu state
   after a click (e.g. bundle blocked or errored). */
(function () {
  function init() {
    var burgers = document.querySelectorAll('.header-burger-btn');
    if (!burgers.length) return;
    var injected = false;
    function inject() {
      if (injected) return;
      injected = true;
      var st = document.createElement('style');
      st.textContent =
        'body.hl-menu-open .header-menu{opacity:1;visibility:visible;pointer-events:auto;transform:none}' +
        'body.hl-menu-open{overflow:hidden}' +
        'body.hl-menu-open .header-burger-btn .top-bun{transform:translatey(4px) rotate(45deg)}' +
        'body.hl-menu-open .header-burger-btn .patty{opacity:0}' +
        'body.hl-menu-open .header-burger-btn .bottom-bun{transform:translatey(-4px) rotate(-45deg)}';
      document.head.appendChild(st);
    }
    function syncAria(open) {
      for (var i = 0; i < burgers.length; i++) {
        burgers[i].setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    }
    syncAria(document.body.classList.contains('header--menu-open'));
    for (var i = 0; i < burgers.length; i++) {
      (function (b) {
        b.addEventListener('click', function () {
          var wasSS = document.body.classList.contains('header--menu-open');
          var wasActive = b.classList.contains('burger--active');
          setTimeout(function () {
            var isSS = document.body.classList.contains('header--menu-open');
            var isActive = b.classList.contains('burger--active');
            if (wasSS !== isSS || wasActive !== isActive) {
              // SS JS acted - just mirror its state and stand down.
              document.body.classList.remove('hl-menu-open');
              syncAria(isSS);
              return;
            }
            // SS JS did nothing: fallback toggle.
            inject();
            var open = document.body.classList.toggle('hl-menu-open');
            syncAria(open);
          }, 80);
        });
      })(burgers[i]);
    }
    // If the fallback opened the menu, close it on Escape or on a menu link tap.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('hl-menu-open')) {
        document.body.classList.remove('hl-menu-open');
        syncAria(false);
      }
    });
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('hl-menu-open')) return;
      var a = e.target && e.target.closest ? e.target.closest('.header-menu a') : null;
      if (a) {
        document.body.classList.remove('hl-menu-open');
        syncAria(false);
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Ambient autoplay loops (no control bar): click/tap or keyboard toggles
   pause so autoplaying content stays pausable (WCAG 2.2.2). */
(function () {
  function init() {
    var vids = document.querySelectorAll('video[autoplay][loop]:not([controls])');
    for (var i = 0; i < vids.length; i++) {
      (function (v) {
        if (v.closest('.local-video-bg')) return; // background videos stay hands-off
        v.style.cursor = 'pointer';
        v.setAttribute('tabindex', '0');
        v.setAttribute('role', 'button');
        v.setAttribute('aria-label', 'Pause or play video');
        function toggle() { if (v.paused) { v.play(); } else { v.pause(); } }
        v.addEventListener('click', toggle);
        v.addEventListener('keydown', function (e) {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
        });
      })(vids[i]);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Premium + motion layer (v7): scroll reveals on our own sections,
   magnetic hero buttons, and a hero scroll cue. All reduced-motion safe
   and scoped so it never fights Squarespace's own reveal system. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    // 1. Scroll reveals - ONLY our injected components (never SS-managed nodes)
    var targets = [];
    document.querySelectorAll('.hl-reviews h2, .hl-reviews .hl-review, .hl-contact h2, .hl-contact .hl-big-phone, .hl-contact .hl-contact-ctas, .hl-contact .hl-form')
      .forEach(function (el) { targets.push(el); });
    // stagger review cards
    var cards = document.querySelectorAll('.hl-reviews .hl-review');
    for (var c = 0; c < cards.length; c++) cards[c].style.transitionDelay = (c * 90) + 'ms';

    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('hl-reveal', 'hl-in'); });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('hl-in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      targets.forEach(function (el) { el.classList.add('hl-reveal'); io.observe(el); });
      // Reveal anything above the fold immediately (no wait).
      requestAnimationFrame(function () {
        targets.forEach(function (el) {
          if (el.getBoundingClientRect().top < innerHeight * 0.9) el.classList.add('hl-in');
        });
      });
      // Hard safety net: content must NEVER stay invisible. Force-reveal every
      // remaining target after 3s regardless of scroll position (worst case it
      // simply appears without the entrance animation).
      setTimeout(function () {
        targets.forEach(function (el) { el.classList.add('hl-in'); });
      }, 3000);
    }

    // 2. Magnetic hero buttons (fine-pointer, motion-ok only)
    if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.querySelectorAll('.hl-hero-cta .hl-btn, .hl-hero-cta .hl-btn-ghost').forEach(function (b) {
        b.style.transition = 'transform .18s cubic-bezier(.22,1,.36,1),box-shadow .25s ease';
        b.addEventListener('mousemove', function (e) {
          var r = b.getBoundingClientRect();
          var mx = (e.clientX - r.left - r.width / 2) / r.width;
          var my = (e.clientY - r.top - r.height / 2) / r.height;
          b.style.transform = 'translate(' + (mx * 8).toFixed(1) + 'px,' + (my * 6).toFixed(1) + 'px)';
        });
        b.addEventListener('mouseleave', function () { b.style.transform = 'translate(0,0)'; });
      });
    }

  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// HindLight Media - improvement layer JS (playhead)
(function () {
  var ph = document.createElement('div');
  ph.id = 'hl-playhead';
  ph.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ph);
  var tick = false;
  addEventListener('scroll', function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - innerHeight;
      ph.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
      tick = false;
    });
  }, { passive: true });
})();
