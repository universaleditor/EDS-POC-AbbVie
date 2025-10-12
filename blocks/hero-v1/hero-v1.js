// blocks/hero-v1/hero-v1.js
// Single Hero block: full-width/full-screen background + 2 columns (4 buttons + text).
// UE binds ALL fields to attributes on one hidden .hero-v1__data node.
// We clear the block content first so no authoring placeholders remain (prevents extra overlays).

function refToUrl(val) {
  if (!val) return '';
  if (typeof val === 'string') {
    // JSON string or plain path?
    if (val.trim().startsWith('{')) {
      try {
        const obj = JSON.parse(val);
        const p = obj.path || obj.src || obj.url || obj.reference || '';
        return p ? (p.startsWith('http') ? p : `${location.origin}${p}`) : '';
      } catch { /* fall through */ }
    }
    return val.startsWith('http') ? val : `${location.origin}${val}`;
  }
  if (typeof val === 'object') {
    const p = val.path || val.src || val.url || val.reference || '';
    return p ? (p.startsWith('http') ? p : `${location.origin}${p}`) : '';
  }
  return '';
}

function buildSkeleton() {
  const root = document.createElement('div');
  root.className = 'hero-v1';

  const dataEl = document.createElement('div');
  dataEl.className = 'hero-v1__data';
  dataEl.hidden = true;
  dataEl.setAttribute('data-aue-filter', 'hidden'); // UE: no overlay
  root.appendChild(dataEl);

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

  return {
    root,
    dataEl,
    bg,
    headline: content.querySelector('.hero-v1__headline'),
    subheadline: content.querySelector('.hero-v1__subheadline'),
    body: content.querySelector('.hero-v1__body'),
    btns: [
      { a: content.querySelector('.hero-v1__btn--1'), label: content.querySelector('.hero-v1__btn--1 .hero-v1__btn-label') },
      { a: content.querySelector('.hero-v1__btn--2'), label: content.querySelector('.hero-v1__btn--2 .hero-v1__btn-label') },
      { a: content.querySelector('.hero-v1__btn--3'), label: content.querySelector('.hero-v1__btn--3 .hero-v1__btn-label') },
      { a: content.querySelector('.hero-v1__btn--4'), label: content.querySelector('.hero-v1__btn--4 .hero-v1__btn-label') }
    ]
  };
}

function applyData(refs) {
  const ds = refs.dataEl.dataset;

  // Background
  const url = refToUrl(ds.bg);
  if (url) refs.bg.style.setProperty('--hero-v1-bg', `url("${url}")`);

  // Text
  refs.headline.textContent    = ds.headline    || '';
  refs.subheadline.textContent = ds.subheadline || '';
  refs.body.innerHTML          = ds.body        || '';

  // Buttons: keep node structure stable (no hide/show); use nbsp when label empty
  const labels = [ds.b1Label, ds.b2Label, ds.b3Label, ds.b4Label];
  const hrefs  = [ds.b1Href,  ds.b2Href,  ds.b3Href,  ds.b4Href ];
  refs.btns.forEach((ref, i) => {
    ref.label.textContent = (labels[i] && String(labels[i]).trim()) || '\u00A0';
    ref.a.setAttribute('href', hrefs[i] || '#');
  });
}

export default function decorate(block) {
  if (block.dataset.heroV1Init === 'true') return;
  block.dataset.heroV1Init = 'true';

  // 🔥 CRITICAL: remove all existing children so no authoring placeholders survive
  block.innerHTML = '';

  // Build hero markup
  const refs = buildSkeleton();
  block.appendChild(refs.root);

  // Initial paint
  applyData(refs);

  // Watch only our data attributes on the hidden node
  const attrs = [
    'data-bg',
    'data-headline', 'data-subheadline', 'data-body',
    'data-b1-label', 'data-b1-href',
    'data-b2-label', 'data-b2-href',
    'data-b3-label', 'data-b3-href',
    'data-b4-label', 'data-b4-href'
  ];
  let rafId = null;
  const schedule = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => { rafId = null; applyData(refs); });
  };
  const mo = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.type === 'attributes' && attrs.includes(m.attributeName))) {
      schedule();
    }
  });
  mo.observe(refs.dataEl, { attributes: true, attributeFilter: attrs });

  // AUTHOR-ONLY: small guard so UE overlays don't blow up
  if (document.documentElement.hasAttribute('data-aue-context')) {
    refs.root.style.contain = 'layout paint'; // isolate layout in author
  }
}
