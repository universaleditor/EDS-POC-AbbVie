// blocks/hero-v1/hero-v1.js
// Shows a compact, stable DOM in Author so UE overlays don't blow up,
// but still exposes headline/subheadline/body/button nodes for selection.
// In Publish, renders the full 100vh hero.

function refToUrl(val) {
  if (!val) return '';
  if (typeof val === 'string') {
    if (val.trim().startsWith('{')) {
      try {
        const o = JSON.parse(val);
        const p = o.path || o.src || o.url || o.reference || '';
        return p ? (p.startsWith('http') ? p : `${location.origin}${p}`) : '';
      } catch {}
    }
    return val.startsWith('http') ? val : `${location.origin}${val}`;
  }
  if (typeof val === 'object') {
    const p = val.path || val.src || val.url || val.reference || '';
    return p ? (p.startsWith('http') ? p : `${location.origin}${p}`) : '';
  }
  return '';
}

function applyValuesToCommonNodes(container, ds) {
  // These selectors exist in BOTH author and publish DOM variants
  const headline    = container.querySelector('.hero-v1__headline');
  const subheadline = container.querySelector('.hero-v1__subheadline');
  const body        = container.querySelector('.hero-v1__body');

  if (headline)    headline.textContent = ds.headline || '';
  if (subheadline) subheadline.textContent = ds.subheadline || '';
  if (body)        body.innerHTML = ds.body || '';

  const labels = [ds.b1Label, ds.b2Label, ds.b3Label, ds.b4Label];
  const hrefs  = [ds.b1Href,  ds.b2Href,  ds.b3Href,  ds.b4Href ];
  [1,2,3,4].forEach((n, i) => {
    const a   = container.querySelector(`.hero-v1__btn--${n}`);
    const lbl = container.querySelector(`.hero-v1__btn--${n} .hero-v1__btn-label`);
    if (lbl) lbl.textContent = (labels[i] && String(labels[i]).trim()) || '\u00A0';
    if (a)   a.setAttribute('href', hrefs[i] || '#');
  });
}

function renderAuthorDOM(block) {
  // Compact, stable layout: no 100vh, no layered bg.
  block.innerHTML = `
    <div class="hero-v1 hero-v1--author"
         style="position:relative; width:100%; max-width:1200px; margin:16px auto; border:1px dashed #bbb; background:#fafafa; padding:16px; border-radius:8px;">
      <div style="font:600 14px/1.2 system-ui; margin-bottom:10px; color:#444;">Hero v1 — Author Preview</div>
      <div class="hero-v1__grid" style="display:grid; grid-template-columns:320px 1fr; gap:20px;">
        <div class="hero-v1__col hero-v1__col--left">
          <div class="hero-v1__panel" style="background:#0a3a68; color:#fff; border-radius:10px; padding:12px;">
            <div class="hero-v1__panel-title" aria-hidden="true"
                 style="text-transform:uppercase; letter-spacing:.08em; font-weight:700; font-size:12px; opacity:.9; margin-bottom:8px;">
              Choose your condition
            </div>
            <a class="hero-v1__btn hero-v1__btn--1" href="#"
               style="display:block; margin:8px 0; padding:10px 12px; border-radius:8px; background:#b43b64; color:#fff; text-decoration:none; font-weight:700; text-align:center;">
              <span class="hero-v1__btn-label"></span>
            </a>
            <a class="hero-v1__btn hero-v1__btn--2" href="#"
               style="display:block; margin:8px 0; padding:10px 12px; border-radius:8px; background:#b43b64; color:#fff; text-decoration:none; font-weight:700; text-align:center;">
              <span class="hero-v1__btn-label"></span>
            </a>
            <a class="hero-v1__btn hero-v1__btn--3" href="#"
               style="display:block; margin:8px 0; padding:10px 12px; border-radius:8px; background:#b43b64; color:#fff; text-decoration:none; font-weight:700; text-align:center;">
              <span class="hero-v1__btn-label"></span>
            </a>
            <a class="hero-v1__btn hero-v1__btn--4" href="#"
               style="display:block; margin:8px 0; padding:10px 12px; border-radius:8px; background:#b43b64; color:#fff; text-decoration:none; font-weight:700; text-align:center;">
              <span class="hero-v1__btn-label"></span>
            </a>
          </div>
        </div>
        <div class="hero-v1__col hero-v1__col--right">
          <h2 class="hero-v1__headline" style="font:800 22px/1.2 system-ui; margin:0 0 6px; color:#111;"></h2>
          <h3 class="hero-v1__subheadline" style="font:700 16px/1.3 system-ui; margin:0 0 10px; color:#333;"></h3>
          <div class="hero-v1__body" style="font:400 14px/1.5 system-ui; color:#444;"></div>
        </div>
      </div>
      <div style="margin-top:10px; font:12px/1.4 system-ui; color:#666;">
        Background image is hidden in Author to keep overlays stable. It appears on Publish.
      </div>
    </div>
  `;
}

function renderPublishDOM(block) {
  block.innerHTML = `
    <div class="hero-v1" style="position:relative; min-height:100vh; width:100%; overflow:hidden; isolation:isolate;">
      <div class="hero-v1__bg" style="position:absolute; inset:0;"></div>
      <div class="hero-v1__content" style="position:relative; z-index:2; display:grid; place-items:center; padding:32px 20px; min-height:100vh;">
        <div class="hero-v1__grid" style="width:min(1200px,95%); display:grid; grid-template-columns:340px 1fr; gap:40px; align-items:center;">
          <div class="hero-v1__col hero-v1__col--left">
            <div class="hero-v1__panel" style="background:rgba(10,58,104,.9); border-radius:14px; padding:24px 22px; color:#fff; box-shadow:0 6px 24px rgba(0,0,0,.25);">
              <div class="hero-v1__panel-title" aria-hidden="true"
                   style="text-transform:uppercase; letter-spacing:.08em; font-weight:700; font-size:14px; opacity:.9; margin-bottom:16px;">
                   Choose your condition
              </div>
              <a class="hero-v1__btn hero-v1__btn--1" href="#"
                 style="display:block; margin:14px 0; padding:14px 18px; border-radius:10px; background:#b43b64; color:#fff; text-decoration:none; font-weight:700; text-align:center;">
                <span class="hero-v1__btn-label"></span>
              </a>
              <a class="hero-v1__btn hero-v1__btn--2" href="#"
                 style="display:block; margin:14px 0; padding:14px 18px; border-radius:10px; background:#b43b64; color:#fff; text-decoration:none; font-weight:700; text-align:center;">
                <span class="hero-v1__btn-label"></span>
              </a>
              <a class="hero-v1__btn hero-v1__btn--3" href="#"
                 style="display:block; margin:14px 0; padding:14px 18px; border-radius:10px; background:#b43b64; color:#fff; text-decoration:none; font-weight:700; text-align:center;">
                <span class="hero-v1__btn-label"></span>
              </a>
              <a class="hero-v1__btn hero-v1__btn--4" href="#"
                 style="display:block; margin:14px 0; padding:14px 18px; border-radius:10px; background:#b43b64; color:#fff; text-decoration:none; font-weight:700; text-align:center;">
                <span class="hero-v1__btn-label"></span>
              </a>
            </div>
          </div>
          <div class="hero-v1__col hero-v1__col--right">
            <h2 class="hero-v1__headline" style="color:#fff; font-size:clamp(28px,4vw,44px); line-height:1.1; margin:0 0 10px; font-weight:800;"></h2>
            <h3 class="hero-v1__subheadline" style="color:#e8e8e8; font-size:clamp(20px,2.5vw,28px); margin:0 0 14px; font-weight:700;"></h3>
            <div class="hero-v1__body" style="color:#f2f2f2; font-size:16px; line-height:1.5; max-width:520px;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function applyBackgroundIfPresent(block) {
  const ds = block.dataset;
  const url = (function refToUrl(val) {
    if (!val) return '';
    if (typeof val === 'string') {
      if (val.trim().startsWith('{')) {
        try {
          const o = JSON.parse(val);
          const p = o.path || o.src || o.url || o.reference || '';
          return p ? (p.startsWith('http') ? p : `${location.origin}${p}`) : '';
        } catch {}
      }
      return val.startsWith('http') ? val : `${location.origin}${val}`;
    }
    if (typeof val === 'object') {
      const p = val.path || val.src || val.url || val.reference || '';
      return p ? (p.startsWith('http') ? p : `${location.origin}${p}`) : '';
    }
    return '';
  })(ds.bg);

  const bg = block.querySelector('.hero-v1__bg');
  if (bg && url) {
    bg.style.background = `url("${url}") center/cover no-repeat`;
  }
}

export default function decorate(block) {
  if (block.dataset.heroV1Init === 'true') return;
  block.dataset.heroV1Init = 'true';

  const isAuthor = document.documentElement.hasAttribute('data-aue-context');

  if (isAuthor) {
    // AUTHOR: small stable preview DOM
    renderAuthorDOM(block);
    applyValuesToCommonNodes(block, block.dataset);

    // Make UE overlays measure small boxes only
    block.style.contain = 'layout paint style';
    block.style.overflow = 'clip';

  } else {
    // PUBLISH: full hero DOM
    renderPublishDOM(block);
    applyValuesToCommonNodes(block, block.dataset);
    applyBackgroundIfPresent(block);
  }

  // React to field changes (UE writes dataset attrs on block)
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
    raf = requestAnimationFrame(() => {
      raf = null;
      if (isAuthor) {
        applyValuesToCommonNodes(block, block.dataset);
      } else {
        applyValuesToCommonNodes(block, block.dataset);
        applyBackgroundIfPresent(block);
      }
    });
  };

  const mo = new MutationObserver((muts) => {
    if (muts.some(m => m.type === 'attributes' && attrs.includes(m.attributeName))) schedule();
  });
  mo.observe(block, { attributes: true, attributeFilter: attrs });
}
