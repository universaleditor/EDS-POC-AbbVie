// Promotional Banner: adds wrappers and semantic classes
// Combines right RTEs into a single parent for layout

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

  // --- Right RTE One & Two ---
  let rightRteOne = inner.querySelector('[data-aue-prop="rightRteOne"]');
  let rightRteTwo = inner.querySelector('[data-aue-prop="rightRteTwo"]');

  if (rightRteOne || rightRteTwo) {
    // Create a wrapper for the right column
    const rightColumn = document.createElement('div');
    rightColumn.className = 'promotional-banner__right-column';

    // Move the RTEs into the right column
    if (rightRteOne) {
      rightRteOne.classList.add('promotional-banner__right-rte', 'promotional-banner__right-rte--one');
      rightColumn.appendChild(rightRteOne);
    }
    if (rightRteTwo) {
      rightRteTwo.classList.add('promotional-banner__right-rte', 'promotional-banner__right-rte--two');
      rightColumn.appendChild(rightRteTwo);
    }

    // Insert the right column into inner after left text
    if (leftText?.parentElement) {
      inner.insertBefore(rightColumn, leftText.nextSibling);
    } else {
      inner.appendChild(rightColumn);
    }
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
