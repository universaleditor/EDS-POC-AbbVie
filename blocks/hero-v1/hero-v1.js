// /blocks/hero-v1/hero-v1.js
export default function decorate(block) {
  // --- collect authored bits from UE/AEM ---
  const picture = block.querySelector('picture') || null;
  const titleEl = block.querySelector('[data-aue-prop="title"]') || null;
  const bodyEl  = block.querySelector('[data-aue-prop="body"]')  || null;

  // cta rows look like: <p data-aue-prop="ctaX_label">...</p> + nearby <a>
  const labelPs = [...block.querySelectorAll('[data-aue-prop$="_label"]')];
  const ctas = labelPs.map((p) => {
    const label = (p.textContent || '').trim();
    const row = p.closest('div');
    const a = row?.querySelector('a');
    const href = a?.getAttribute('href') || (a?.textContent || '').trim();
    if (!label || !href || href === '#') return null;
    return { label, href };
  }).filter(Boolean);

  // --- build our own structure (no reliance on default .hero) ---
  const root  = document.createElement('div');
  root.className = 'hero-v1';

  const bg = document.createElement('div');
  bg.className = 'hero-v1__bg';
  if (picture) bg.append(picture);

  const inner = document.createElement('div');
  inner.className = 'hero-v1__inner';

  // LEFT: stacked CTA cards
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

  // RIGHT: title + body (richtext)
  const right = document.createElement('div');
  right.className = 'hero-v1__right';
  if (titleEl) { titleEl.classList.add('hero-v1__title'); right.append(titleEl); }
  if (bodyEl)  { bodyEl.classList.add('hero-v1__body');   right.append(bodyEl); }

  inner.append(left, right);
  root.append(bg, inner);

  // replace original rows with our layout
  block.textContent = '';
  block.append(root);

  // accessibility: label with title text if available
  const t = titleEl?.textContent?.trim();
  if (t && !block.getAttribute('aria-label')) block.setAttribute('aria-label', t);
}
