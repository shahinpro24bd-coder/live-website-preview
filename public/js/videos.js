(function () {
  var warmed = false;
  function warmConnections() {
    if (warmed) return;
    warmed = true;
    ['https://www.youtube-nocookie.com', 'https://www.youtube.com', 'https://i.ytimg.com', 'https://www.google.com'].forEach(function (origin) {
      var link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      document.head.appendChild(link);
    });
  }
  var players = [];
  function command(player, name) {
    if (player.frame.contentWindow) {
      player.frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: name, args: [] }), 'https://www.youtube-nocookie.com');
    }
  }
  window.addEventListener('message', function (event) {
    if (event.origin !== 'https://www.youtube-nocookie.com') return;
    var data;
    try { data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data; } catch (_) { return; }
    var player = players.find(function (item) { return item.frame.contentWindow === event.source; });
    if (!player || !data) return;
    if (data.event === 'onReady' || data.event === 'initialDelivery' || data.event === 'infoDelivery') {
      player.ready = true;
      if (player.requested && !player.started) command(player, 'playVideo');
    }
    if (data.info && data.info.playerState === 1) player.started = true;
  });
  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.dispatchEvent(new Event('prepare-video'));
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px 0px' }) : null;
  document.querySelectorAll('.ytlite').forEach(function (el) {
    var player;
    function prepare() {
      if (player) return;
      warmConnections();
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + el.dataset.yt + '?autoplay=0&rel=0&enablejsapi=1&origin=' + encodeURIComponent(window.location.origin);
      frame.title = el.getAttribute('aria-label') || 'YouTube video';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.style.visibility = 'hidden';
      frame.style.pointerEvents = 'none';
      frame.setAttribute('frameborder', '0');
      player = { frame: frame, ready: false, requested: false, started: false };
      players.push(player);
      frame.addEventListener('load', function () {
        if (frame.contentWindow) frame.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: el.dataset.yt }), 'https://www.youtube-nocookie.com');
        if (player.requested) command(player, 'playVideo');
      });
      el.appendChild(frame);
    }
    el.addEventListener('prepare-video', prepare, { once: true });
    el.addEventListener('pointerenter', prepare, { once: true });
    el.addEventListener('focus', prepare, { once: true });
    el.addEventListener('touchstart', prepare, { once: true, passive: true });
    el.addEventListener('pointerenter', warmConnections, { once: true });
    el.addEventListener('focus', warmConnections, { once: true });
    el.addEventListener('touchstart', warmConnections, { once: true, passive: true });
    function play() {
      if (el.dataset.loaded) return;
      prepare();
      el.dataset.loaded = '1';
      player.requested = true;
      player.frame.style.visibility = 'visible';
      player.frame.style.pointerEvents = 'auto';
      el.replaceChildren(player.frame);
      if (player.ready) command(player, 'playVideo');
      else player.frame.src = player.frame.src.replace('autoplay=0', 'autoplay=1');
    }
    el.addEventListener('click', play);
    el.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        play();
      }
    });
  });
})();