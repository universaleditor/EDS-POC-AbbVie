// /blocks/hero/hero.js
export default function decorate(block) {
  // 1) Extract content already rendered by AEM from the model
  const picture = block.querySelector('picture');
  const img = picture?.querySelector('img');

  // find content bits regardless of exact row/col
  const eyebrow = block.querySelector('p, .eyebrow');
  const title = block.querySelector('h1, h2, h3');
  // body = first rich text chunk after title (fallback: any <p> not used as eyebrow)
  let body;
  const paras = [...block.querySelectorAll('p, ul, ol, div')];
  for (const el of paras) {
    if (el === eyebrow) continue;
    if (title && title.contains(el)) continue;
    if (!body && (el.matches('p, ul, ol') || el.querySelector('p, ul, ol'))) {
      body = el;
      break;
    }
  }
  const links = [...block.querySelectorAll('a')];

  // 2) Build overlay structure
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-inner';

  const card = document.createElement('div');
  card.className = 'hero-card';
  if (eyebrow) {
    eyebrow.classList.add('eyebrow');
    card.append(eyebrow);
  }
  if (title) {
    title.classList.add('title');
    card.append(title);
  }
  if (body) {
    body.classList.add('body');
    card.append(body);
  }

  const cta = document.createElement('div');
  cta.className = 'cta';
  // move up to two CTAs (the model provides up to 2)
  links.slice(0, 2).forEach((a, i) => {
    a.classList.add('btn');
    if (i === 0) a.classList.add('primary');
    if (i === 1) a.classList.add('secondary');
    cta.append(a);
  });
  if (cta.childElementCount) card.append(cta);

  wrapper.append(card);

  // 3) Clean & reassemble
  block.textContent = '';
  const bg = document.createElement('div');
  bg.className = 'hero-bg';
  if (picture) {
    bg.append(picture);
  } else if (img?.src) {
    bg.style.setProperty('--hero-bg', `url("${img.src}")`);
  }
  block.append(bg, wrapper);

  // 4) Small accessibility improvement
  if (title && !block.getAttribute('aria-label')) {
    block.setAttribute('aria-label', title.textContent.trim());
  }
}
