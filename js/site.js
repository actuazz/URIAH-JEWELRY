/* Shared chrome + motion for every VRIAH page. */
(function () {
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page || '';

  /* ---------- Header & footer ---------- */
  const navItems = [['collection.html', 'Collection', 'collection'], ['atelier.html', 'Atelier', 'atelier'], ['appointment.html', 'Appointments', 'appointment']];
  const hdr = document.createElement('header');
  hdr.className = 'hdr wrap';
  hdr.innerHTML = `
    <div class="bar inner">
      <nav aria-label="Primary">${navItems.map(([h, t, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
      <button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
      <a class="wordmark" href="index.html" aria-label="VRIAH home"><span class="logo" role="img" aria-label="VRIAH"></span></a>
      <div class="util">
        <a class="hide-sm" href="piece.html#six-prong-200">CAD sheet</a>
        <a href="appointment.html" class="hide-sm">Book a viewing</a>
      </div>
    </div>`;
  const drawer = document.createElement('div');
  drawer.className = 'drawer'; drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `
    <a class="big" href="index.html">Home</a>
    ${navItems.map(([h, t]) => `<a class="big" href="${h}">${t}</a>`).join('')}
    <a class="big" href="piece.html#six-prong-200">The <em>CAD sheet</em></a>
    <p class="label">Private viewings by appointment</p>`;
  document.body.prepend(drawer);
  document.body.prepend(hdr);
  const mb = hdr.querySelector('.menu-btn');
  mb.addEventListener('click', () => {
    const open = !doc.classList.contains('menu-open');
    doc.classList.toggle('menu-open', open);
    mb.setAttribute('aria-expanded', open); drawer.setAttribute('aria-hidden', !open);
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  });

  const ftr = document.createElement('footer');
  ftr.className = 'ftr wrap';
  ftr.innerHTML = `
    <div class="inner">
      <div class="top">
        <div>
          <p class="sig">Each ring is drawn, set and finished to order.</p>
          <form id="news" novalidate>
            <label for="news-email" class="label" style="position:absolute;left:-9999px">Email</label>
            <input id="news-email" type="email" placeholder="Your email, for new pieces" autocomplete="email">
            <button class="label" type="submit" style="color:var(--ink)">Join</button>
          </form>
          <p class="label" id="news-msg" style="margin-top:14px;min-height:1em"></p>
        </div>
        <div><h4 class="label gold">Collection</h4><ul>
          <li><a href="collection.html#solitaire">Solitaires</a></li><li><a href="collection.html#halo">Halos</a></li>
          <li><a href="collection.html#trilogy">Trilogy</a></li><li><a href="collection.html#bridal">Bridal sets</a></li>
          <li><a href="collection.html#band">Bands</a></li><li><a href="collection.html#earrings">Earrings</a></li></ul></div>
        <div><h4 class="label gold">Maison</h4><ul>
          <li><a href="atelier.html">The atelier</a></li><li><a href="atelier.html#stones">Stone guide</a></li>
          <li><a href="atelier.html#anatomy">Anatomy of a ring</a></li><li><a href="atelier.html#gold">14K and 18K gold</a></li></ul></div>
        <div><h4 class="label gold">Client care</h4><ul>
          <li><a href="appointment.html">Private appointments</a></li><li><a href="atelier.html#care">Caring for your ring</a></li>
          <li><a href="atelier.html#certificates">Certificates</a></li><li><a href="atelier.html#sizing">Ring sizing</a></li></ul></div>
      </div>
      <div class="giant" aria-hidden="true"><span class="logo"></span></div>
      <div class="fine"><span>© 2026 VRIAH Fine Jewellery</span><span>Prices in Philippine peso. Made to order.</span></div>
    </div>`;
  document.body.append(ftr);
  ftr.querySelector('#news').addEventListener('submit', e => {
    e.preventDefault();
    const v = ftr.querySelector('#news-email').value.trim();
    ftr.querySelector('#news-msg').textContent = /.+@.+\..+/.test(v) ? 'Thank you. You are on the list.' : 'Enter an email address, like name@example.com.';
  });

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.25, easing: t => 1 - Math.pow(1 - t, 3.2), smoothWheel: true, wheelMultiplier: .9, touchMultiplier: 1.2 });
    window.__lenis = lenis;
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (a && a.getAttribute('href').length > 1) { const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); } }
    });
  }

  /* ---------- Header state ---------- */
  const darkHero = document.querySelector('[data-dark-hero]');
  let lastY = 0;
  function hdrState() {
    const y = window.scrollY;
    const heroH = darkHero ? darkHero.offsetHeight - 80 : 20;
    hdr.classList.toggle('on-dark', !!darkHero && y < heroH);
    hdr.classList.toggle('solid', y > (darkHero ? heroH : 20));
    hdr.classList.toggle('hide', y > 600 && y > lastY + 2 && !doc.classList.contains('menu-open'));
    if (y < lastY - 2) hdr.classList.remove('hide');
    lastY = y;
  }

  /* ---------- Parallax & focus pull ---------- */
  const para = [...document.querySelectorAll('[data-speed]')];
  const focus = [...document.querySelectorAll('[data-focus]')];
  const vh = () => window.innerHeight;
  function frame() {
    hdrState();
    if (reduce) return;
    const H = vh();
    for (const el of para) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > H + 200) continue;
      const c = (r.top + r.height / 2 - H / 2) / H; // -1..1 around centre
      el.style.transform = `translate3d(0, ${(c * parseFloat(el.dataset.speed) * 100).toFixed(2)}px, 0)`;
    }
    for (const el of focus) {
      const r = el.getBoundingClientRect();
      const d = Math.min(1, Math.abs(r.top + r.height / 2 - H / 2) / (H * .6));
      const ph = el.querySelector('.ph') || el;
      ph.style.filter = `blur(${(d * d * 3.2).toFixed(2)}px)`;
      ph.style.opacity = (1 - d * .25).toFixed(3);
    }
  }
  if (lenis) lenis.on('scroll', frame); else addEventListener('scroll', frame, { passive: true });
  addEventListener('resize', frame);
  frame();

  /* ---------- Reveal (only for things below the first screen) ---------- */
  const rv = [...document.querySelectorAll('.rv')];
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(el => { if (el.getBoundingClientRect().top > vh()) { el.classList.add('wait'); io.observe(el); } });
  }

  /* ---------- Light that follows the cursor on objects ---------- */
  document.addEventListener('pointermove', e => {
    const ph = e.target.closest && e.target.closest('.obj .ph');
    if (!ph) return;
    const r = ph.getBoundingClientRect();
    ph.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    ph.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }, { passive: true });

  window.VRIAH_UI = { lenis, refresh: frame };
})();
