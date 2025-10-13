// /blocks/hero/hero.js
export default function decorate(block) {
  // 1) Extract content already rendered by AEM from the model
  const picture = block.querySelector('picture');
  const img = picture?.querySelector('img');

  // Prefer explicit bindings, then sensible fallbacks
  const titleEl =
    block.querySelector('[data-aue-prop="title"]') ||
    block.querySelector('h1, h2, h3, .title');

  // Body is rich text; keep whatever UE rendered
  let bodyEl =
    block.querySelector('[data-aue-prop="body"]') ||
    block.querySelector('.body');

  if (!bodyEl) {
    // Fallback: the first rich-ish chunk that isn't the title
    const candidates = [...block.querySelectorAll('div, p, ul, ol')];
    for (const el of candidates) {
      if (titleEl && (el === titleEl || titleEl.contains(el))) continue;
      bodyEl = el;
      break;
    }
  }

  // Helper: build CTA from label/href fields (cta1..cta4)
  const buildCTA = (n) => {
    const labelEl = block.querySelector(`[data-aue-prop="cta${n}_label"]`);
    const hrefEl  = block.querySelector(`[data-aue-prop="cta${n}_href"]`);
    const label = labelEl?.textContent?.trim();
    // href can come as text or attribute (if authoring rendered an <a>)
    const href =
      hrefEl?.getAttribute?.('href') ||
      hrefEl?.textContent?.trim();

    if (label && href) {
      const a = document.createElement('a');
      a.className = 'btn';
      a.textContent = label;
      a.href = href;
      // change to '_blank' if you prefer new tab:
      a.target = '_self';
      a.rel = 'noopener';
      return a;
    }
    return null;
  };

  // Also capture any anchors UE may have already rendered
  const authoredLinks = [...block.querySelectorAll('a')];

  // 2) Build overlay structure
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-inner';

  const card = document.createElement('div');
  card.className = 'hero-card';

  if (titleEl) {
    titleEl.classList.add('title');
    card.append(titleEl);
  }
  if (bodyEl) {
    bodyEl.classList.add('body');
    card.append(bodyEl);
  }

  // CTAs area
  const cta = document.createElement('div');
  cta.className = 'cta';

  // Prefer model fields cta1..cta4
  [1, 2, 3, 4].forEach((n) => {
    const btn = buildCTA(n);
    if (btn) cta.append(btn);
  });

  // If none built from fields, fall back to any existing anchors in the block
  if (!cta.childElementCount && authoredLinks.length) {
    authoredLinks.forEach((a) => {
      // avoid moving links that are inside body/title we already appended
      if (card.contains(a)) return;
      a.classList.add('btn');
      cta.append(a);
    });
  }

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

  // 4) Accessibility: use title text for region label if not set
  if (titleEl && !block.getAttribute('aria-label')) {
    const plainTitle =
      titleEl.textContent?.trim() ||
      titleEl.innerText?.trim() || '';
    if (plainTitle) block.setAttribute('aria-label', plainTitle);
  }
}
