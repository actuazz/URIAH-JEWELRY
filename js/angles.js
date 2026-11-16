/* VRIAH angle viewer: one frame per piece. Drag sideways (or use the labels / arrow keys)
   to move between real photographs of the same ring; "Details" fades in VRIAH's labelled version
   of the same shot where one exists. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function build(root, piece, imgPath) {
    const views = piece.views, anno = piece.anno || {};
    const n = views.length;
    root.classList.add('av');
    root.innerHTML = `
      <div class="av-stage" tabindex="0" role="group" aria-roledescription="angle viewer" aria-label="${piece.name}: ${n} view${n > 1 ? 's' : ''}${n > 1 ? '. Drag sideways or use the arrow keys to change the angle.' : ''}">
        <div class="av-strip">${views.map(([im, label], i) => `
          <figure class="av-view" data-i="${i}">
            <img src="${imgPath(im)}" alt="${piece.name}, ${label.toLowerCase()}" ${i ? 'loading="lazy"' : ''} draggable="false">
            ${anno[im] ? `<img class="av-anno" src="${imgPath(anno[im])}" alt="${piece.name}, ${label.toLowerCase()}, with labels: ${piece.anatomy.join(', ')}" loading="lazy" draggable="false">` : ''}
          </figure>`).join('')}</div>
        ${n > 1 ? '<span class="av-hint" aria-hidden="true">Drag to turn</span>' : ''}
      </div>
      <div class="av-bar">
        <div class="av-labels" role="tablist" aria-label="Views">${views.map(([, label], i) => `<button role="tab" data-go="${i}">${label}</button>`).join('')}</div>
        ${n > 1 ? '<div class="av-track" aria-hidden="true"><i></i></div>' : ''}
        <button class="av-detail" aria-pressed="false" hidden><span class="av-dot"></span>Details</button>
      </div>`;
    const stage = root.querySelector('.av-stage');
    const els = [...root.querySelectorAll('.av-view')];
    const strip = root.querySelector('.av-strip');
    const tabs = [...root.querySelectorAll('[data-go]')];
    const thumb = root.querySelector('.av-track i');
    const det = root.querySelector('.av-detail');
    let pos = 0, target = 0, showAnno = false, raf = 0;

    function paint() {
      strip.style.transform = `translate3d(${(-pos * 100).toFixed(3)}%,0,0)`;
      els.forEach((el, i) => {
        const an = el.querySelector('.av-anno');
        if (an) an.style.opacity = showAnno && Math.round(pos) === i ? 1 : 0;
      });
      const cur = Math.round(pos);
      tabs.forEach((t, i) => t.setAttribute('aria-selected', i === cur));
      if (thumb) { thumb.style.width = (100 / n) + '%'; thumb.style.transform = `translateX(${(pos * 100).toFixed(1)}%)`; }
      const has = !!anno[views[cur][0]];
      det.hidden = !has;
      det.setAttribute('aria-pressed', showAnno && has);
    }
    function animate() {
      cancelAnimationFrame(raf);
      const step = () => {
        pos += (target - pos) * (reduce ? 1 : .18);
        if (Math.abs(target - pos) < .002) pos = target;
        paint();
        if (pos !== target) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    const go = i => { target = Math.max(0, Math.min(n - 1, i)); animate(); };
    tabs.forEach(t => t.addEventListener('click', () => go(+t.dataset.go)));
    det.addEventListener('click', () => { showAnno = !showAnno; paint(); });

    if (n > 1) {
      let down = false, sx = 0, sy = 0, start = 0, locked = null;
      stage.style.touchAction = 'pan-y';
      stage.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sy = e.clientY; start = pos; locked = null; cancelAnimationFrame(raf); });
      stage.addEventListener('pointermove', e => {
        if (!down) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (locked === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
          locked = Math.abs(dx) > Math.abs(dy);
          if (locked) { stage.setPointerCapture(e.pointerId); root.classList.add('touched', 'dragging'); }
        }
        if (!locked) return;
        pos = Math.max(-.12, Math.min(n - .88, start - dx / stage.clientWidth));
        target = pos; paint();
      });
      const end = () => { if (!down) return; down = false; root.classList.remove('dragging'); if (locked) go(Math.round(pos)); };
      stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
      stage.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.round(target) + 1); root.classList.add('touched'); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.round(target) - 1); root.classList.add('touched'); }
      });
    }
    paint();
  }

  window.VRIAH_ANGLES = build;
})();
