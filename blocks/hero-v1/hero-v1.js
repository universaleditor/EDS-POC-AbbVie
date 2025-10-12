// blocks/hero-v1/hero-v1.js
// Fullscreen hero. Values bind to block root (:scope) as data-* attributes.
// In UE, we inject tiny absolute-positioned proxy elements for UE overlays.

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

function buildRealDOM(block) {
  block.innerHTML = `
    <div class="hero-v1">
      <div class="hero-v1__bg"></div>
      <div class="hero-v1__content">
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
        </div>
      </div>
    </div>
  `;
}

function injectAuthorProxies(block) {
  // Author-only container with tiny absolute targets that won't affect layout height
  const proxy = document.createElement('div');
  proxy.className = 'hero-v1__aue';
  proxy.innerHTML = `
    <span class="proxy-headline"    data-aue-label="Headline"></span>
    <span class="proxy-subheadline" data-aue-label="Subheadline"></span>
    <span class="proxy-body"        data-aue-label="Body (RTE)"></span>
    <span class="proxy-btn1"        data-aue-label="Button 1 Label"></span>
    <span class="proxy-btn2"        data-aue-label="Button 2 Label"></span>
    <span class="proxy-btn3"        data-aue-label="Button 3 Label"></span>
    <span class="proxy-btn4"        data-aue-label="Button 4 Label"></span>
  `;
  block.appendChild(proxy);
}

function apply(block) {
  const ds = block.dataset;
  const bg = block.querySelector('.hero-v1__bg');
  const headline = block.querySelector('.hero-v1__headline');
  const sub = block.querySelector('.hero-v1__subheadline');
  const body = block.querySelector('.hero-v1__body');

  const url = refToUrl(ds.bg);
  if (bg && url) bg.style.background = `url("${url}") center/cover no-repeat`;

  if (headline) headline.textContent = ds.headline || '';
  if (sub)      sub.textContent      = ds.subheadline || '';
  if (body)     body.innerHTML       = ds.body || '';

  const labels = [ds.b1Label, ds.b2Label, ds.b3Label, ds.b4Label];
  const hrefs  = [ds.b1Href,  ds.b2Href,  ds.b3Href,  ds.b4Href];
  [1,2,3,4].forEach((n, i) => {
    const a   = block.querySelector(`.hero-v1__btn--${n}`);
    const lbl = block.querySelector(`.hero-v1__btn--${n} .hero-v1__btn-label`);
    if (lbl) lbl.textContent = (labels[i] && String(labels[i]).trim()) || '\u00A0';
    if (a)   a.setAttribute('href', hrefs[i] || '#');
  });
}

export default function decorate(block) {
  if (block.dataset.heroV1Init === 'true') return;
  block.dataset.heroV1Init = 'true';

  const isAuthor = document.documentElement.hasAttribute('data-aue-context');

  // Build real DOM always (so publish is correct and author still sees structure)
  buildRealDOM(block);

  // In Author, add tiny proxy elements for UE overlays (instead of overlaying the real layout)
  if (isAuthor) {
    injectAuthorProxies(block);
    // make sure proxies never affect layout or height
    block.style.position = 'relative';
  }

  apply(block);

  // React to UE attribute updates on the block itself
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
    raf = requestAnimationFrame(() => { raf = null; apply(block); });
  };
  const mo = new MutationObserver((muts) => {
    if (muts.some(m => m.type === 'attributes' && attrs.includes(m.attributeName))) schedule();
  });
  mo.observe(block, { attributes: true, attributeFilter: attrs });
}
