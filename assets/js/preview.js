// Hover cards for links to other posts and projects on this site.
// The data comes from the page itself; nothing is fetched.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var links = document.querySelectorAll('a[data-preview-title]');
  if (!links.length) return;
  var card = document.createElement('div');
  card.className = 'lp';
  card.setAttribute('role', 'tooltip');
  card.innerHTML = '<p class="lp-k"></p><p class="lp-t"></p><p class="lp-d"></p>';
  document.body.appendChild(card);
  var k = card.querySelector('.lp-k'), t = card.querySelector('.lp-t'), d = card.querySelector('.lp-d');
  var timer = null, current = null;

  function show(a) {
    current = a;
    k.textContent = a.getAttribute('data-preview-kind') || '';
    t.textContent = a.getAttribute('data-preview-title') || '';
    d.textContent = a.getAttribute('data-preview-desc') || '';
    var r = a.getBoundingClientRect();
    card.style.left = '0px'; card.style.top = '0px';
    card.classList.add('on');
    var cw = card.offsetWidth, ch = card.offsetHeight;
    var x = Math.min(Math.max(12, r.left + r.width / 2 - cw / 2), window.innerWidth - cw - 12);
    var y = r.top - ch - 10;
    var below = y < 12;
    if (below) y = r.bottom + 10;
    card.classList.toggle('below', below);
    card.style.left = x + 'px';
    card.style.top = (y + window.scrollY) + 'px';
  }
  function hide() { clearTimeout(timer); current = null; card.classList.remove('on'); }

  links.forEach(function (a) {
    a.addEventListener('mouseenter', function () { clearTimeout(timer); timer = setTimeout(function () { show(a); }, 280); });
    a.addEventListener('mouseleave', hide);
    a.addEventListener('focus', function () { show(a); });
    a.addEventListener('blur', hide);
  });
  window.addEventListener('scroll', function () { if (current) hide(); }, { passive: true });
})();
