/* VRIAH catalogue data. Prices transcribed from the VRIAH price sheets (Philippine peso).
   Each price tier lists [carat, 14K, 18K]. Lab-grown rows also apply to IGI-certified pink diamonds. */
(function () {
  const T = {
    A: {
      natural: [[.20, 61580.64, 75900.24], [.30, 66380.76, 80700.36], [.40, 73550.88, 88350.48], [.50, 81951.00, 96750.60], [.60, 93951.12, 108750.72]],
      lab: [[.5, 63780, 78900], [1.0, 70380, 85500], [1.5, 82110, 98400], [2.0, 92310, 108600], [3.0, 110040, 127500]],
      moissanite: [[.5, 45450, 58800], [1.0, 47850, 61200], [1.5, 58380, 72900], [2.0, 63780, 78300], [3.0, 73710, 89400]],
      gems: [[.5, 48450, 61800], [1.0, 50850, 64200], [1.5, 61380, 75900], [2.0, 66780, 81300], [3.0, 76710, 92400]]
    },
    B: {
      natural: [[.20, 51435.84, 60150.24], [.30, 55601.16, 67440.36], [.40, 66380.88, 79080.48], [.50, 74781.00, 87480.60], [.60, 84381.12, 97080.72]],
      lab: [[.5, 56850, 69180], [1.0, 63450, 75780], [1.5, 71400, 87060], [2.0, 81600, 97260], [3.0, 98700, 116970]],
      moissanite: [[.5, 38520, 48270], [1.0, 40920, 50670], [1.5, 48300, 60750], [2.0, 56850, 70200], [3.0, 66780, 81300]],
      gems: [[.5, 41520, 51270], [1.0, 43920, 53670], [1.5, 51300, 63750], [2.0, 59850, 73200], [3.0, 69780, 84300]]
    },
    C: {
      natural: [[.20, 47835.84, 56550.24], [.30, 51435.96, 60150.36], [.40, 64001.28, 75840.48], [.50, 72401.40, 84240.60], [.60, 82001.52, 93840.72], [.70, 94001.64, 105840.84], [.80, 111951.36, 126750.96], [.90, 117951.48, 132751.08]],
      lab: [[.5, 46200, 56640], [1.0, 54000, 64440], [1.5, 62520, 75300], [2.0, 76500, 89550], [3.0, 87300, 99350]],
      moissanite: [[.5, 31650, 39570], [1.0, 36450, 44370], [1.5, 41400, 51840], [2.0, 43200, 53640], [3.0, 51240, 61500]],
      gems: [[.5, 34650, 42570], [1.0, 39450, 47370], [1.5, 44400, 54840], [2.0, 46200, 56640], [3.0, 54240, 64500]]
    },
    D: {
      natural: [[.20, 44235.84, 52950.24], [.30, 47835.96, 56550.36], [.40, 59836.08, 68550.48], [.50, 68236.20, 76950.60], [.60, 77836.32, 86550.72], [.70, 89836.44, 98550.84], [.80, 103026.96, 112170.96], [.90, 109027.08, 118171.08]],
      lab: [[.5, 41850, 49770], [1.0, 49650, 57570], [1.5, 58800, 69240], [2.0, 69000, 79440], [3.0, 78600, 89040]],
      moissanite: [[.5, 31650, 39570], [1.0, 36450, 44370], [1.5, 41400, 51840], [2.0, 43200, 53640], [3.0, 51240, 61500]],
      gems: [[.5, 34650, 38730], [1.0, 35100, 44550], [1.5, 40050, 47970], [2.0, 43110, 49770], [3.0, 48000, 58440]]
    },
    E: {
      natural: [[.20, 41100.24, 48930.24], [.30, 44700.36, 52530.36], [.40, 53100.48, 60930.48], [.50, 63390.60, 70950.60], [.60, 72990.72, 80550.72], [.70, 84990.84, 92550.84], [.80, 96990.96, 104550.96], [.90, 108991.08, 116551.08]],
      lab: [[.5, 34590, 42150], [1.0, 40590, 50580], [1.5, 52800, 63240], [2.0, 63060, 72240], [3.0, 72600, 83040]],
      moissanite: [[.5, 29790, 35730], [1.0, 32100, 41550], [1.5, 37050, 44970], [2.0, 40110, 46770], [3.0, 45000, 55440]],
      gems: [[.5, 30900, 38730], [1.0, 35100, 44550], [1.5, 40050, 47970], [2.0, 43110, 49770], [3.0, 48000, 58440]]
    },
    F: {
      natural: [[.20, 46650.24, 57000.24], [.30, 50250.36, 60600.36], [.40, 64320.48, 77100.48], [.50, 72720.60, 85500.60], [.60, 82320.72, 95100.72]],
      lab: [[.5, 40320, 50670], [1.0, 43920, 54270], [1.5, 54300, 67350], [2.0, 65250, 76770], [3.0, 76050, 87570]],
      moissanite: [[.5, 36720, 47070], [1.0, 40920, 51270], [1.5, 48900, 61950], [2.0, 56250, 67770], [3.0, 60450, 71970]],
      gems: [[.5, 39720, 50070], [1.0, 43920, 54270], [1.5, 51900, 64950], [2.0, 59250, 70770], [3.0, 63450, 74970]]
    }
  };

  const STONES = {
    natural: { label: 'Natural diamond', short: 'Natural' },
    lab: { label: 'Lab-grown diamond · D, VVS', short: 'Lab-grown', note: 'Pink diamonds with IGI certificate are priced on this scale.' },
    moissanite: { label: 'Moissanite', short: 'Moissanite' },
    gems: { label: 'Sapphire, ruby & gems', short: 'Gemstone' }
  };

  const CATS = {
    solitaire: 'Solitaires', halo: 'Halos', trilogy: 'Trilogy', bridal: 'Bridal sets', band: 'Bands', earrings: 'Earrings'
  };

  /* One entry per design. Photos are grouped exactly as they sit in the VRIAH Canva file:
     every view belongs to the same ring, and the tier is the price sheet that follows those photos.
     views: [image, label]; anno: clean image -> the same shot with VRIAH's labels. */
  const P = [
    { id: 'six-prong-200', style: 'Solitaire', name: 'Equilibrio', line: '2.00 ct round brilliant', cat: 'solitaire', shape: 'Round', metal: 'white', tier: null,
      sheet: 'cad-200ct', views: [['cad-200ct', 'CAD sheet']],
      text: 'A 2.00 carat lab-grown round brilliant held by six prongs, each set with a small round diamond, over an open basket and a straight 1.60 mm band.',
      specs: [['Centre stone', '2.00 ct round brilliant (lab-grown diamond)'], ['Total height', '7.8 mm'], ['Band width (bottom)', '1.60 mm'], ['Band width (top / shoulder)', '1.60 mm (straight)'], ['Inner diameter', '17.3 mm (US size 7)'], ['Ring size', 'US 7']],
      anatomy: ['6 prong setting with diamond prongs (small round diamonds)', 'Open basket (gallery) for light and brilliance', 'Straight band for a clean, modern, timeless design'] },
    { id: 'etoile', style: 'Solitaire', name: 'Essenza', line: 'Six-claw solitaire', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'E',
      views: [['p087', 'Three-quarter']], anno: { p087: 'p086' },
      text: 'Six fine claws hold a round brilliant high above an alluring band with a semi-round surface. The extra claws keep the outline round from every angle, so the stone reads as a point of light.',
      anatomy: ['Lab-grown diamond with IGI certificate', 'Six claw prongs', 'Alluring band, semi-round surface', 'Base shank'] },
    { id: 'etreinte', style: 'Solitaire', name: 'Eden', line: 'Six-prong solitaire', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'E',
      views: [['p091', 'On the hand']], anno: { p091: 'p090' },
      text: 'A round cut on six prongs, worn close to the finger on an alluring band.',
      anatomy: ['Round cut', '6 prongs', 'Alluring band', 'Shank width (bandwidth) and shank depth (thickness)'] },
    { id: 'lumiere', style: 'With sidestones', name: 'Luce', line: 'Oval halo', cat: 'halo', shape: 'Oval', metal: 'white', tier: 'A',
      views: [['p007', 'Front']], anno: { p007: 'p006' },
      text: 'A 2.0 carat oval cut, a unique alternative to the round brilliant with a timeless yet modern appeal. Its long outline creates the illusion of longer, slender fingers. A halo of .02 carat stones frames it on round prongs.',
      anatomy: ['2.0 carat oval cut centre', '.02 carat sidestones', 'Halo', 'Round prongs'] },
    { id: 'ovale', style: 'With sidestones', name: 'Legame', line: 'Elongated cushion bridal set', cat: 'bridal', shape: 'Cushion', metal: 'white', tier: 'A',
      views: [['p005', 'On the cone']], anno: { p005: 'p004' },
      text: 'An elongated cushion on dainty round claws, worn over a second pavé band. Two separate bands sit flush, set with round VVS sidestones in a microscopic setting.',
      anatomy: ['Elongated cushion centre', 'Dainty round claw', 'Double band, two separate bands', 'Pavé sidestones in microscopic setting'] },
    { id: 'diademe', style: 'With sidestones', name: 'Leggenda', line: 'Round halo, cathedral profile', cat: 'halo', shape: 'Round', metal: 'white', tier: 'A',
      views: [['p008', 'Profile']],
      text: 'A round brilliant ringed in pavé and lifted on a cathedral profile, so light enters the stone from the side as well as from above.',
      anatomy: ['Round brilliant centre', 'Pavé halo', 'Cathedral profile', 'Pavé shoulders'] },
    { id: 'reflet', style: 'With sidestones', name: 'Lucente', line: 'Oval halo', cat: 'halo', shape: 'Oval', metal: 'white', tier: 'A',
      views: [['p011', 'Front']],
      text: 'An oval centre in a full halo, on a pavé band.', anatomy: ['Oval centre', 'Halo', 'Pavé band'] },
    { id: 'givre', style: 'With sidestones', name: 'Lago', line: 'Round halo', cat: 'halo', shape: 'Round', metal: 'white', tier: 'A',
      views: [['p012', 'On marble']],
      text: 'A round centre with a halo, photographed in soft daylight on marble.', anatomy: ['Round centre', 'Halo', 'Pavé band'] },
    { id: 'clarte', style: 'With sidestones', name: 'Limpida', line: 'Round, pavé band', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'A',
      views: [['p013', 'On marble']],
      text: 'A clean round brilliant set above a row of pavé.', anatomy: ['Round brilliant centre', 'Pavé band', 'Four claws'] },
    { id: 'aurore', style: 'With sidestones', name: 'Lucia', line: 'Round halo, straight band', cat: 'halo', shape: 'Round', metal: 'white', tier: 'B',
      views: [['p017', 'On display'], ['p016', 'Details']],
      text: 'A 1.0 carat round, VVS and colour D, inside a halo, held by four dainty round claws over a straight band.',
      anatomy: ['1.0 carat round cut, VVS, colour D', 'Halo', '4 dainty round claws', 'Straight band'] },
    { id: 'celeste', style: 'With sidestones', name: 'Lirica', line: 'Cushion, compass claws', cat: 'solitaire', shape: 'Cushion', metal: 'rose', tier: 'B',
      views: [['p021', 'Front'], ['p022', 'Side']], anno: { p021: 'p020' },
      text: 'A cushion cut turned on its point and held by box claws in the four compass positions. Sidestones run along the shoulder of a rose gold band.',
      anatomy: ['Cushion cut', 'Box claw, compass 4 prongs', 'Sidestones on the shoulder', 'Bandwidth'] },
    { id: 'rosee', style: 'With sidestones', name: 'Loto', line: 'Cushion, rose and yellow gold', cat: 'solitaire', shape: 'Cushion', metal: 'rose', tier: 'B',
      views: [['p025', 'Rose gold'], ['p026', 'Yellow gold']],
      text: 'A cushion cut on four claws with sidestones in the band, shown in rose gold and in yellow gold.',
      anatomy: ['Cushion cut', 'Four claws', 'Sidestones in the band'] },
    { id: 'aube', style: 'With sidestones', name: 'Lampo', line: 'Round, channel-set band', cat: 'solitaire', shape: 'Round', metal: 'rose', tier: 'B',
      views: [['p030', 'On display'], ['p029', 'Details']],
      text: 'A 2 carat round in 18 karat rose gold, on a 2.5 mm band. Channel-set sidestones are fixed in a microscopic setting.',
      anatomy: ['2 carat centre stone, VVS, colour D, excellent cut', '2.5 mm bandwidth', 'Dainty claw', 'Channel-set sidestones in microscopic setting'] },
    { id: 'glacier', style: 'With sidestones', name: 'Lusso', line: 'Round, pavé band', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'B',
      views: [['p033', 'On display']],
      text: 'A round centre on a pavé band, raised high on its claws.', anatomy: ['Round centre', 'Pavé band'] },
    { id: 'solene', style: 'With sidestones', name: 'Lealtà', line: 'Round, pavé sidestones', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'B',
      views: [['p037', 'Front'], ['p038', 'Low angle'], ['p036', 'Details']],
      text: 'A 1.0 carat round on dainty claws, with round VVS sidestones in a microscopic setting. Made in 14K white gold.',
      anatomy: ['1.0 carat round, VVS, colour D', 'Dainty round claw', 'Sidestones in microscopic setting', '14K white gold'] },
    { id: 'clair', style: 'With sidestones', name: 'Libera', line: 'Round, pavé shoulders', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'B',
      views: [['p084', 'Three-quarter']],
      text: 'A round solitaire with pavé running into the shoulders.', anatomy: ['Round centre', 'Pavé shoulders'] },
    { id: 'silhouette', style: 'With sidestones', name: 'Leggera', line: 'Round, channel band', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'C',
      views: [['p044', 'On the hand'], ['p045', 'Turned'], ['p046', 'Above'], ['p041', 'Side'], ['p043', 'Details']],
      text: 'Low and close to the hand. A 1.0 carat round on round claws, with channel-set sidestones in a microscopic setting along a 14K white gold band.',
      anatomy: ['1.0 carat round, VVS, colour D', 'Round claw', 'Channel-set sidestones', '14K white gold'] },
    { id: 'lune', style: 'With sidestones', name: 'Luna', line: 'Round, pavé band', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'C',
      views: [['p049', 'On marble']],
      text: 'A round centre above a pavé band, photographed on marble.', anatomy: ['Round centre', 'Pavé band'] },
    { id: 'ligne', style: 'With sidestones', name: 'Linea', line: 'Round, channel-set band', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'C',
      views: [['p053', 'Front']], anno: { p053: 'p052' },
      text: 'A round centre on round claws above a channel of round, VVS, colour D diamonds.',
      anatomy: ['Round centre stone', 'Round claw', 'Channel-set sidestones in microscopic setting'] },
    { id: 'blush', style: 'Solitaire', name: 'Emozione', line: 'Rose gold solitaire', cat: 'solitaire', shape: 'Round', metal: 'rose', tier: 'C',
      views: [['p057', 'On display'], ['p056', 'In the case']],
      text: 'A slim rose gold band with a raised round centre. Simple, warm and easy to stack.', anatomy: ['Round centre stone', 'Four claws', 'Rose gold band'] },
    { id: 'vrille', style: 'With sidestones', name: 'Legato', line: 'Twisted pavé', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'D',
      views: [['p060', 'Three-quarter']], text: 'Two strands of pavé twist toward a raised round centre.', anatomy: ['Round centre', 'Twisted pavé band'] },
    { id: 'astre', style: 'Solitaire', name: 'Etere', line: 'Six diamond-prong solitaire', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'C',
      views: [['p063', 'Details']],
      text: 'A lab-grown diamond with IGI certificate, held by six diamond prongs on an alluring band with a semi-round surface.',
      anatomy: ['Lab-grown diamond with IGI certificate', 'Six diamond prongs', 'Alluring band, semi-round surface'] },
    { id: 'prisme', style: 'Solitaire', name: 'Elisir', line: 'Six-claw solitaire', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'D',
      views: [['p066', 'On display']], text: 'A round brilliant on six claws, lifted above a slim band.', anatomy: ['Round brilliant', 'Six claws'] },
    { id: 'constellation', style: 'With sidestones', name: 'Lucciola', line: 'Marquise trilogy', cat: 'trilogy', shape: 'Round', metal: 'yellow', tier: 'D',
      views: [['p070', 'Front']], anno: { p070: 'p069' },
      text: 'A round cut flanked by marquise-cut side stones on claw prongs. The shank is drawn slightly deeper so the band carries the three stones with ease.',
      anatomy: ['Round cut centre', 'Marquise-cut side stones', 'Claw prongs', 'Shank depth (thickness) and bandwidth to order'] },
    { id: 'navette', style: 'With sidestones', name: 'Lume', line: 'Marquise trilogy', cat: 'trilogy', shape: 'Marquise', metal: 'yellow', tier: 'D',
      views: [['p073', 'On stone']], text: 'A marquise centre between two round stones on a fine yellow gold band.', anatomy: ['Marquise centre', 'Round side stones', 'Yellow gold band'] },
    { id: 'emeraude', style: 'With sidestones', name: 'Lettera', line: 'Emerald-cut trilogy', cat: 'trilogy', shape: 'Emerald', metal: 'yellow', tier: 'D',
      views: [['p076', 'On stone'], ['p077', 'In the case']],
      text: 'An emerald cut between tapered baguettes on a fine yellow gold band. Step cuts read as quiet planes of light.',
      anatomy: ['Emerald-cut centre', 'Tapered baguette side stones', 'Yellow gold band'] },
    { id: 'nocturne', style: 'With sidestones', name: 'Lanterna', line: 'Round, shoulder sidestones', cat: 'solitaire', shape: 'Round', metal: 'yellow', tier: 'D',
      views: [['p080', 'Upright'], ['p081', 'Lying flat']],
      text: 'A .30 carat round, VVS and colour D, with a sidestone at each shoulder. The band is alluring: it narrows toward the stone.',
      anatomy: ['.30 carat round, VVS, colour D', 'Prongs', 'Sidestones', 'Alluring band'] },
    { id: 'ombre', style: 'Solitaire', name: 'Eleganza', line: 'White gold solitaire', cat: 'solitaire', shape: 'Round', metal: 'white', tier: 'E',
      views: [['p095', 'Low angle']], text: 'A slim solitaire photographed low against slate and satin.', anatomy: ['Round centre', 'Four claws', 'Slim band'] },
    { id: 'soleil', style: 'Solitaire', name: 'Estate', line: 'Yellow gold solitaire', cat: 'solitaire', shape: 'Round', metal: 'yellow', tier: 'E',
      views: [['p098', 'Side'], ['p099', 'On display']],
      text: 'A round brilliant on a slender yellow gold band. The most essential VRIAH ring.', anatomy: ['Round centre', 'Four claws', 'Slender yellow gold band'] },
    { id: 'cathedrale', style: 'Solitaire', name: 'Eccelsa', line: 'Profile-head solitaire', cat: 'solitaire', shape: 'Round', metal: 'yellow', tier: 'F',
      views: [['p104', 'On stone'], ['p102', 'On the hand']], anno: { p104: 'p103' },
      text: 'A round diamond lifted on a profile head with dainty button claws. The thicker band has a flat surface and weighs approximately 3 to 4 grams of gold.',
      anatomy: ['Round diamond', 'Dainty button claw', 'Profile head', 'Flat surface, thicker band (approx. 3–4 g gold)'] },
    { id: 'couronne', style: 'Solitaire', name: 'Eccellenza', line: 'Four-claw solitaire', cat: 'solitaire', shape: 'Round', metal: 'yellow', tier: 'F',
      views: [['p107', 'Front']], text: 'A large round brilliant held high in four claws over a strong yellow gold band.', anatomy: ['Round brilliant', 'Four claws', 'Thicker band'] },
    { id: 'coeur', style: 'Solitaire', name: 'Estro', line: 'Cushion brilliant solitaire', cat: 'solitaire', shape: 'Cushion', metal: 'white', tier: 'E',
      views: [['p111', 'In the box'], ['p110', 'Box open'], ['p109', 'Details']],
      text: 'A 1.2 carat cushion brilliant, lab-grown with IGI certificate, VVS and colour D. Set on dainty round claws over a straight 14 karat white gold band.',
      anatomy: ['1.2 carat cushion brilliant, VVS, colour D', 'Dainty round claw', '14K white gold', 'Straight band'] },
    { id: 'goutte', style: 'Solitaire', name: 'Eva', line: 'Pear solitaire', cat: 'solitaire', shape: 'Pear', metal: 'yellow', tier: 'E',
      views: [['p115', 'Front'], ['p118', 'From above']], anno: { p115: 'p114' },
      text: 'A pear cut held by dainty round claws on a slightly alluring band.',
      anatomy: ['Pear cut', 'Dainty round claw', 'Slightly alluring band', 'Bandwidth, thickness and shank base to order'] },
    { id: 'heritage', style: 'Solitaire', name: 'Eredità', line: 'Emerald-cut signet band', cat: 'band', shape: 'Emerald', metal: 'yellow', tier: null,
      views: [['p001', 'Front']], text: 'A wide brushed gold band with an emerald cut set flush into its face. Engraving can run around the inside of the band.',
      anatomy: ['Emerald-cut diamond, flush set', 'Wide brushed gold band', 'Inside engraving'] },
    { id: 'eternite', style: 'With eternity band', name: 'Abbraccio', line: 'Rose gold eternity band', cat: 'band', shape: 'Round', metal: 'rose', tier: null,
      views: [['p003', 'Upright']], text: 'Round brilliants set shoulder to shoulder all the way around a rose gold band.', anatomy: ['Round brilliants, full circle', 'Shared claws', 'Rose gold'] },
    { id: 'coeur-rose', style: 'With eternity band', name: 'Amore Rosa', line: 'Pink heart bridal set', cat: 'bridal', shape: 'Heart', metal: 'rose', tier: null,
      views: [['p002', 'Stacked']], text: 'A pink heart-cut diamond on a pavé band, paired with a wide band of baguettes and pink pavé.',
      anatomy: ['Pink heart-cut centre', 'Pink pavé band', 'Baguette eternity band'] },
    { id: 'nacre', style: 'Earrings', name: 'Fior di Madreperla', line: 'Mother-of-pearl earrings', cat: 'earrings', shape: 'Round', metal: 'yellow', tier: null,
      views: [['p121', 'On slate'], ['p119', 'Side'], ['p120', 'Close'], ['p122', 'On velvet']],
      text: 'Carved mother-of-pearl petals around a round diamond centre. The nacre changes from white to rose to green as it turns.',
      anatomy: ['Carved mother-of-pearl', 'Round diamond centre', 'Gold post'] }
  ];
  P.forEach(p => { p.imgs = p.views.map(v => v[0]); p.anno = p.anno || {}; });

  const METALS = { yellow: 'Yellow gold', white: 'White gold', rose: 'Rose gold' };

  function peso(n) { return '₱' + Math.round(n).toLocaleString('en-US'); }
  function fromPrice(p) {
    if (!p.tier) return null;
    const t = T[p.tier]; let m = Infinity;
    for (const k in t) for (const r of t[k]) m = Math.min(m, r[1]);
    return m;
  }
  function img(id, n) { return 'img/' + id + '.jpg'; }

  window.VRIAH = { tiers: T, stones: STONES, cats: CATS, metals: METALS, pieces: P, peso, fromPrice, img,
    get(id) { return P.find(p => p.id === id); } };
})();
