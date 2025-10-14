// Promotional Banner: adds wrappers and semantic classes
// Keeps authored nodes intact for editing

export default function decorate(block) {
  // --- Wrap the entire block for styling ---
  const wrap = document.createElement('div');
  wrap.className = 'promotional-banner';
  wrap.setAttribute('role', 'region');
  wrap.setAttribute('aria-label', 'Promotional Banner');

  // Move existing children into wrap
  while (block.firstChild) wrap.appendChild(block.firstChild);
  block.appendChild(wrap);

  // --- Inner container for layout ---
  let inner = wrap.querySelector('.promotional-banner__inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'promotional-banner__inner';
    // move all top-level children into inner
    while (wrap.firstChild) inner.appendChild(wrap.firstChild);
    wrap.appendChild(inner);
  }

  // --- Left Text ---
  let leftText = inner.querySelector('[data-aue-prop="leftText"]');
  if (leftText) {
    leftText.classList.add('promotional-banner__left-text');
  }

  // --- Right RTE One ---
  let rightRteOne = inner.querySelector('[data-aue-prop="rightRteOne"]');
  if (rightRteOne) {
    rightRteOne.classList.add('promotional-banner__right-rte', 'promotional-banner__right-rte--one');
  }

  // --- Right RTE Two ---
  let rightRteTwo = inner.querySelector('[data-aue-prop="rightRteTwo"]');
  if (rightRteTwo) {
    rightRteTwo.classList.add('promotional-banner__right-rte', 'promotional-banner__right-rte--two');
  }

  // --- Add row classes to direct children of inner ---
  [...inner.children].forEach((child, idx) => {
    child.classList.add('promotional-banner__row', `promotional-banner__row--${idx + 1}`);
  });

  // --- Accessibility: use left text as aria-label if present ---
  const labelText = leftText?.textContent?.trim();
  if (labelText && !wrap.getAttribute('aria-label')) {
    wrap.setAttribute('aria-label', labelText);
  }
}
