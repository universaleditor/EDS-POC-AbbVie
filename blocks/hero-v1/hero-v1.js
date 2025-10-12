// blocks/hero-v1/hero-v1.js
// Root-bound values + sub-elements visible in UE tree.
// Author-safe: no transforms, stable heights, and UE-only contain/clipping.

function refToUrl(val) {
  if (!val) return '';
  if (typeof val === 'string') {
    if (val.trim().startsWith('{')) {
      try {
        const o = JSON.parse(val);
        const p = o.path || o.src || o.url || o.reference || '';
        return p ? (p.startsWith('http') ? p : `${location.origin}${p}`) : '';
      } catch {/* ignore */}
    }
    return val.startsWith('http') ? val : `${location.origin}${val}`;
  }
  if (typeof val === 'object') {
    const p = val.path || val.src || val.url || val.reference || '';
    return p ? (p.startsWith('http') ? p : `${location.origin}${p}`) : '';
  }
  return '';
}

function build(block) {
  // wipe authoring placeholders so we don't get extra overlays
  block.innerHTML = '';

  const root = document.createElement('div');
  root.className = 'hero-v1';

  const bg = document.createElement('div');
  bg.className = 'hero-v1__bg';
  root.appendChild(bg);

  const content = document.createElement('div');
  content.className = 'hero-v1__content';
  content.innerHTML = `
    <div class="hero-v1__grid">
      <div class="hero-v1__col hero-v1__col--left">
        <div class="hero-v1__panel">
          <div class="hero-v1__panel-title" aria-hidden="true">Choose your condition</div>
          <a class="hero-v1__btn hero-v1__btn--1" href="#"><span class="hero-v1__btn-label"></span></a>
          <a class="hero-v1__btn hero-v1__btn--2" href="#"><span class="hero-v1__btn-label"></span></a>
          <a class="hero-v1__btn hero-v1__btn--3" href="#"><span class="hero-v1__btn-label"></span></a>
          <a class="hero-v1__btn hero-v1__btn--4" href="#"><span class="hero-v1__btn-label"></span></a>
        </div>
      </div>
      <div class="hero-v1__col hero-v1__col--right">
        <h2 class="hero-v1__headline"></h2>
        <h3 class="hero-v1__subheadline"></h3>
        <div class="hero-v1__body"></div>
      </div>
    </div>`;
  root.appendChild(content);

  block.appendChild(root);

  return {
    bg,
    headline: content.querySelector('.hero-v1__headline'),
    sub: content.querySelector('.hero-v1__subheadline'),
    body: content.querySelector('.hero-v1__body'),
    btns: [
      { a: content.querySelector('.hero-v1__btn--1'), label: content.querySelector('.hero-v1__btn--1 .hero-v1__btn-label') },
      { a: content.querySelector('.hero-v1__btn--2'), label: content.querySelector('.hero-v1__btn--2 .hero-v1__btn-label') },
      { a: content.querySelector('.hero-v1__btn--3'), label: content.querySelector('.hero-v1__btn--3 .hero-v1__btn-label') },
      { a: content.querySelector('.hero-v1__btn--4'), label: content.querySelector('.hero-v1__btn--4 .hero-v1__btn-label') }
    ]
  };
}

function apply(block, refs) {
  const ds = block.dataset;

  // background (full width / full screen)
  const url = refToUrl(ds.bg);
  if (url) refs.bg.style.setProperty('--hero-v1-bg', `url("${url}")`);

  // text
  refs.headline.textContent = ds.headline || '';
  refs.sub.textContent      = ds.subheadline || '';
  refs.body.innerHTML       = ds.body || '';

  // buttons (keep height stable with nbsp)
  const labels = [ds.b1Label, ds.b2Label, ds.b3Label, ds.b4Label];
  const hrefs  = [ds.b1Href,  ds.b2Href,  ds.b3Href,  ds.b4Href];
  refs.btns.forEach((ref, i) => {
    ref.label.textContent = (labels[i] && String(labels[i]).trim()) || '\u00A0';
    ref.a.setAttribute('href', hrefs[i] || '#');
  });
}

export default function decorate(block) {
  if (block.dataset.heroV1Init === 'true') return;
  block.dataset.heroV1Init = 'true';

  const refs = build(block);
  apply(block, refs);

  // react to UE updates written to block.dataset
  const attrs = [
    'data-bg',
    'data-headline', 'data-subheadline', 'data-body',
    'data-b1-label', 'data-b1-href',
    'data-b2-label', 'data-b2-href',
    'data-b3-label', 'data-b3-href',
    'data-b4-label', 'data-b4-href'
  ];

  let raf = null;
  const schedule = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = null; apply(block, refs); });
  };

  const mo = new MutationObserver((muts) => {
    if (muts.some(m => m.type === 'attributes' && attrs.includes(m.attributeName))) schedule();
  });
  mo.observe(block, { attributes: true, attributeFilter: attrs });
}
