// blocks/hero-v1/hero-v1.js
// Fullscreen hero with BG + two centered columns (4 fixed buttons + text area)
// All model fields are bound by UE to attributes on one hidden .hero-v1__data node.
// We read dataset once and update text/href in place on attribute changes (no structure churn).

function qs(scope, sel) { return scope.querySelector(sel); }

function ensureRoot(block) {
  let root = qs(block, ':scope > .hero-v1');
  if (!root) {
    root = document.createElement('div');
    root.className = 'hero-v1';
    // move any pasted authoring content into the root one time
    while (block.firstChild) root.appendChild(block.firstChild);
    block.appendChild(root);
  }
  return root;
}

function ensureDataEl(root) {
  let dataEl = qs(root, ':scope > .hero-v1__data');
  if (!dataEl) {
    dataEl = document.createElement('div');
    dataEl.className = 'hero-v1__data';
    dataEl.hidden = true;
    // ask UE not to overlay this node
    dataEl.setAttribute('data-aue-filter', 'hidden');
    root.appendChild(dataEl);
  }
  return dataEl;
}

function ensureScaffold(root) {
  // background layer
  let bg = qs(root, ':scope > .hero-v1__bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'hero-v1__bg';
    root.appendChild(bg);
  }

  // content structure
  let content = qs(root, ':scope > .hero-v1__content');
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

  // cache refs (stable elements; we won't add/remove later)
  return {
    bg,
    headline: qs(content, '.hero-v1__headline'),
    subheadline: qs(content, '.hero-v1__subheadline'),
    body: qs(content, '.hero-v1__body'),
    btns: [
      { a: qs(content, '.hero-v1__btn--1'), label: qs(content, '.hero-v1__btn--1 .hero-v1__btn-label') },
      { a: qs(content, '.hero-v1__btn--2'), label: qs(content, '.hero-v1__btn--2 .hero-v1__btn-label') },
      { a: qs(content, '.hero-v1__btn--3'), label: qs(content, '.hero-v1__btn--3 .hero-v1__btn-label') },
      { a: qs(content, '.hero-v1__btn--4'), label: qs(content, '.hero-v1__btn--4 .hero-v1__btn-label') },
    ],
  };
}

function applyData(refs, ds) {
  // BG image via CSS var (no transforms)
  if (ds.bg) {
    refs.bg.style.setProperty('--hero-v1-bg', `url("${ds.bg}")`);
  }

  // text areas
  refs.headline.textContent    = ds.headline    || '';
  refs.subheadline.textContent = ds.subheadline || '';
  refs.body.innerHTML          = ds.body        || '';

  // buttons: set href + label; DO NOT add/remove nodes; avoid hidden toggle
  // keep layout stable: if empty label, put non-breaking space to preserve height
  const labels = [ds.b1Label, ds.b2Label, ds.b3Label, ds.b4Label];
  const hrefs  = [ds.b1Href,  ds.b2Href,  ds.b3Href,  ds.b4Href ];
  refs.btns.forEach((ref, i) => {
    const href = hrefs[i] || '#';
    const labelText = (labels[i] && String(labels[i]).trim()) || '\u00A0';
    ref.a.setAttribute('href', href);
    ref.label.textContent = labelText;
  });
}

export default function decorate(block) {
  // init guard (no re-inits)
  if (block.dataset.heroV1Init === 'true') return;
  block.dataset.heroV1Init = 'true';

  const root   = ensureRoot(block);
  const dataEl = ensureDataEl(root);
  const refs   = ensureScaffold(root);

  // initial render from current attributes (UE may set them async)
  applyData(refs, dataEl.dataset);

  // Debounced updates only when attributes on data node change.
  // We DO NOT rebuild structure; we only update text/href in place.
  let rafId = null;
  const schedule = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      applyData(refs, dataEl.dataset);
    });
  };

  const observedAttrs = [
    'data-bg',
    'data-headline', 'data-subheadline', 'data-body',
    'data-b1-label', 'data-b1-href',
    'data-b2-label', 'data-b2-href',
    'data-b3-label', 'data-b3-href',
    'data-b4-label', 'data-b4-href',
  ];

  const mo = new MutationObserver((mutations) => {
    // Only react to our attributes
    if (mutations.some(m => m.type === 'attributes' && observedAttrs.includes(m.attributeName))) {
      schedule();
    }
  });
  mo.observe(dataEl, { attributes: true, attributeFilter: observedAttrs });

  // Clean stray empty wrappers (from pasted authoring), without touching hero
  root.querySelectorAll(':scope > div:empty').forEach((n) => {
    if (!n.classList.contains('hero-v1__bg') && !n.classList.contains('hero-v1__content') && !n.classList.contains('hero-v1__data')) {
      n.remove();
    }
  });
}
