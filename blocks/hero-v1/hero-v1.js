// blocks/hero-v1/hero-v1.js

function renderFromData(root, dataEl) {
  const ds = dataEl.dataset;

  // background
  const bg = root.querySelector('.hero-v1__bg') || root.appendChild(Object.assign(
    document.createElement('div'), { className: 'hero-v1__bg' }
  ));
  if (ds.bg) bg.style.setProperty('--hero-v1-bg', `url("${ds.bg}")`);

  // content shell
  let content = root.querySelector('.hero-v1__content');
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

  // text bits
  content.querySelector('.hero-v1__headline').textContent    = ds.headline    || '';
  content.querySelector('.hero-v1__subheadline').textContent = ds.subheadline || '';
  content.querySelector('.hero-v1__body').innerHTML          = ds.body        || '';

  // buttons (fixed 4)
  const btns = [
    { sel: '.hero-v1__btn--1', l: ds.b1Label, h: ds.b1Href },
    { sel: '.hero-v1__btn--2', l: ds.b2Label, h: ds.b2Href },
    { sel: '.hero-v1__btn--3', l: ds.b3Label, h: ds.b3Href },
    { sel: '.hero-v1__btn--4', l: ds.b4Label, h: ds.b4Href },
  ];
  btns.forEach(({ sel, l, h }) => {
    const a = content.querySelector(sel);
    if (a) {
      a.href = h || '#';
      const span = a.querySelector('.hero-v1__btn-label');
      span.textContent = l || '';
      a.toggleAttribute('hidden', !l); // hide if no label
    }
  });
}

export default function decorate(block) {
  if (block.dataset.heroV1Init === 'true') return;
  block.dataset.heroV1Init = 'true';

  // root container (stable)
  let root = block.querySelector(':scope > .hero-v1');
  if (!root) {
    root = document.createElement('div');
    root.className = 'hero-v1';
    while (block.firstChild) root.appendChild(block.firstChild);
    block.appendChild(root);
  }

  // single hidden data node for UE bindings
  let dataEl = root.querySelector(':scope > .hero-v1__data');
  if (!dataEl) {
    dataEl = document.createElement('div');
    dataEl.className = 'hero-v1__data';
    dataEl.hidden = true;                   // keep it invisible
    // hint UE not to show overlay for this node
    dataEl.setAttribute('data-aue-filter', 'hidden');
    root.appendChild(dataEl);
  }

  // initial render
  renderFromData(root, dataEl);

  // re-render when UE updates bound attributes on the data node
  const mo = new MutationObserver(() => renderFromData(root, dataEl));
  mo.observe(dataEl, { attributes: true, subtree: false });
}
