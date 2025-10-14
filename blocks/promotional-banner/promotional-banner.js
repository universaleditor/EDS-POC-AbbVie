// Promotional Banner: adds semantic classes and wrapper structure
// Strict EDS: keeps UE-authored nodes intact, adds binding targets

export default function decorate(block) {
  // Wrap the whole block for styling
  const wrap = document.createElement('div');
  wrap.className = 'promotional-banner';
  wrap.setAttribute('role', 'region');
  wrap.setAttribute('aria-label', 'Promotional Banner');

  // Move existing children into wrapper
  while (block.firstChild) wrap.appendChild(block.firstChild);
  block.appendChild(wrap);

  // Optional: inner container for max-width or grid layouts
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
  if (!leftText) {
    leftText = document.createElement('p');
    leftText.setAttribute('data-aue-prop', 'leftText');
    leftText.setAttribute('data-aue-type', 'text');
    leftText.setAttribute('data-aue-label', 'Left Text');
    inner.appendChild(leftText);
  }
  leftText.classList.add('promotional-banner__left-text');

  // --- Right RTE One ---
  let rightRteOne = inner.querySelector('[data-aue-prop="rightRteOne"]');
  if (!rightRteOne) {
    rightRteOne = document.createElement('div');
    rightRteOne.setAttribute('data-aue-prop', 'rightRteOne');
    rightRteOne.setAttribute('data-aue-type', 'richtext');
    rightRteOne.setAttribute('data-aue-label', 'Right RTE One');
    inner.appendChild(rightRteOne);
  }
  rightRteOne.classList.add('promotional-banner__right-rte', 'promotional-banner__right-rte--one');

  // --- Right RTE Two ---
  let rightRteTwo = inner.querySelector('[data-aue-prop="rightRteTwo"]');
  if (!rightRteTwo) {
    rightRteTwo = document.createElement('div');
    rightRteTwo.setAttribute('data-aue-prop', 'rightRteTwo');
    rightRteTwo.setAttribute('data-aue-type', 'richtext');
    rightRteTwo.setAttribute('data-aue-label', 'Right RTE Two');
    inner.appendChild(rightRteTwo);
  }
  rightRteTwo.classList.add('promotional-banner__right-rte', 'promotional-banner__right-rte--two');

  // --- Optional: add wrapper rows for layout control ---
  [...inner.children].forEach((child, idx) => {
    child.classList.add('promotional-banner__row', `promotional-banner__row--${idx + 1}`);
  });

  // --- Accessibility: use left text as aria-label ---
  const labelText = leftText?.textContent?.trim();
  if (labelText && !wrap.getAttribute('aria-label')) {
    wrap.setAttribute('aria-label', labelText);
  }
}
