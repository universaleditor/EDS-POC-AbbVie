// blocks/hero-v1/hero-v1.js
// Fullscreen hero with background + two centered columns (4 fixed buttons + text area)
// UE binds values into the elements this file scaffolds. Guard prevents re-init loops.

function applyBackground(bgEl) {
  const src = bgEl?.getAttribute('data-src') || '';
  if (!src) return;
  bgEl.style.setProperty('--hero-v1-bg', `url("${src}")`);
  bgEl.classList.add('is-ready');
}

export default function decorate(block) {
  // ---- 1) Guard: run once
  if (block.dataset.heroV1Init === 'true') return;
  block.dataset.heroV1Init = 'true';

  // ---- 2) Outer container (create once, never nest)
  let root = block.querySelector(':scope > .hero-v1');
  if (!root) {
    root = document.createElement('div');
    root.className = 'hero-v1';
    // move any authoring leftovers once
    while (block.firstChild) root.appendChild(block.firstChild);
    block.appendChild(root);
  }

  // ---- 3) Background layer (UE will bind data-src on this element)
  let bg = root.querySelector(':scope > .hero-v1__bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'hero-v1__bg';
    root.appendChild(bg);
  }

  // ---- 4) Foreground scaffold (once)
  let content = root.querySelector(':scope > .hero-v1__content');
  if (!content) {
    content = document.createElement('div');
    content.className = 'hero-v1__content';
    content.innerHTML = `
      <div class="hero-v1__grid">
        <div class="hero-v1__col hero-v1__col--left">
          <div class="hero-v1__panel">
            <div class="hero-v1__panel-title" aria-hidden="true">Choose your condition</div>
            <a class="hero-v1__btn hero-v1__btn--1" href="#"><span class="hero-v1__btn-label" data-aue-prop="button1Label" data-aue-label="Button 1 Label"></span></a>
            <a class="hero-v1__btn hero-v1__btn--2" href="#"><span class="hero-v1__btn-label" data-aue-prop="button2Label" data-aue-label="Button 2 Label"></span></a>
            <a class="hero-v1__btn hero-v1__btn--3" href="#"><span class="hero-v1__btn-label" data-aue-prop="button3Label" data-aue-label="Button 3 Label"></span></a>
            <a class="hero-v1__btn hero-v1__btn--4" href="#"><span class="hero-v1__btn-label" data-aue-prop="button4Label" data-aue-label="Button 4 Label"></span></a>
          </div>
        </div>
        <div class="hero-v1__col hero-v1__col--right">
          <h2 class="hero-v1__headline" data-aue-prop="headline" data-aue-label="Headline"></h2>
          <h3 class="hero-v1__subheadline" data-aue-prop="subheadline" data-aue-label="Subheadline"></h3>
          <div class="hero-v1__body" data-aue-prop="body" data-aue-type="richtext" data-aue-label="Body (Rich Text)"></div>
        </div>
      </div>`;
    root.appendChild(content);
  }

  // ---- 5) Ensure anchors exist for href bindings
  ['1', '2', '3', '4'].forEach((n) => {
    if (!content.querySelector(`.hero-v1__btn--${n}`)) {
      const a = document.createElement('a');
      a.className = `hero-v1__btn hero-v1__btn--${n}`;
      a.href = '#';
      const span = document.createElement('span');
      span.className = 'hero-v1__btn-label';
      span.setAttribute('data-aue-prop', `button${n}Label`);
      span.setAttribute('data-aue-label', `Button ${n} Label`);
      a.appendChild(span);
      content.querySelector('.hero-v1__panel').appendChild(a);
    }
  });

  // ---- 6) Background apply + observe ONLY bg attribute (no content observers)
  applyBackground(bg);
  const mo = new MutationObserver((muts) => {
    if (muts.some((m) => m.attributeName === 'data-src')) applyBackground(bg);
  });
  mo.observe(bg, { attributes: true, attributeFilter: ['data-src'] });

  // ---- 7) Cleanup stray empty wrappers (from paste)
  root.querySelectorAll(':scope > div:empty').forEach((n) => n.remove());
}
