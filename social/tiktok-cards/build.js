/* VRIAH TikTok series: one ring a day, three posts a day (one grid row):
   A = the ring, B = the price (or the details), C = the feeling.
   Builds 1080x1440 JPEG cards and social/tiktok-series.json from js/catalog.js.
   Usage: node social/tiktok-cards/build.js <fonts-dir>  (fonts-dir holds node_modules/@fontsource/...) */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
global.window = {}; require(path.join(ROOT, 'js/catalog.js'));
const V = window.VRIAH;
const FONTS = path.resolve(process.argv[2] || '.', 'node_modules/@fontsource');
const OUT = __dirname;
const RAW = 'https://raw.githubusercontent.com/actuazz/URIAH-JEWELRY/main/';
const b64 = f => fs.readFileSync(f).toString('base64');
const LOGO = 'data:image/svg+xml;base64,' + b64(path.join(ROOT, 'img/logo/wordmark.svg'));
const MONO = 'data:image/svg+xml;base64,' + b64(path.join(ROOT, 'img/logo/monogram.svg'));
const SILK = 'file://' + path.join(ROOT, 'img/textures/silk.webp');
const img = f => 'file://' + path.join(ROOT, 'img', f + '.jpg');
const peso = n => '₱' + Math.round(n).toLocaleString('en-US');
const ct = c => (c < 1 ? String(c).replace(/^0/, '') : c.toFixed(1)) + ' ct';

/* Order: Eden (already started), solitaires, rings with sidestones, eternity bands, earrings. */
const ORDER = ['etreinte', 'etoile', 'six-prong-200', 'astre', 'prisme', 'blush', 'ombre', 'soleil', 'cathedrale', 'couronne', 'coeur', 'goutte', 'heritage',
  'lumiere', 'ovale', 'diademe', 'reflet', 'givre', 'clarte', 'aurore', 'celeste', 'rosee', 'aube', 'glacier', 'solene', 'clair', 'silhouette', 'lune', 'ligne', 'vrille', 'constellation', 'navette', 'emeraude', 'nocturne',
  'eternite', 'coeur-rose', 'nacre'];

const FEEL = {
  'etreinte': "The first thing you'll both look at every morning, besides each other.",
  'etoile': 'Some questions only need one word. Bring the ring that makes it easy to say.',
  'six-prong-200': 'Held from every side, like everything worth keeping.',
  'astre': "Light enough to forget you're wearing it. Impossible to forget why.",
  'prisme': 'One look, and the answer was already yes.',
  'blush': 'For the hand that shook a little when it was asked.',
  'ombre': 'Simple, because the promise is the point.',
  'soleil': 'Warm gold for the person who feels like home.',
  'cathedrale': 'Raised high, the way they make you feel.',
  'couronne': 'Four claws. One forever.',
  'coeur': 'Soft corners, for the one who softened you.',
  'goutte': 'Shaped like a tear. Made for the happy kind.',
  'heritage': 'Made today. Worn by someone you love, long after.',
  'lumiere': 'Every light in the room will find it. So will every heart.',
  'ovale': 'Two bands, one bond. Made to be worn together.',
  'diademe': 'Every love story deserves to be retold.',
  'reflet': 'It catches the light the way they caught your eye.',
  'givre': 'Calm, clear and deep. The kind of love worth kneeling for.',
  'clarte': 'Clear as the moment you knew.',
  'aurore': 'For the one who brings the light in.',
  'celeste': 'Some feelings are too big for words. This one sparkles instead.',
  'rosee': 'Rose gold or yellow, chosen together. The first of many choices.',
  'aube': 'It took one second to know. It takes a lifetime to show.',
  'glacier': 'Sparkle all the way down, because they deserve all of it.',
  'solene': 'A promise you can see every day.',
  'clair': 'Love that lets you be completely yourself.',
  'silhouette': 'Weightless on the hand. Heavy with meaning.',
  'lune': "You'll look at it the way you look at them: often.",
  'ligne': "One clean line from 'will you' to 'I will'.",
  'vrille': 'Two lives, tied together on purpose.',
  'constellation': "Three stones: where you were, where you are, where you're going.",
  'navette': 'A light to come home to.',
  'emeraude': 'Every proposal is a love letter. This one you can wear.',
  'nocturne': "For the nights you'll talk until morning.",
  'eternite': 'Stones all the way round, like being held.',
  'coeur-rose': 'Love, in its brightest colour.',
  'nacre': 'For the anniversaries, the birthdays, and the ordinary days that mattered most.'
};

/* Attention hooks for the ring post (A) come from the TikTok calendar captions. */
const oldQ = JSON.parse(fs.readFileSync(path.join(ROOT, 'social/tiktok.json'), 'utf8')).posts;
const hookFor = p => { const q = oldQ.find(x => x.theme === p.name) || (p.id === 'six-prong-200' && oldQ.find(x => x.theme === 'CAD sheet')); return q ? q.title : p.name + '.'; };

const font = (fam, file, w, s) => `@font-face{font-family:${fam};src:url('file://${FONTS}/${file}') format('woff2');font-weight:${w};font-style:${s}}`;
const CSS = `
${font('Garamond', 'eb-garamond/files/eb-garamond-latin-400-normal.woff2', 400, 'normal')}
${font('Garamond', 'eb-garamond/files/eb-garamond-latin-500-normal.woff2', 500, 'normal')}
${font('Garamond', 'eb-garamond/files/eb-garamond-latin-400-italic.woff2', 400, 'italic')}
${font('Garamond', 'eb-garamond/files/eb-garamond-latin-ext-400-normal.woff2', 400, 'normal')}
${font('Garamond', 'eb-garamond/files/eb-garamond-latin-ext-400-italic.woff2', 400, 'italic')}
${font('Inter', 'inter/files/inter-latin-300-normal.woff2', 300, 'normal')}
${font('Inter', 'inter/files/inter-latin-400-normal.woff2', 400, 'normal')}
${font('Inter', 'inter/files/inter-latin-500-normal.woff2', 500, 'normal')}
${font('Inter', 'inter/files/inter-latin-ext-400-normal.woff2', 400, 'normal')}
:root{--ink:#0D0C0B;--paper:#F3EFE8;--gold:#C9AE7C;--mute:rgba(243,239,232,.64);--hair:rgba(201,174,124,.4)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1440px;background:var(--ink);color:var(--paper);font-family:Inter,sans-serif;font-weight:300;-webkit-font-smoothing:antialiased}
.card{position:relative;width:1080px;height:1440px;overflow:hidden;background:var(--ink)}
.frame{position:absolute;inset:28px;border:1px solid var(--hair);pointer-events:none;z-index:5}
.photo{position:absolute;inset:0;background-size:cover;background-position:center 40%}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,12,11,0) 52%,rgba(13,12,11,.75) 70%,#0D0C0B 86%)}
.body{position:absolute;left:90px;right:90px;bottom:96px;z-index:4}
.kicker{font-size:22px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);font-weight:400}
h1{font-family:Garamond,serif;font-weight:400;font-size:120px;line-height:1;margin:16px 0 12px}
.sub{font-family:Garamond,serif;font-style:italic;font-size:38px;color:var(--mute)}
.prices{display:grid;grid-template-columns:repeat(3,1fr);margin-top:38px;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}
.prices>div{padding:26px 0 24px 24px;border-left:1px solid var(--hair)}
.prices>div:first-child{border-left:0;padding-left:0}
.lbl{font-size:20px;letter-spacing:.18em;text-transform:uppercase;color:var(--mute);font-weight:400}
.from{font-size:23px;color:var(--mute);margin-top:12px}
.amt{font-family:Garamond,serif;font-size:60px;line-height:1.05;font-weight:500}
.amt.hi{color:var(--gold)}
.note{font-size:24px;color:var(--mute);margin-top:16px}
ul.det{list-style:none;margin-top:34px;border-top:1px solid var(--hair)}
ul.det li{font-size:30px;padding:16px 0;border-bottom:1px solid var(--hair)}
.foot{display:flex;justify-content:space-between;margin-top:30px;font-size:22px;letter-spacing:.06em}
.foot .g{color:var(--gold)} .foot .m{color:var(--mute)}
.top{position:absolute;left:0;right:0;top:84px;display:flex;justify-content:center;z-index:4}
.logo{width:230px;height:58px;background:var(--paper);-webkit-mask:url('${LOGO}') center/contain no-repeat;mask:url('${LOGO}') center/contain no-repeat}
.mono{width:120px;height:72px;background:var(--gold);-webkit-mask:url('${MONO}') center/contain no-repeat;mask:url('${MONO}') center/contain no-repeat}
.silk{position:absolute;inset:0;background:url('${SILK}') center/cover;opacity:.08}
.glow{position:absolute;inset:0;background:radial-gradient(70% 50% at 50% 45%,rgba(201,174,124,.07),rgba(13,12,11,0) 70%)}
.quote{position:absolute;left:110px;right:110px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:52px;z-index:4}
.quote p{font-family:Garamond,serif;font-style:italic;font-size:74px;line-height:1.18;text-wrap:balance}
.quote .who{font-family:Inter,sans-serif;font-style:normal;font-size:22px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold)}
.bottom{position:absolute;left:0;right:0;bottom:96px;display:flex;justify-content:center;z-index:4}
`;
const page = inner => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="card">${inner}<div class="frame"></div></div></body></html>`;
const foot = `<div class="foot"><span class="g">Send us your ring size &amp; budget</span><span class="m">Made to order · Pampanga</span></div>`;

const WIDE = new Set(['six-prong-200']);
const wideBg = f => `<div class="photo" style="background-image:url('${img(f)}');background-size:100% auto;background-repeat:no-repeat;background-position:center 200px"></div>`;
function cardA(p, no) {
  if (WIDE.has(p.id)) return page(`${wideBg(p.imgs[0])}<div class="shade"></div>
  <div class="body"><p class="kicker">N° ${String(no).padStart(2, '0')} · ${p.style}</p><h1>${p.name}</h1><p class="sub">${p.line}</p></div>`);
  return page(`<div class="photo" style="background-image:url('${img(p.imgs[0])}')"></div><div class="shade"></div>
  <div class="body"><p class="kicker">N° ${String(no).padStart(2, '0')} · ${p.style}</p><h1>${p.name}</h1><p class="sub">${p.line}</p></div>`);
}
function cardB(p, no) {
  const photo = p.imgs[1] || p.imgs[0];
  const top = WIDE.has(p.id) ? `<div class="top"><div class="logo"></div></div>` : `<div class="photo" style="background-image:url('${img(photo)}');background-size:1080px auto;background-position:center top"></div>
  <div class="shade" style="background:linear-gradient(180deg,rgba(13,12,11,0) 50%,rgba(13,12,11,.85) 60%,#0D0C0B 67%)"></div>`;
  if (p.tier) {
    const t = V.tiers[p.tier], m = t.moissanite[0], l = t.lab[0], n = t.natural[0];
    return page(`${top}<div class="body"><p class="kicker">The price · 14K gold</p><h1 style="font-size:96px">${p.name}</h1><p class="sub">${p.style}</p>
      <div class="prices"><div><p class="lbl">Moissanite</p><p class="from">from ${ct(m[0])}</p><p class="amt hi">${peso(m[1])}</p></div>
      <div><p class="lbl">Lab-grown</p><p class="from">from ${ct(l[0])} · IGI</p><p class="amt">${peso(l[1])}</p></div>
      <div><p class="lbl">Natural</p><p class="from">from ${ct(n[0])}</p><p class="amt">${peso(n[1])}</p></div></div>
      <p class="note">Also in 18K gold, from ${peso(m[2])}.</p>${foot}</div>`);
  }
  return page(`${top}<div class="body"><p class="kicker">In detail</p><h1 style="font-size:96px">${p.name}</h1><p class="sub">${p.style}</p>
    <ul class="det">${(p.anatomy || []).slice(0, 4).map(a => `<li>${a}</li>`).join('')}</ul>${foot}</div>`);
}
function cardC(p) {
  return page(`<div class="silk"></div><div class="glow"></div><div class="top" style="top:120px"><div class="mono"></div></div>
  <div class="quote"><p>${FEEL[p.id]}</p><span class="who">${p.name} · ${p.style}</span></div><div class="bottom"><div class="logo"></div></div>`);
}

const tags = '#VRIAH #EngagementRing #LabGrownDiamond #Moissanite #ProposalRing';
function captions(p) {
  const t = p.tier && V.tiers[p.tier];
  const a = `${hookFor(p)}\n\n${p.name} · ${p.style}. ${p.text || p.line}\n\nMade to order in Pampanga. Send us your ring size and budget.\n\n${tags}`;
  const b = t
    ? `No "PM for price." Here it is.\n\n${p.name} · ${p.style}, in 14K gold:\nMoissanite from ${peso(t.moissanite[0][1])}\nIGI lab-grown diamond from ${peso(t.lab[0][1])}\nNatural diamond from ${peso(t.natural[0][1])}\n18K gold from ${peso(t.moissanite[0][2])}\n\nSend us your ring size and budget; we'll show you what fits.\n\n${tags}`
    : `${p.name} · ${p.style}, in detail:\n${(p.anatomy || []).map(x => '· ' + x).join('\n')}\n\nMade to order in Pampanga. Message us for the price in your size.\n\n${tags}`;
  const c = `${FEEL[p.id]}\n\n${p.name} · ${p.style}. Made to order in Pampanga.\nTag the person you'd give this to.\n\n${tags}`;
  return { a, b, c };
}

(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1440 } });
  const posts = []; let n = 0;
  for (const [i, id] of ORDER.entries()) {
    const p = V.get(id); const no = i + 1; const cap = captions(p);
    const slug = String(no).padStart(2, '0') + '-' + id;
    for (const [k, html] of [['a', cardA(p, no)], ['b', cardB(p, no)], ['c', cardC(p)]]) {
      const name = `${slug}-${k}`, f = path.join(OUT, name + '.html');
      fs.writeFileSync(f, html); await pg.goto('file://' + f); await pg.evaluate(() => document.fonts.ready);
      await pg.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 90 }); fs.unlinkSync(f);
      posts.push({ n: ++n, day: no, ring: p.name, style: p.style, kind: { a: 'ring', b: p.tier ? 'price' : 'detail', c: 'feeling' }[k], image_url: RAW + 'social/tiktok-cards/' + name + '.jpg', title: k === 'a' ? `${p.name} · ${p.style}` : k === 'b' ? `${p.name} · the price` : `${p.name} · ${p.style}`, caption: cap[k] });
    }
  }
  fs.writeFileSync(path.join(ROOT, 'social/tiktok-series.json'), JSON.stringify({ note: 'One ring a day = one TikTok grid row: ring, price (or detail), feeling. Post in n order.', posts }, null, 1));
  await b.close(); console.log('cards', posts.length);
})();
