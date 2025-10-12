// Fullscreen hero with background image and two centered columns (4 fixed buttons + text area)

function applyBackground(bgEl) {
  const src = bgEl?.getAttribute('data-src') || '';
  if (src) {
    bgEl.style.setProperty('--hero-v1-bg', `url("${src}")`);
    bgEl.classList.add('is-ready');
  }
}

export default function decorate(block) {
  // Wrap authoring content without nuking UE nodes
  const wrap = document.createElement('div');
  wrap.className = 'hero-v1';
  while (block.firstChild) wrap.appendChild(block.firstChild);
  block.appendChild(wrap);

  // Background layer (UE binds data-src)
  let bg = wrap.querySelector('.hero-v1__bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'hero-v1__bg';
    wrap.appendChild(bg);
  }

  // Foreground content scaffold
  let content = wrap.querySelector('.hero-v1__content');
  if (!content) {
    content = document.createElement('div');
    content.className = 'hero-v1__content';
    content.innerHTML = `
      <div class="hero-v1__grid">
        <div class="hero-v1__col hero-v1__col--left">
          <div class="hero-v1__panel">
            <div class="hero-v1__panel-title" aria-hidden="true">Choose your condition</div>
            <a class="hero-v1__btn hero-v1__btn--1" href="#"><span data-aue-prop="button1Label" data-aue-label="Button 1 Label"></span></a>
            <a class="hero-v1__btn hero-v1__btn--2" href="#"><span data-aue-prop="button2Label" data-aue-label="Button 2 Label"></span></a>
            <a class="hero-v1__btn hero-v1__btn--3" href="#"><span data-aue-prop="button3Label" data-aue-label="Button 3 Label"></span></a>
            <a class="hero-v1__btn hero-v1__btn--4" href="#"><span data-aue-prop="button4Label" data-aue-label="Button 4 Label"></span></a>
          </div>
        </div>
        <div class="hero-v1__col hero-v1__col--right">
          <h2 class="hero-v1__headline" data-aue-prop="headline" data-aue-label="Headline"></h2>
          <h3 class="hero-v1__subheadline" data-aue-prop="subheadline" data-aue-label="Subheadline"></h3>
          <div class="hero-v1__body" data-aue-prop="body" data-aue-type="richtext" data-aue-label="Body (Rich Text)"></div>
        </div>
      </div>`;
    wrap.appendChild(content);
  }

  // Make sure the button anchors exist for definition bindings (href targets)
  ['1','2','3','4'].forEach((n) => {
    if (!content.querySelector(`.hero-v1__btn--${n}`)) {
      const a = document.createElement('a');
      a.className = `hero-v1__btn hero-v1__btn--${n}`;
      a.href = '#';
      const span = document.createElement('span');
      span.setAttribute('data-aue-prop', `button${n}Label`);
      span.setAttribute('data-aue-label', `Button ${n} Label`);
      a.appendChild(span);
      content.querySelector('.hero-v1__panel').appendChild(a);
    }
  });

  // Apply background now and whenever UE updates data-src
  applyBackground(bg);
  const mo = new MutationObserver(() => applyBackground(bg));
  mo.observe(bg, { attributes: true, attributeFilter: ['data-src'] });
}
