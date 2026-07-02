// HindLight Media - shared behavior
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // marquee duplication
  var mq = document.getElementById('mq');
  if (mq) mq.innerHTML += mq.innerHTML;

  // hero video reduced-motion
  var hv = document.querySelector('.hero-vid');
  if (hv && reduced) { hv.removeAttribute('autoplay'); hv.pause(); }

  // burger
  var burger = document.getElementById('burger'), links = document.getElementById('navlinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  // solutions dropdown
  document.querySelectorAll('.nav-drop').forEach(function (drop) {
    var btn = drop.querySelector('button');
    btn.addEventListener('click', function () {
      var open = drop.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (!drop.contains(e.target)) { drop.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
    drop.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { drop.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  });

  // scroll playhead
  var ph = document.getElementById('playhead');
  if (ph) {
    var tick = false;
    addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - innerHeight;
        ph.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
        tick = false;
      });
    }, { passive: true });
  }

  // reveals
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // counters
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, target = parseFloat(el.dataset.target), suf = el.dataset.suffix || '', dec = parseInt(el.dataset.decimals || 0);
      cio.unobserve(el);
      if (reduced) { el.textContent = target.toFixed(dec) + suf; return; }
      var t0 = performance.now(), dur = 1600;
      (function tick2(now) {
        var p = Math.min((now - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * ease).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(tick2);
      })(t0);
    });
  }, { threshold: .5 });
  document.querySelectorAll('.count').forEach(function (el) { cio.observe(el); });

  // ROI bars
  var bio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.bar i').forEach(function (b) { b.style.width = b.dataset.w + '%'; });
      bio.unobserve(e.target);
    });
  }, { threshold: .4 });
  document.querySelectorAll('.roi').forEach(function (el) { bio.observe(el); });

  // pause other videos when one plays
  var vids = document.querySelectorAll('video[controls]');
  vids.forEach(function (v) {
    v.addEventListener('play', function () {
      vids.forEach(function (o) { if (o !== v) o.pause(); });
    });
  });
})();
