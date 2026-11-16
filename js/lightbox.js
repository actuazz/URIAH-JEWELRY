/* VRIAH lightbox: click any [data-lb] image to see it full screen.
   Arrows / swipe / ← → keys move through the group; click the image to zoom; Esc closes. */
(function () {
  const box = document.createElement('div');
  box.className = 'lb'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML = `
    <div class="lb-stage"><img class="lb-img" alt=""></div>
    <button class="lb-close" aria-label="Close">Close <span aria-hidden="true">✕</span></button>
    <button class="lb-prev" aria-label="Previous image"><span></span></button>
    <button class="lb-next" aria-label="Next image"><span></span></button>
    <div class="lb-bar"><p class="lb-cap"></p><p class="lb-count num"></p><p class="lb-hint">Click the image to zoom</p></div>`;
  document.body.appendChild(box);
  const stage = box.querySelector('.lb-stage'), img = box.querySelector('.lb-img');
  let list = [], i = 0, last = null;

  function show(k) {
    i = (k + list.length) % list.length;
    const it = list[i];
    stage.classList.remove('zoomed'); stage.scrollTo(0, 0);
    img.src = it.src; img.alt = it.alt;
    box.querySelector('.lb-cap').textContent = it.cap;
    box.querySelector('.lb-count').textContent = list.length > 1 ? `${i + 1} / ${list.length}` : '';
    box.classList.toggle('single', list.length < 2);
  }
  function open(el) {
    const g = el.dataset.lb;
    const els = [...document.querySelectorAll(`[data-lb="${g}"]`)];
    list = els.map(e => { const im = e.querySelector('img'); return { src: e.dataset.full || im.currentSrc || im.src, alt: im.alt, cap: e.dataset.cap || '' }; });
    last = el; box.hidden = false; document.documentElement.classList.add('lb-open');
    if (window.__lenis) window.__lenis.stop();
    show(els.indexOf(el)); box.querySelector('.lb-close').focus();
  }
  function close() {
    box.hidden = true; document.documentElement.classList.remove('lb-open');
    if (window.__lenis) window.__lenis.start();
    if (last) last.focus();
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-lb]');
    if (t && !box.contains(t)) { e.preventDefault(); open(t); }
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(i - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(i + 1));
  stage.addEventListener('click', e => {
    if (e.target !== img) { close(); return; }
    const z = !stage.classList.contains('zoomed');
    const r = img.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    stage.classList.toggle('zoomed', z);
    if (z) requestAnimationFrame(() => stage.scrollTo(fx * img.offsetWidth - stage.clientWidth / 2, fy * img.offsetHeight - stage.clientHeight / 2));
  });
  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(i + 1);
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'Tab') { // keep focus inside the viewer
      const f = [...box.querySelectorAll('button')].filter(b => b.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  let sx = null;
  stage.addEventListener('touchstart', e => { sx = stage.classList.contains('zoomed') ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); sx = null; });
})();
