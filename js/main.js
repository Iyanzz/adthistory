/* ============================================
   AdthiStory — Shared JavaScript
   Mobile nav · Slideshow · Gallery filter · Lightbox
   ============================================ */

// ---------- Mobile navigation toggle ----------
(function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close menu after clicking a link
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    })
  );
})();

// ---------- Detail page slideshow ----------
(function initSlideshow() {
  const show = document.querySelector('.slideshow');
  if (!show) return;

  const slides = show.querySelectorAll('.slide');
  const dots = show.querySelectorAll('.slide-dot');
  const thumbs = document.querySelectorAll('.slide-thumb');
  let current = 0;
  let timer = null;

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    thumbs.forEach((t, idx) => t.classList.toggle('active', idx === current));
  }

  function restartAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  const prev = show.querySelector('.slide-prev');
  const next = show.querySelector('.slide-next');
  if (prev) prev.addEventListener('click', () => { goTo(current - 1); restartAuto(); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); restartAuto(); });
  dots.forEach((d, idx) => d.addEventListener('click', () => { goTo(idx); restartAuto(); }));
  thumbs.forEach((t, idx) => t.addEventListener('click', () => { goTo(idx); restartAuto(); }));

  goTo(0);
  restartAuto();
})();

// ---------- Gallery filter tabs ----------
(function initGalleryFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('.gallery-grid .gallery-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      items.forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });
})();

// ---------- Lightbox (click any gallery image) ----------
(function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Build lightbox element once
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-label', 'Pratinjau foto');
  lb.innerHTML =
    '<button class="lightbox-close" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>' +
    '<img src="" alt="">' +
    '<div class="lightbox-caption"></div>';
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('img');
  const lbCaption = lb.querySelector('.lightbox-caption');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption || 'Foto dekorasi AdthiStory';
    lbCaption.textContent = caption || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const img = item.querySelector('img');
      if (!img) return;
      // Use a larger version if available via data-full, else the same src
      const src = item.dataset.full || img.src;
      const tagEl = item.querySelector('.gallery-tag');
      openLightbox(src, tagEl ? tagEl.textContent : img.alt);
    });
  });

  lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
})();
