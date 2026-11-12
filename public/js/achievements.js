(function () {
  function boot() {
    var section = document.getElementById('recent-achievement');
    if (!section) return;
    var links = Array.prototype.slice.call(section.querySelectorAll('[data-achv-index]'));
    var lb = section.querySelector('.achv-lb');
    document.documentElement.appendChild(lb);
    var img = lb.querySelector('img');
    var cap = lb.querySelector('figcaption');
    var current = 0;

    function caption(link) {
      var span = link.querySelector('span:not(.achv__ribbon)');
      return span ? span.textContent : link.querySelector('img').alt;
    }
    function show(i) {
      current = (i + links.length) % links.length;
      var link = links[current];
      img.src = link.getAttribute('href');
      img.alt = link.querySelector('img').alt;
      cap.textContent = caption(link);
    }
    function open(i) {
      show(i);
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    links.forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        open(i);
      });
    });
    lb.querySelector('.achv-lb__close').addEventListener('click', close);
    lb.querySelector('.achv-lb__nav--prev').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('.achv-lb__nav--next').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
