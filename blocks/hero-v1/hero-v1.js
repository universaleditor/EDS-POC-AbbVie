// Build a hero-v1 layout from the plain rows Universal Editor outputs.
export default function decorate(block) {
  // grab authored bits
  const picture = block.querySelector('picture');
  const titleEl = block.querySelector('[data-aue-prop="title"]');
  const bodyEl  = block.querySelector('[data-aue-prop="body"]');

  // collect CTAs: each row has <p data-aue-prop="ctaX_label"> + a.button
  const labelPs = [...block.querySelectorAll('[data-aue-prop$="_label"]')];
  const ctas = labelPs.map((p) => {
    const label = p.textContent?.trim();
    // find link in same row
    const row = p.closest('div');
    const a = row?.querySelector('a');
    const href = a?.getAttribute('href') || a?.textContent?.trim();
    if (!label || !href) return null;
    return { label, href };
  }).filter(Boolean);

  // build new structure (hero-v1 only — no reliance on .hero)
  const root = document.createElement('div');
  root.className = 'hero-v1';

  const bg = document.createElement('div');
  bg.className = 'hero-v1__bg';
  if (picture) bg.append(picture);

  const inner = document.createElement('div');
  inner.className = 'hero-v1__inner';

  const left = document.createElement('div');
  left.className = 'hero-v1__left';

  if (ctas.length) {
    const list = document.createElement('div');
    list.className = 'hero-v1__cta-list';
    ctas.forEach(({ label, href }) => {
      const item = document.createElement('div');
      item.className = 'hero-v1__cta';
      const btn = document.createElement('a');
      btn.className = 'hero-v1__btn';
      btn.textContent = label;
      btn.href = href;
      btn.target = '_self'; // change to '_blank' if you want new tab
      btn.rel = 'noopener';
      item.append(btn);
      list.append(item);
    });
    left.append(list);
  }

  const right = document.createElement('div');
  right.className = 'hero-v1__right';

  if (titleEl) {
    titleEl.classList.add('hero-v1__title');
    right.append(titleEl);
  }
  if (bodyEl) {
    bodyEl.classList.add('hero-v1__body');
    right.append(bodyEl);
  }

  inner.append(left, right);
  root.append(bg, inner);

  // replace original content with our structure
  block.textContent = '';
  block.append(root);

  // aria label from title
  const titleText = titleEl?.textContent?.trim();
  if (titleText && !block.getAttribute('aria-label')) {
    block.setAttribute('aria-label', titleText);
  }
}
