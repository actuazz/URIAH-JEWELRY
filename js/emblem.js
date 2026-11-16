/* VRIAH emblem field, carried over from the URIAH emblem study:
   a slow-drifting lattice of VA monograms, diamonds and points. Move across it to lift the
   nearby marks; tap or click to send a ripple. Each <canvas data-emblem="light|dark"> gets one. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const va = new Image(); va.src = 'img/logo/monogram.svg';
  let paused = reduce;
  const tinted = {};
  function tint(color) {                       // the monogram drawn in any colour, at 2x for sharpness
    if (tinted[color]) return tinted[color];
    const c = document.createElement('canvas'); c.width = 120; c.height = Math.round(120 * 896 / 1496);
    const x = c.getContext('2d'); x.drawImage(va, 0, 0, c.width, c.height);
    x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    return (tinted[color] = c);
  }
  const PAL = {
    light: { mono: '#0D0C0B', diamond: '#B49A69', dot: '#B49A69', alpha: 0.13, threads: false },
    dark: { mono: '#E0A84C', diamond: '#B49A69', dot: '#EFEAE2', alpha: 0.24, threads: true }
  };
  function field(canvas) {
    const pal = PAL[canvas.dataset.emblem] || PAL.light, alpha = pal.alpha;
    const ctx = canvas.getContext('2d');
    const GAP = 116;
    let w = 0, h = 0, dpr = 1, items = [], t0 = performance.now(), drift = 0, visible = false, running = false;
    const ptr = { x: -1e4, y: -1e4, on: false }, ripples = [];
    function layout() {
      dpr = Math.min(2, devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      items = [];
      const cols = Math.ceil(w / GAP) + 3, rows = Math.ceil(h / (GAP * .5)) + 3;
      for (let r = -1; r < rows; r++) for (let c = -1; c < cols; c++) {
        const kind = ((r % 3) + 3) % 3 === 0 ? 0 : (((r + c) % 2 === 0) ? 1 : 2);   // rows of monograms, then diamonds and points
        items.push({ bx: c * GAP + (r % 2 ? GAP / 2 : 0), by: r * GAP * .5, kind, rot: 0, s: 1, a: alpha });
      }
      kick();
    }
    function draw(now) {
      if (!visible) { running = false; return; }
      const dt = Math.min(50, now - t0); t0 = now;
      if (!paused) drift = (drift + dt * 0.012) % GAP;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      for (const rp of ripples) rp.r += dt * 0.45;
      while (ripples.length && ripples[0].r > Math.hypot(w, h)) ripples.shift();
      if (pal.threads) {                         // fine diagonal threads woven through the lattice
        ctx.save(); ctx.globalAlpha = alpha * 0.9; ctx.lineWidth = 0.6;
        const off = drift % GAP;
        for (let k = -Math.ceil(h / GAP) - 2; k < Math.ceil(w / GAP) + 3; k++) {
          const x0 = k * GAP + off;
          ctx.strokeStyle = k % 2 ? pal.diamond : pal.mono;
          ctx.beginPath(); ctx.moveTo(x0, -GAP); ctx.lineTo(x0 + h + 2 * GAP, h + GAP); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x0 + h + GAP, -GAP); ctx.lineTo(x0 - GAP, h + GAP); ctx.stroke();
        }
        ctx.restore();
      }
      let busy = !paused || ptr.on || ripples.length > 0;
      for (const it of items) {
        const x = (it.bx + drift) % (Math.ceil(w / GAP + 2) * GAP) - GAP, y = (it.by + drift * .5) % (Math.ceil(h / (GAP * .5) + 2) * GAP * .5) - GAP * .5;
        const near = ptr.on ? Math.max(0, 1 - Math.hypot(x - ptr.x, y - ptr.y) / 170) : 0;
        let wave = 0; for (const rp of ripples) { const k = 1 - Math.abs(Math.hypot(x - rp.x, y - rp.y) - rp.r) / 60; if (k > 0) wave = Math.max(wave, k * (1 - rp.r / 900)); }
        const lift = Math.max(near, wave);
        const tr = it.kind === 1 ? lift * Math.PI / 2 : lift * 0.35, ts = 1 + lift * 0.35, ta = alpha + lift * alpha * 2.6;
        it.rot += (tr - it.rot) * 0.12; it.s += (ts - it.s) * 0.12; it.a += (ta - it.a) * 0.12;
        if (Math.abs(tr - it.rot) + Math.abs(ts - it.s) + Math.abs(ta - it.a) > 0.002) busy = true;
        ctx.save(); ctx.translate(x, y); ctx.rotate(it.rot); ctx.scale(it.s, it.s); ctx.globalAlpha = Math.min(1, it.a);
        if (it.kind === 0 && va.complete && va.naturalWidth) { const img = tint(pal.mono), W = 34, H = W * img.height / img.width; ctx.drawImage(img, -W / 2, -H / 2, W, H); }
        else if (it.kind === 1) { ctx.strokeStyle = pal.diamond; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(7, 0); ctx.lineTo(0, 9); ctx.lineTo(-7, 0); ctx.closePath(); ctx.stroke(); }
        else { ctx.fillStyle = pal.dot; ctx.beginPath(); ctx.arc(0, 0, 1.6, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
      if (busy) requestAnimationFrame(draw); else running = false;
    }
    function kick() { if (running || !visible) return; running = true; t0 = performance.now(); requestAnimationFrame(draw); }
    canvas.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.on = true; kick(); });
    canvas.addEventListener('pointerleave', () => { ptr.on = false; kick(); });
    canvas.addEventListener('pointerdown', e => { const r = canvas.getBoundingClientRect(); if (!reduce) { ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0 }); kick(); } });
    new IntersectionObserver(es => { visible = es[0].isIntersecting; kick(); }).observe(canvas);
    new ResizeObserver(layout).observe(canvas);
    field.kicks.push(kick);
  }
  field.kicks = [];
  const start = () => document.querySelectorAll('canvas[data-emblem]').forEach(field);
  va.complete ? start() : (va.addEventListener('load', start, { once: true }), va.addEventListener('error', start, { once: true }));
  document.querySelectorAll('[data-emblem-pause]').forEach(btn => {
    const label = () => { btn.textContent = paused ? 'Play motion' : 'Pause motion'; btn.setAttribute('aria-pressed', String(paused)); };
    label();
    btn.addEventListener('click', () => { paused = !paused; label(); field.kicks.forEach(k => k()); });
  });
})();
