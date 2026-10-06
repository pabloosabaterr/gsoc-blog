// Highlights the section you are reading in the side contents.
// The page works the same without it; this only adds the moving marker.
(function () {
  var rail = document.querySelector('.toc-rail');
  if (!rail || !('IntersectionObserver' in window)) return;
  var links = Array.prototype.slice.call(rail.querySelectorAll('a[href^="#"]'));
  var byId = {};
  links.forEach(function (a) { byId[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
  var heads = Array.prototype.slice.call(document.querySelectorAll('.prose h2[id], .prose h3[id]'))
    .filter(function (h) { return byId[h.id]; });
  if (!heads.length) return;

  var tops = Array.prototype.slice.call(rail.querySelectorAll('#TableOfContents > ul > li'));
  var current = null;
  function setActive(id) {
    if (id === current) return;
    current = id;
    links.forEach(function (a) { a.classList.remove('active'); });
    tops.forEach(function (li) { li.classList.remove('open'); });
    var a = byId[id];
    if (!a) return;
    a.classList.add('active');
    var top = a.closest('.toc-rail > nav > ul > li, #TableOfContents > ul > li');
    if (top) top.classList.add('open');
  }

  function update() {
    var y = window.innerHeight * 0.3, last = heads[0].id;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top - y <= 0) last = heads[i].id; else break;
    }
    if (heads[0].getBoundingClientRect().top > window.innerHeight) last = null;
    setActive(last);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
  rail.classList.add('ready');
})();
