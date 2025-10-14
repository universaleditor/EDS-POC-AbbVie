export default function decorate(block) {
  // Add base class
  block.classList.add('promotional-banner');

  // --- Left text ---
  const leftText = block.querySelector('[data-aue-prop="leftText"]');
  if (leftText) {
    leftText.classList.add('promotional-banner__left-text');
  }

  // --- Right RTE One ---
  const rightRteOne = block.querySelector('[data-aue-prop="rightRteOne"]');
  if (rightRteOne) {
    rightRteOne.classList.add('promotional-banner__right-rte', 'promotional-banner__right-rte--one');
  }

  // --- Right RTE Two ---
  const rightRteTwo = block.querySelector('[data-aue-prop="rightRteTwo"]');
  if (rightRteTwo) {
    rightRteTwo.classList.add('promotional-banner__right-rte', 'promotional-banner__right-rte--two');
  }

  // --- Add classes to wrapper <div>s for layout control ---
  const wrapper = block.closest('.promotional-banner-wrapper');
  wrapper?.classList.add('promotional-banner-wrapper--styled');

  // Each top-level direct <div> inside the block
  const topLevelDivs = [...block.children];
  topLevelDivs.forEach((div, i) => {
    div.classList.add('promotional-banner__row', `promotional-banner__row--${i + 1}`);
  });

  // --- Accessibility: aria-label from left text ---
  const labelText = leftText?.textContent?.trim();
  if (labelText && !block.getAttribute('aria-label')) {
    block.setAttribute('aria-label', labelText);
  }

  // --- Optional: Add label-based helper classes for text blocks ---
  const propEls = [...block.querySelectorAll('[data-aue-prop]')];
  propEls.forEach((el) => {
    const prop = el.getAttribute('data-aue-prop');
    const label = el.getAttribute('data-aue-label') || '';
    const labelSlug = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // sanitize
      .replace(/(^-|-$)/g, '');
    el.classList.add(`promotional-banner__${prop}`);
    if (labelSlug) el.classList.add(`promotional-banner__${labelSlug}`);
  });
}
