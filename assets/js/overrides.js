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
