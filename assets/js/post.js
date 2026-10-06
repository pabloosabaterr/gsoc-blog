// Small enhancements for posts: copy buttons on code blocks and zoomable images.
// Everything here is optional; without it the page reads the same.
(function () {
  // Copy buttons
  document.querySelectorAll('.codeblock').forEach(function (block) {
    var btn = block.querySelector('.copy');
    var code = block.querySelector('pre code') || block.querySelector('pre');
    if (!btn || !code || !navigator.clipboard) return;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(code.innerText.replace(/\n$/, '')).then(function () {
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1600);
      }).catch(function () { btn.textContent = 'Press Ctrl+C'; });
    });
  });

  // Zoomable images
  var imgs = document.querySelectorAll('.prose figure img[data-zoom]');
  if (!imgs.length) return;
  var overlay = document.createElement('div');
  overlay.className = 'zoom';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Enlarged image');
  overlay.innerHTML = '<img alt=""><p class="zoom-hint">Click anywhere or press Esc to close</p>';
  document.body.appendChild(overlay);
  var big = overlay.querySelector('img');
  var last = null;

  function open(img) {
    last = img;
    big.src = img.getAttribute('data-zoom');
    big.alt = img.alt;
    overlay.classList.add('open');
    document.documentElement.classList.add('zoom-lock');
    overlay.focus();
  }
  function close() {
    overlay.classList.remove('open');
    document.documentElement.classList.remove('zoom-lock');
    if (last) last.focus();
  }
  overlay.tabIndex = -1;
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
  imgs.forEach(function (img) {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Enlarge image: ' + img.alt);
    img.classList.add('zoomable');
    img.addEventListener('click', function () { open(img); });
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
  });
})();
