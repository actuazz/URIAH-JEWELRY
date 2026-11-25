/* Builds VRIAH price posts (1080x1350, Facebook/Instagram portrait) from js/catalog.js.
   Usage: node social/price-posts/build.js <fonts-dir>   (fonts-dir holds node_modules/@fontsource/{eb-garamond,inter})
   Prices come straight from the price sheets in js/catalog.js, so a price change there flows into every card. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
global.window = {}; require(path.join(ROOT, 'js/catalog.js'));
const V = window.VRIAH;
const FONTS = path.resolve(process.argv[2] || '.', 'node_modules/@fontsource');
const OUT = __dirname;
const LOGO = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(ROOT, 'img/logo/wordmark.svg')).toString('base64');

const peso = n => '₱' + Math.round(n).toLocaleString('en-US');
const ct = c => (c < 1 ? String(c).replace(/^0/, '') : c.toFixed(c % 1 ? 1 : 1)) + ' ct';
const img = f => 'file://' + path.join(ROOT, 'img', f + '.jpg');
const first = (p, stone) => V.tiers[p.tier][stone][0];
const row = (p, stone, carat) => V.tiers[p.tier][stone].find(r => r[0] === carat);

const font = (fam, file, w, s) => `@font-face{font-family:${fam};src:url('file://${FONTS}/${file}') format('woff2');font-weight:${w};font-style:${s}}`;
const CSS = `
${font('Garamond', 'eb-garamond/files/eb-garamond-latin-400-normal.woff2', 400, 'normal')}
${font('Garamond', 'eb-garamond/files/eb-garamond-latin-500-normal.woff2', 500, 'normal')}
${font('Garamond', 'eb-garamond/files/eb-garamond-latin-400-italic.woff2', 400, 'italic')}
${font('Garamond', 'eb-garamond/files/eb-garamond-latin-ext-400-normal.woff2', 400, 'normal')}
${font('Inter', 'inter/files/inter-latin-300-normal.woff2', 300, 'normal')}
${font('Inter', 'inter/files/inter-latin-400-normal.woff2', 400, 'normal')}
${font('Inter', 'inter/files/inter-latin-500-normal.woff2', 500, 'normal')}
${font('Inter', 'inter/files/inter-latin-ext-400-normal.woff2', 400, 'normal')}
${font('Inter', 'inter/files/inter-latin-ext-500-normal.woff2', 500, 'normal')}
:root{--ink:#0D0C0B;--paper:#F3EFE8;--gold:#C9AE7C;--mute:rgba(243,239,232,.62);--hair:rgba(201,174,124,.38)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;background:var(--ink);color:var(--paper);font-family:Inter,sans-serif;font-weight:300;-webkit-font-smoothing:antialiased}
.card{position:relative;width:1080px;height:1350px;overflow:hidden}
.photo{position:absolute;inset:0;background-size:cover;background-position:center top}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,12,11,0) 30%,rgba(13,12,11,.55) 50%,rgba(13,12,11,.93) 64%,#0D0C0B 78%)}
.body{position:absolute;left:84px;right:84px;bottom:76px}
.kicker{font-size:21px;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);font-weight:400}
h1{font-family:Garamond,serif;font-weight:400;font-size:96px;line-height:1;margin:18px 0 10px;letter-spacing:-.01em}
.sub{font-family:Garamond,serif;font-style:italic;font-size:34px;color:var(--mute)}
.prices{display:grid;grid-template-columns:repeat(3,1fr);margin-top:44px;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}
.prices>div{padding:28px 0 26px 26px;border-left:1px solid var(--hair)}
.prices>div:first-child{border-left:0;padding-left:0}
.lbl{font-size:19px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute);font-weight:400}
.from{font-size:23px;color:var(--mute);margin-top:16px}
.amt{font-family:Garamond,serif;font-size:58px;line-height:1.05;font-weight:500;font-variant-numeric:lining-nums}
.amt.hi{color:var(--gold)}
.note{font-size:23px;color:var(--mute);margin-top:12px}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:34px;font-size:24px;font-weight:400}
.foot .cta{color:var(--gold);letter-spacing:.04em}
.foot .meta{color:var(--mute)}
table{width:100%;border-collapse:collapse;margin-top:40px}
th{font-size:19px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute);font-weight:400;text-align:right;padding:0 0 16px}
th:first-child{text-align:left}
td{font-family:Garamond,serif;font-size:50px;font-weight:500;text-align:right;padding:15px 0;border-top:1px solid var(--hair);font-variant-numeric:lining-nums tabular-nums}
td:first-child{text-align:left;font-weight:400}
td.g{color:var(--gold)}
.plain{position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,#24201b 0%,#0D0C0B 62%)}
.logo{width:250px;height:64px;background:var(--paper);-webkit-mask:url('${LOGO}') center/contain no-repeat;mask:url('${LOGO}') center/contain no-repeat}
.toplogo{position:absolute;left:0;right:0;top:78px;display:flex;justify-content:center}
.band{display:grid;grid-template-columns:260px 1fr;gap:24px;padding:34px 0;border-top:1px solid var(--hair)}
.band .range{font-family:Garamond,serif;font-size:46px;font-weight:500;color:var(--gold);line-height:1.1}
.band ul{list-style:none;font-size:26px;line-height:1.6;font-weight:300}
.band b{font-weight:500}
`;

function page(inner) { return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="card">${inner}</div></body></html>`; }
const photoEl = (f, dy = 0) => `<div class="photo" style="background-image:url('${img(f)}');background-size:1080px auto;background-position:center ${dy}px"></div>`;
const toplogo = '<div class="toplogo"><div class="logo" style="width:230px;height:58px"></div></div>';
const foot = (left = 'Message us your ring size &amp; budget') =>
  `<div class="foot"><span class="cta">${left}</span><span class="meta">Made to order · Pampanga</span></div>`;

/* 1. Price card: one design, three stones, "from" prices in 14K. */
function priceCard(id, photo, dy = -250) {
  const p = V.get(id);
  const m = first(p, 'moissanite'), l = first(p, 'lab'), n = first(p, 'natural');
  return page(`${photoEl(photo, dy)}<div class="shade"></div>${dy < -100 ? toplogo : ''}
  <div class="body">
    <p class="kicker">Price guide · 14K gold</p>
    <h1>${p.name}</h1><p class="sub">${p.line}</p>
    <div class="prices">
      <div><p class="lbl">Moissanite</p><p class="from">from ${ct(m[0])}</p><p class="amt hi">${peso(m[1])}</p></div>
      <div><p class="lbl">Lab-grown</p><p class="from">from ${ct(l[0])} · IGI</p><p class="amt">${peso(l[1])}</p></div>
      <div><p class="lbl">Natural</p><p class="from">from ${ct(n[0])}</p><p class="amt">${peso(n[1])}</p></div>
    </div>
    <p class="note">Also in 18K gold, from ${peso(m[2])}. Every stone graded and certified.</p>
    ${foot()}
  </div>`);
}

/* 2. Carat ladder: lab-grown prices by size for one design, 14K and 18K. */
function ladder(id, photo) {
  const p = V.get(id), rows = V.tiers[p.tier].lab;
  return page(`${photoEl(photo, -420)}
  <div class="shade" style="background:linear-gradient(180deg,rgba(13,12,11,0) 30%,rgba(13,12,11,.8) 40%,#0D0C0B 47%)"></div>${toplogo}
  <div class="body">
    <p class="kicker">Lab-grown diamond · by carat</p>
    <h1 style="font-size:84px">${p.name}</h1><p class="sub">${p.line}, IGI-certified</p>
    <table><tr><th>Centre stone</th><th>14K gold</th><th>18K gold</th></tr>
    ${rows.map(r => `<tr><td>${r[0].toFixed(r[0] % 1 ? 1 : 1)} ct</td><td class="g">${peso(r[1])}</td><td>${peso(r[2])}</td></tr>`).join('')}</table>
    ${foot()}
  </div>`);
}

/* 3. Stone comparison at one size. */
function compare(id, photo, dy = -60) {
  const p = V.get(id), m = row(p, 'moissanite', 1), l = row(p, 'lab', 1), n = row(p, 'natural', .5);
  return page(`${photoEl(photo, dy)}<div class="shade"></div>
  <div class="body">
    <p class="kicker">Same ring · three stones</p>
    <h1 style="font-size:84px">Which stone is yours?</h1><p class="sub">${p.name}, ${p.line.toLowerCase()}, in 14K gold</p>
    <div class="prices">
      <div><p class="lbl">Moissanite</p><p class="from">1.0 ct</p><p class="amt hi">${peso(m[1])}</p></div>
      <div><p class="lbl">Lab-grown</p><p class="from">1.0 ct · IGI</p><p class="amt">${peso(l[1])}</p></div>
      <div><p class="lbl">Natural</p><p class="from">.50 ct</p><p class="amt">${peso(n[1])}</p></div>
    </div>
    <p class="note">Lab-grown is a real diamond, grown above ground. Moissanite is its own gem, brighter and lighter on the budget.</p>
    ${foot('Not sure? Message us and we will help')}
  </div>`);
}

/* 4. Budget guide: what each budget buys (matches the Messenger budget buttons). */
function budget() {
  const e = V.get('etoile'), s = V.get('silhouette'), c = V.get('celeste'), l = V.get('lumiere');
  const L = (p, carat) => row(p, 'lab', carat)[1], M = (p, carat) => row(p, 'moissanite', carat)[1];
  const bands = [
    ['Under ₱40K', [`<b>Essenza</b>, 1.0 ct moissanite · ${peso(M(e, 1))}`, `<b>Essenza</b>, .5 ct lab-grown · ${peso(L(e, .5))}`, `<b>Lirica</b>, .5 ct moissanite · ${peso(M(c, .5))}`]],
    ['₱40K – ₱60K', [`<b>Essenza</b>, 1.0 ct lab-grown · ${peso(L(e, 1))}`, `<b>Essenza</b>, 1.5 ct lab-grown · ${peso(L(e, 1.5))}`, `<b>Leggera</b>, 1.0 ct lab-grown · ${peso(L(s, 1))}`]],
    ['₱60K – ₱90K', [`<b>Essenza</b>, 2.0 ct lab-grown · ${peso(L(e, 2))}`, `<b>Luce</b> halo, 1.0 ct lab-grown · ${peso(L(l, 1))}`, `<b>Lirica</b>, 2.0 ct lab-grown · ${peso(L(c, 2))}`]],
    ['₱90K and up', [`<b>Luce</b> halo, 2.0 ct lab-grown · ${peso(L(l, 2))}`, `<b>Lirica</b>, 3.0 ct lab-grown · ${peso(L(c, 3))}`, `<b>Luce</b> halo, 3.0 ct lab-grown · ${peso(L(l, 3))}`]]
  ];
  return page(`<div class="plain"></div>
  <div class="toplogo" style="top:96px"><div class="logo"></div></div>
  <div class="body" style="top:250px;bottom:76px">
    <p class="kicker">Price guide · 14K gold</p>
    <h1 style="font-size:84px;margin-bottom:34px">What your budget buys</h1>
    ${bands.map(([r, items]) => `<div class="band"><p class="range">${r}</p><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></div>`).join('')}
    <div style="position:absolute;left:0;right:0;bottom:0">${foot()}</div>
  </div>`);
}

const jobs = [
  ['01-budget-guide', budget()],
  ['02-etoile-price', priceCard('etoile', 'p087')],
  ['03-etoile-carat-ladder', ladder('etoile', 'p087')],
  ['04-lumiere-price', priceCard('lumiere', 'p007')],
  ['05-stone-compare', compare('etreinte', 'p091')],
  ['06-celeste-price', priceCard('celeste', 'p021')],
  ['07-ligne-price', priceCard('ligne', 'p053')],
  ['08-constellation-price', priceCard('constellation', 'p070')],
  ['09-cathedrale-price', priceCard('cathedrale', 'p104')]
];

(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [name, html] of jobs) {
    const f = path.join(OUT, name + '.html'); fs.writeFileSync(f, html);
    await pg.goto('file://' + f); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 92 });
    fs.unlinkSync(f); console.log('made', name);
  }
  await b.close();
})();
