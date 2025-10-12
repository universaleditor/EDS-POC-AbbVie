// blocks/hero-v1/hero-v1.js
// Single-block Hero: full-screen background + two columns (4 buttons + text).
// UE binds ALL fields to a single hidden .hero-v1__data element (no per-field overlays).

function refToUrl(val) {
  if (!val) return '';
  // If the value is a JSON string, parse it
  if (typeof val === 'string' && val.trim().startsWith('{')) {
    try {
      const obj = JSON.parse(val);
      const path = obj.path || obj.src || obj.url || obj.reference || '';
      if (!path) return '';
      return path.startsWith('http') ? path : `${location.origin}${path}`;
    } catch {
      // not JSON; treat as path
    }
  }
  // Plain string path or absolute URL
  if (typeof val === 'string') {
    return val.startsWith('http') ? val : `${location.origin}${val}`;
  }
  // Object passed somehow
  if (typeof val === 'object') {
    const path = val.path || val.src || val.url || val.reference || '';
    return path ? (path.startsWith('http') ? path : `${location.origin}${path}`) : '';
  }
  return '';
}

function ensureRoot(block) {
  let root = block.querySelector(':scope > .hero-v1');
  if (!root) {
    root = document.createElement('div');
    root.className = 'hero-v1';
    while (block.firstChild) root.appendChild(block.firstChild);
    block.appendChild(root);
  }
  return root;
}

function ensureDataEl(root) {
  let dataEl = root.querySelector(':scope > .hero-v1__data');
  if (!dataEl) {
    dataEl = document.createElement('div');
    dataEl.className = 'hero-v1__data';
    dataEl.hidden = true;
    dataEl.setAttribute('data-aue-filter', 'hidden'); // avoid overlay
    root.appendChild(dataEl);
  }
  return dataEl;
}

function ensureScaffold(root) {
  // background layer
  let bg = root.querySelector(':scope > .hero-v1__bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'hero-v1__bg';
    root.appendChild(bg);
  }
  // content
  let content = root.querySelector(':scope > .hero-v1__content');
  if (!content) {
    content = document.createElement('div');
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
  }
  return {
    bg,
    content,
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

function applyData(refs, dataEl) {
  const ds = dataEl.dataset;
  // Background
  const bgUrl = refToUrl(ds.bg);
  if (bgUrl) refs.bg.style.setProperty('--hero-v1-bg', `url("${bgUrl}")`);

  // Text
  refs.headline.textContent    = ds.headline    || '';
  refs.subheadline.textContent = ds.subheadline || '';
  refs.body.innerHTML          = ds.body        || '';

  // Buttons (fixed 4)
  const labels = [ds.b1Label, ds.b2Label, ds.b3Label, ds.b4Label];
  const hrefs  = [ds.b1Href,  ds.b2Href,  ds.b3Href,  ds.b4Href ];
  refs.btns.forEach((ref, i) => {
    const label = (labels[i] && String(labels[i]).trim()) || '\u00A0'; // keep height stable
    const href  = hrefs[i] || '#';
    ref.label.textContent = label;
    ref.a.setAttribute('href', href);
  });
}

export default function decorate(block) {
  if (block.dataset.heroV1Init === 'true') return;
  block.dataset.heroV1Init = 'true';

  const root   = ensureRoot(block);
  const dataEl = ensureDataEl(root);
  const refs   = ensureScaffold(root);

  // Initial paint
  applyData(refs, dataEl);

  // Observe only our attributes (no reflow loops)
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
    rafId = requestAnimationFrame(() => {
      rafId = null;
      applyData(refs, dataEl);
    });
  };
  const mo = new MutationObserver((muts) => {
    if (muts.some(m => m.type === 'attributes' && attrs.includes(m.attributeName))) schedule();
  });
  mo.observe(dataEl, { attributes: true, attributeFilter: attrs });
}
