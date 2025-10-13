// /blocks/hero/hero.js
export default function decorate(block) {
  // 1) Grab authored bits from UE/AEM
  const picture = block.querySelector('picture');
  const img = picture?.querySelector('img');

  const titleEl =
    block.querySelector('[data-aue-prop="title"]') ||
    block.querySelector('h1, h2, h3, .title');

  const bodyEl =
    block.querySelector('[data-aue-prop="body"]') ||
    block.querySelector('.body');

  // Collect CTA label/link pairs: cta1..cta4
  const labelNodes = [...block.querySelectorAll('[data-aue-prop$="_label"]')];

  const ctas = labelNodes.map((labelP) => {
    const label = labelP.textContent?.trim();
    if (!label) return null;

    // find link next to the label within same CTA "row"
    const row = labelP.closest('div');
    const linkA =
      row?.querySelector('a') ||
      labelP.parentElement?.querySelector('a') ||
      labelP.nextElementSibling?.querySelector?.('a');

    const href = linkA?.getAttribute('href') || linkA?.textContent?.trim();
    if (!href) return null;

    const a = document.createElement('a');
    a.className = 'btn btn--cta';
    a.textContent = label;
    a.href = href;
    a.target = '_self'; // change to '_blank' if you want new tab
    a.rel = 'noopener';
    return a;
  }).filter(Boolean);

  // 2) Build layout
  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  const left = document.createElement('div');
  left.className = 'hero-left';

  const ctaList = document.createElement('div');
  ctaList.className = 'hero-cta-list';
  ctas.forEach((a) => {
    const item = document.createElement('div');
    item.className = 'hero-cta';
    item.append(a);
    ctaList.append(item);
  });
  if (ctaList.childElementCount) left.append(ctaList);

  const right = document.createElement('div');
  right.className = 'hero-right';
  if (titleEl) {
    titleEl.classList.add('hero-title');
    right.append(titleEl);
  }
  if (bodyEl) {
    bodyEl.classList.add('hero-body');
    right.append(bodyEl);
  }

  inner.append(left, right);

  // 3) Reassemble with background layer
  block.textContent = '';
  const bg = document.createElement('div');
  bg.className = 'hero-bg';
  if (picture) {
    bg.append(picture);
  } else if (img?.src) {
    block.style.setProperty('--hero-bg', `url("${img.src}")`);
  }
  block.append(bg, inner);

  // 4) Accessibility
  if (titleEl && !block.getAttribute('aria-label')) {
    const label = titleEl.textContent?.trim();
    if (label) block.setAttribute('aria-label', label);
  }
}
