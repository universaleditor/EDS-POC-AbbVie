// /blocks/navigation-v1/navigation-v1.js
function toArray(nl) { return Array.prototype.slice.call(nl || []); }

function buildFromContent(contentEl) {
  // use first UL if present; else build UL from links
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
    ul = ul.cloneNode(true);
  }
  return ul;
}

function enhanceDropdowns(ul) {
  ul.className = 'navigation-v1__list';
  toArray(ul.children).forEach((li) => {
    li.classList.add('navigation-v1__item');
    const childUL = li.querySelector(':scope > ul');
    if (childUL) {
      li.classList.add('has-dropdown');
      childUL.classList.add('navigation-v1__dropdown');

      const toggle = document.createElement('button');
      toggle.className = 'navigation-v1__toggle';
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<span aria-hidden="true">▾</span>';

      const first = li.querySelector(':scope > a, :scope > span, :scope > strong') || li.firstChild;
      if (first && first.nextSibling) li.insertBefore(toggle, first.nextSibling);
      else li.appendChild(toggle);

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
  // ensure exactly ONE binding target
  const targets = toArray(block.querySelectorAll('[data-aue-prop="menuHtml"]'));
  let contentEl = targets.find((n) => n.classList.contains('navigation-v1__content'));
  if (!contentEl) {
    contentEl = document.createElement('div');
    contentEl.className = 'navigation-v1__content';
    contentEl.setAttribute('data-aue-prop', 'menuHtml');
    contentEl.setAttribute('data-aue-type', 'richtext');
    contentEl.setAttribute('data-aue-label', 'Navigation Menu');
    block.appendChild(contentEl);
  }
  // remove duplicates (prevents double field in side panel)
  targets.forEach((n) => { if (n !== contentEl) n.remove(); });

  // rebuild NAV from content
  const existing = block.querySelector('nav.navigation-v1');
  if (existing) existing.remove();

  const ul = enhanceDropdowns(buildFromContent(contentEl));
  const nav = document.createElement('nav');
  nav.className = 'navigation-v1';
  nav.setAttribute('aria-label', 'Primary navigation');
  nav.appendChild(ul);
  block.appendChild(nav);

  // hide authored rte content (but keep in DOM for UE)
  contentEl.hidden = true;
}

export default function decorate(block) {
  // wrap without nuking UE nodes
  const wrapper = document.createElement('div');
  wrapper.className = 'navigation-v1__wrapper';
  while (block.firstChild) wrapper.appendChild(block.firstChild);
  block.appendChild(wrapper);

  render(wrapper);

  // live updates from UE
  const mo = new MutationObserver(() => render(wrapper));
  mo.observe(wrapper, { childList: true, subtree: true, characterData: true });
}
