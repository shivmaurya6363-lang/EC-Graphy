(function () {
  function pinFooterToEnd() {
    var footer = document.querySelector('.footer-new-at-last');
    if (!footer) return;
    if (document.body.lastElementChild !== footer) {
      document.body.appendChild(footer);
    }
  }
  function start() {
    pinFooterToEnd();
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length) {
          pinFooterToEnd();
          break;
        }
      }
    });
    observer.observe(document.body, { childList: true });
  }
  if (document.body) {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start);
  }
  window.addEventListener('load', pinFooterToEnd);
})();

(function () {
  function init() {
    (function () {
      document.addEventListener('click', function (e) {
        var trigger = e.target.closest ? e.target.closest('.faq-trigger') : null;
        if (!trigger) return;
        var item = trigger.closest('.faq-item');
        if (!item) return;
        var answer = item.querySelector('.faq-answer');
        if (!answer) return;
        var isOpen = item.classList.contains('is-open');
        if (isOpen) {
          item.classList.remove('is-open');
          answer.style.setProperty('display', 'none', 'important');
        } else {
          item.classList.add('is-open');
          answer.style.setProperty('display', 'block', 'important');
        }
      }, true);
    })();
    /* ── CONSULTATION FORM: mailto with field data ── */
    (function () {
      var btn = document.getElementById('consult-submit');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var v = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
        var body = 'Name: ' + v('consult-name') +
          '\nPhone: ' + v('consult-phone') +
          '\nEmail: ' + v('consult-email') +
          '\nPlace: ' + v('consult-place') +
          '\nMessage: ' + v('consult-message');
        window.location.href = 'mailto:Academy@ellementco.com' +
          '?subject=' + encodeURIComponent('Free Consultation Request') +
          '&body=' + encodeURIComponent(body);
      });
    })();
    /* ── HERO CAROUSEL ── */
    (function () {
      const carousel = document.getElementById('heroCarousel');
      const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
      const dotsWrap = document.getElementById('heroDots');
      const total = slides.length;
      let current = 0, autoplayTimer = null;
      const AUTOPLAY_MS = 4000;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'dot';
        d.setAttribute('aria-label', 'Slide ' + (i + 1));
        d.addEventListener('click', () => { goTo(i); restartAutoplay(); });
        dotsWrap.appendChild(d);
      });
      const dots = Array.from(dotsWrap.children);
      function render() {
        slides.forEach((slide, i) => {
          slide.classList.remove('is-active','is-prev','is-next','is-far-prev','is-far-next','is-hidden');
          const prev = (current - 1 + total) % total;
          const next = (current + 1) % total;
          const farPrev = (current - 2 + total) % total;
          const farNext = (current + 2) % total;
          if (i === current) slide.classList.add('is-active');
          else if (i === prev) slide.classList.add('is-prev');
          else if (i === next) slide.classList.add('is-next');
          else if (total > 4 && i === farPrev) slide.classList.add('is-far-prev');
          else if (total > 4 && i === farNext) slide.classList.add('is-far-next');
          else slide.classList.add('is-hidden');
          const v = slide.querySelector('video');
          if (v) {
            if (i === current) { v.play().catch(()=>{}); }
            else {
              v.pause(); v.muted = true;
              const b = slide.querySelector('.sound-btn');
              if (b) {
                const p = b.querySelector('.icon-play'), vol = b.querySelector('.icon-volume');
                if (p) p.style.display = '';
                if (vol) vol.style.display = 'none';
                b.classList.remove('faded');
              }
            }
          }
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }
      function goTo(i) { current = (i + total) % total; render(); }
      function startAutoplay() { if (!reduced) autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS); }
      function restartAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }
      slides.forEach(slide => {
        slide.addEventListener('click', () => {
          if (slide.classList.contains('is-prev')) { goTo(current - 1); restartAutoplay(); }
          else if (slide.classList.contains('is-next')) { goTo(current + 1); restartAutoplay(); }
          else if (slide.classList.contains('is-far-prev')) { goTo(current - 2); restartAutoplay(); }
          else if (slide.classList.contains('is-far-next')) { goTo(current + 2); restartAutoplay(); }
        });
      });
      let startX = null;
      carousel.addEventListener('pointerdown', e => { startX = e.clientX; });
      window.addEventListener('pointerup', e => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 40) { dx < 0 ? goTo(current+1) : goTo(current-1); restartAutoplay(); }
        startX = null;
      });
      let wheelLock = false;
      carousel.addEventListener('wheel', e => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        if (wheelLock) return;
        wheelLock = true;
        e.deltaX > 0 ? goTo(current+1) : goTo(current-1);
        restartAutoplay();
        setTimeout(() => { wheelLock = false; }, 500);
      }, { passive: false });
      carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
      carousel.addEventListener('mouseleave', restartAutoplay);
      render(); startAutoplay();
    })();
    /* ── HERO VIDEO SOUND TOGGLE ── */
    (function() {
      var fadeTimers = new WeakMap();
      function startFade(btn) {
        clearTimeout(fadeTimers.get(btn));
        var t = setTimeout(function() { btn.classList.add('faded'); }, 1000);
        fadeTimers.set(btn, t);
      }
      function cancelFade(btn) {
        clearTimeout(fadeTimers.get(btn));
        btn.classList.remove('faded');
      }
      document.addEventListener('click', function(e) {
        var btn = e.target.closest ? e.target.closest('.hero-slide .sound-btn') : null;
        if (!btn) return;
        e.preventDefault(); e.stopPropagation();
        var box = btn.closest('.hero-slide');
        if (!box) return;
        var vid = box.querySelector('.hero-video');
        if (!vid) return;
        var wasMuted = vid.muted;
        document.querySelectorAll('.hero-slide').forEach(function(b) {
          var v2  = b.querySelector('.hero-video');
          var b2  = b.querySelector('.sound-btn');
          if (!v2 || !b2) return;
          v2.muted = true;
          b2.querySelector('.icon-play').style.display   = '';
          b2.querySelector('.icon-volume').style.display = 'none';
          cancelFade(b2);
        });
        if (wasMuted) {
          vid.muted = false;
          btn.querySelector('.icon-play').style.display   = 'none';
          btn.querySelector('.icon-volume').style.display = '';
          startFade(btn);
        }
      }, true);
      document.addEventListener('mouseover', function(e) {
        var box = e.target.closest ? e.target.closest('.hero-slide') : null;
        if (!box) return;
        var btn = box.querySelector('.sound-btn');
        if (!btn) return;
        cancelFade(btn);
      }, true);
      document.addEventListener('mouseout', function(e) {
        var box = e.target.closest ? e.target.closest('.hero-slide') : null;
        if (!box) return;
        var btn = box.querySelector('.sound-btn');
        var vid = box.querySelector('.hero-video');
        if (!btn || !vid) return;
        if (!vid.muted) startFade(btn);
      }, true);
    })();
    /* ── FOUNDER VIDEO SOUND TOGGLE ── */
    (function() {
      var video = document.querySelector('.founder-video');
      if (!video) return;
      video.play().catch(function(){});
      var fadeTimers = new WeakMap();
      function startFade(btn) {
        clearTimeout(fadeTimers.get(btn));
        var t = setTimeout(function() { btn.classList.add('faded'); }, 1000);
        fadeTimers.set(btn, t);
      }
      function cancelFade(btn) {
        clearTimeout(fadeTimers.get(btn));
        btn.classList.remove('faded');
      }
      document.addEventListener('click', function(e) {
        var btn = e.target.closest ? e.target.closest('.media-block .sound-btn') : null;
        if (!btn) return;
        e.preventDefault(); e.stopPropagation();
        var box = btn.closest('.media-block');
        if (!box) return;
        var vid = box.querySelector('.founder-video');
        if (!vid) return;
        var wasMuted = vid.muted;
        if (wasMuted) {
          vid.muted = false;
          btn.querySelector('.icon-play').style.display   = 'none';
          btn.querySelector('.icon-volume').style.display = '';
          startFade(btn);
        } else {
          vid.muted = true;
          btn.querySelector('.icon-play').style.display   = '';
          btn.querySelector('.icon-volume').style.display = 'none';
          cancelFade(btn);
        }
      }, true);
      document.addEventListener('mouseover', function(e) {
        var box = e.target.closest ? e.target.closest('.media-block') : null;
        if (!box) return;
        var btn = box.querySelector('.sound-btn');
        if (!btn) return;
        cancelFade(btn);
      }, true);
      document.addEventListener('mouseout', function(e) {
        var box = e.target.closest ? e.target.closest('.media-block') : null;
        if (!box) return;
        var btn = box.querySelector('.sound-btn');
        var vid = box.querySelector('.founder-video');
        if (!btn || !vid) return;
        if (!vid.muted) startFade(btn);
      }, true);
    })();
    /* ── COURSES CAROUSEL + FILTER ── */
    (function () {
      const track = document.getElementById('courseCarousel');
      const dotsWrap = document.getElementById('courseDots');
      if (!track || !dotsWrap) return;
      const allCards = Array.from(track.children);
      const perView = () => 2;
      const visibleCards = () => allCards.filter(c => c.style.display !== 'none');
      const pages = () => Math.max(1, Math.ceil(visibleCards().length / perView()));
      // Measure the exact scroll position of a card's left edge (accounts for
      // padding/gap precisely, using real rendered geometry — no peeking).
      function cardScrollLeft(card) {
        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const paddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        return track.scrollLeft + (cardRect.left - trackRect.left) - paddingLeft;
      }
      function scrollToPage(i) {
        const visible = visibleCards();
        const card = visible[i * perView()];
        const target = card ? Math.max(0, cardScrollLeft(card)) : 0;
        track.scrollTo({ left: target, behavior: 'smooth' });
      }
      function currentPage() {
        const visible = visibleCards();
        let best = 0, bestDiff = Infinity;
        for (let i = 0; i < pages(); i++) {
          const card = visible[i * perView()];
          if (!card) continue;
          const diff = Math.abs(cardScrollLeft(card) - track.scrollLeft);
          if (diff < bestDiff) { bestDiff = diff; best = i; }
        }
        return best;
      }
      function buildDots() {
        dotsWrap.innerHTML = '';
        const n = pages();
        if (n <= 1) { dotsWrap.style.display = 'none'; return; }
        dotsWrap.style.display = 'flex';
        for (let i = 0; i < n; i++) {
          const d = document.createElement('button');
          d.className = 'dot';
          d.setAttribute('aria-label', 'Page ' + (i + 1));
          d.addEventListener('click', () => scrollToPage(i));
          dotsWrap.appendChild(d);
        }
        update();
      }
      function update() {
        const page = currentPage();
        Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === page));
      }
      track.addEventListener('scroll', () => requestAnimationFrame(update));
      window.addEventListener('resize', buildDots);
      buildDots();
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter || 'all';
          allCards.forEach(card => {
            const cats = (card.dataset.category || '').split(' ');
            const show = filter === 'all' || cats.includes(filter);
            card.style.display = show ? '' : 'none';
          });
          track.scrollTo({ left: 0, behavior: 'auto' });
          buildDots();
        });
      });
    })();
    /* ── MINI KITS SLIDER ── */
    (function () {
      const track   = document.getElementById('mkTrack');
      const dotsWrap = document.getElementById('mkDots');
      const btnPrev  = document.getElementById('mkPrev');
      const btnNext  = document.getElementById('mkNext');
      if (!track) return;
      const kits = Array.from(track.children);
      const total = kits.length;
      let current = 0;
      function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        if (window.innerWidth > 600) { dotsWrap.style.display = 'none'; return; }
        dotsWrap.style.display = 'flex';
        kits.forEach((_, i) => {
          const d = document.createElement('button');
          d.className = 'dot' + (i === 0 ? ' active' : '');
          d.setAttribute('aria-label', 'Kit ' + (i + 1));
          d.addEventListener('click', () => goTo(i));
          dotsWrap.appendChild(d);
        });
      }
      function updateDots() {
        if (!dotsWrap) return;
        Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === current));
      }
      function goTo(i) {
        current = ((i % total) + total) % total;
        const w = kits[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + (current * w) + 'px)';
        updateDots();
        btnPrev.disabled = false;
        btnNext.disabled = false;
      }
      if (btnPrev) btnPrev.addEventListener('click', () => goTo(current - 1));
      if (btnNext) btnNext.addEventListener('click', () => goTo(current + 1));
      window.addEventListener('resize', () => goTo(current));
      buildDots();
      goTo(0);
    })();
    /* ── TESTIMONIALS CAROUSEL ── */
    (function() {
      var viewport = document.getElementById('testViewport');
      var track    = document.getElementById('testGrid');
      var dotsWrap = document.getElementById('testDots');
      var btnPrev  = document.getElementById('testPrev');
      var btnNext  = document.getElementById('testNext');
      if (!viewport || !track) return;
      var current = 0;
      function getBoxes()  { return Array.from(track.children); }
      function visible()   { return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3; }
      function getGap()    { return 28; }
      function boxW()      { var vw = viewport.clientWidth; var n = visible(); return (vw - getGap() * (n - 1)) / n + getGap(); }
      function maxSlide()  { return Math.max(0, getBoxes().length - visible()); }
      function moveTo(i) {
        current = Math.max(0, Math.min(i, maxSlide()));
        track.style.transform = 'translateX(-' + (current * boxW()) + 'px)';
        if (dotsWrap) Array.from(dotsWrap.children).forEach(function(d,i){ d.classList.toggle('active', i===current); });
        if (btnPrev) btnPrev.disabled = current <= 0;
        if (btnNext) btnNext.disabled = current >= maxSlide();
      }
      function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        var pages = maxSlide() + 1;
        if (pages <= 1) { dotsWrap.style.display = 'none'; return; }
        dotsWrap.style.display = 'flex';
        for (var i = 0; i < pages; i++) {
          (function(n){ var d = document.createElement('button'); d.className='dot'; d.addEventListener('click', function(){ moveTo(n); }); dotsWrap.appendChild(d); })(i);
        }
      }
      if (btnPrev) btnPrev.addEventListener('click', function(){ moveTo(current-1); });
      if (btnNext) btnNext.addEventListener('click', function(){ moveTo(current+1); });
      getBoxes().forEach(function(box) {
        var v = box.querySelector('.test-video');
        if (v) { v.muted = true; v.play().catch(function(){}); }
      });
      window.addEventListener('resize', function(){ buildDots(); moveTo(current); });
      buildDots(); moveTo(0);
    })();
    /* ── SOUND TOGGLE (testimonials) ── */
    (function() {
      var fadeTimers = new WeakMap();
      function startFade(btn) {
        clearTimeout(fadeTimers.get(btn));
        var t = setTimeout(function() { btn.classList.add('faded'); }, 1000);
        fadeTimers.set(btn, t);
      }
      function cancelFade(btn) {
        clearTimeout(fadeTimers.get(btn));
        btn.classList.remove('faded');
      }
      document.addEventListener('click', function(e) {
        var btn = e.target.closest ? e.target.closest('.sound-btn') : null;
        if (!btn) return;
        e.preventDefault(); e.stopPropagation();
        var box = btn.closest('.test-box');
        if (!box) return;
        var vid = box.querySelector('.test-video');
        if (!vid) return;
        var wasMuted = vid.muted;
        document.querySelectorAll('.test-box').forEach(function(b) {
          var v2  = b.querySelector('.test-video');
          var b2  = b.querySelector('.sound-btn');
          if (!v2 || !b2) return;
          v2.muted = true;
          b2.querySelector('.icon-play').style.display   = '';
          b2.querySelector('.icon-volume').style.display = 'none';
          cancelFade(b2);
        });
        if (wasMuted) {
          vid.muted = false;
          btn.querySelector('.icon-play').style.display   = 'none';
          btn.querySelector('.icon-volume').style.display = '';
          startFade(btn);
        }
      }, true);
      document.addEventListener('mouseover', function(e) {
        var box = e.target.closest ? e.target.closest('.test-box') : null;
        if (!box) return;
        var btn = box.querySelector('.sound-btn');
        if (!btn) return;
        cancelFade(btn);
      }, true);
      document.addEventListener('mouseout', function(e) {
        var box = e.target.closest ? e.target.closest('.test-box') : null;
        if (!box) return;
        var btn = box.querySelector('.sound-btn');
        var vid = box.querySelector('.test-video');
        if (!btn || !vid) return;
        if (!vid.muted) startFade(btn);
      }, true);
    })();
    /* ── ANNOUNCEMENT BAR ── */
    (function () {
      var track = document.getElementById('topBarTrack');
      if (!track) return;
      var total = track.children.length;
      var real = total - 1;
      var index = 0;
      function goNext() {
        index++;
        track.style.transition = 'transform 0.6s ease';
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        if (index === real) {
          setTimeout(function () {
            track.style.transition = 'none';
            index = 0;
            track.style.transform = 'translateX(0%)';
          }, 620);
        }
      }
      setInterval(goNext, 2000);
    })();
    /* ── FIX: force course-card images to stay static ── */
    (function () {
      function fixCardImages() {
        document.querySelectorAll('.courses-section .card-image, .courses-section .card-image img')
          .forEach(function (el) {
            el.style.setProperty('position', 'static', 'important');
            el.style.removeProperty('top');
            el.style.removeProperty('left');
          });
      }
      fixCardImages();
      document.addEventListener('DOMContentLoaded', fixCardImages);
      var mo = new MutationObserver(fixCardImages);
      var target = document.querySelector('.courses-section') || document.body;
      mo.observe(target, { attributes: true, subtree: true, attributeFilter: ['style', 'class'] });
    })();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
