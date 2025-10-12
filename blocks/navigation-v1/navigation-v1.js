// blocks/navigation-v1/navigation-v1.js
function toArray(nodeList) { return Array.prototype.slice.call(nodeList || []); }

function buildFromContent(contentEl) {
  // If author already gave a UL, use it. Otherwise, build one from links.
  let ul = contentEl.querySelector(':scope > ul');
  if (!ul) {
    const links = toArray(contentEl.querySelectorAll('a'));
    ul = document.createElement('ul');
    links.forEach((a) => {
      const li = document.createElement('li');
      li.appendChild(a.cloneNode(true));
      ul.appendChild(li);
    });
  } else {
    // Work on a cloned UL to avoid mutating author markup
    ul = ul.cloneNode(true);
  }
  return ul;
}

function enhanceDropdowns(ul) {
  ul.classList.add('navigation-v1__list');

  toArray(ul.children).forEach((li) => {
    li.classList.add('navigation-v1__item');

    const childUL = li.querySelector(':scope > ul');
    if (childUL) {
      // Make this a dropdown (one level)
      li.classList.add('has-dropdown');
      childUL.classList.add('navigation-v1__dropdown');
      // Toggle button (caret)
      const toggle = document.createElement('button');
      toggle.className = 'navigation-v1__toggle';
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<span aria-hidden="true">▾</span>';

      // Insert toggle after the first link/text
      const firstLink = li.querySelector(':scope > a, :scope > span, :scope > strong') || li.firstChild;
      if (firstLink && firstLink.nextSibling) {
        li.insertBefore(toggle, firstLink.nextSibling);
      } else {
        li.appendChild(toggle);
      }

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const open = li.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
  });

  return ul;
}

function render(block) {
  const contentEl = block.querySelector('.navigation-v1__content');
  const existingNav = block.querySelector('nav.navigation-v1');
  if (existingNav) existingNav.remove();

  const ul = enhanceDropdowns(buildFromContent(contentEl));

  const nav = document.createElement('nav');
  nav.className = 'navigation-v1';
  nav.setAttribute('aria-label', 'Primary navigation');
  nav.appendChild(ul);

  // Hide authored content but keep it in DOM for UE edits
  contentEl.setAttribute('hidden', '');

  block.appendChild(nav);
}

export default function decorate(block) {
  // Wrap without deleting UE-authored nodes
  const wrapper = document.createElement('div');
  wrapper.className = 'navigation-v1__wrapper';
  while (block.firstChild) wrapper.appendChild(block.firstChild);
  block.appendChild(wrapper);

  // Ensure the UE binding target exists
  let contentEl = wrapper.querySelector('.navigation-v1__content');
  if (!contentEl) {
    contentEl = document.createElement('div');
    contentEl.className = 'navigation-v1__content';
    // Helpful UE hints (optional)
    contentEl.setAttribute('data-aue-prop', 'menuHtml');
    contentEl.setAttribute('data-aue-type', 'richtext');
    contentEl.setAttribute('data-aue-label', 'Navigation Menu');
    wrapper.appendChild(contentEl);
  }

  // Initial render
  render(block);

  // Re-render whenever UE updates the richtext
  const mo = new MutationObserver(() => render(block));
  mo.observe(contentEl, { childList: true, subtree: true, characterData: true });
}
