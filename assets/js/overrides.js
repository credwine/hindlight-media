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

/* Micro-interaction layer: magnetic hero buttons only. Scroll-reveal
   fade-ins were removed (they made the site feel slow); content now
   renders instantly. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function init() {
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

/* Inject a "Services" nav item (-> video-services hub) into both the desktop
   and mobile Squarespace menus, so the SEO landing pages are reachable from
   the menu on every page. Idempotent; matches native SS markup. */
(function () {
  function init() {
    // desktop
    var list = document.querySelector('.header-nav-list');
    if (list && !list.querySelector('a[href="video-services"]')) {
      var after = null;
      list.querySelectorAll('.header-nav-item > a').forEach(function (a) {
        if (a.getAttribute('href') === 'our-work') after = a.parentElement;
      });
      var item = document.createElement('div');
      item.className = 'header-nav-item header-nav-item--collection';
      item.innerHTML = '<a href="video-services">Services</a>';
      if (after && after.nextSibling) list.insertBefore(item, after.nextSibling);
      else if (after) list.appendChild(item);
      else list.appendChild(item);
    }
    // mobile
    var mwrap = document.querySelector('.header-menu-nav-wrapper');
    if (mwrap && !mwrap.querySelector('a[href="video-services"]')) {
      var mafter = null;
      mwrap.querySelectorAll('.header-menu-nav-item > a').forEach(function (a) {
        if (a.getAttribute('href') === 'our-work') mafter = a.parentElement;
      });
      var mitem = document.createElement('div');
      mitem.className = 'container header-menu-nav-item header-menu-nav-item--collection';
      mitem.innerHTML = '<a href="video-services"><div class="header-menu-nav-item-content">Services</div></a>';
      if (mafter && mafter.nextSibling) mwrap.insertBefore(mitem, mafter.nextSibling);
      else if (mafter) mwrap.appendChild(mitem);
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
