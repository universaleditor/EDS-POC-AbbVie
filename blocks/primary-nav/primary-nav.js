// blocks/primary-nav/primary-nav.js
// Renders a primary navigation with one-level dropdowns.
// Data contract: a <script type="application/json" class="primary-nav__data"> node
// is populated by UE bindings with an array of items:
// [{ label, href, newWindow, children: [{ label, href, newWindow }] }]

function safeParse(json) {
  try { return JSON.parse(json || '[]') || []; } catch { return []; }
}

function makeLink({ label = '', href = '', newWindow = false }) {
  const a = document.createElement('a');
  a.textContent = label || '';
  if (href) a.href = href;
  if (newWindow) a.target = '_blank';
  return a;
}

function closeAllDropdowns(root) {
  root.querySelectorAll('.primary-nav__item.has-dropdown').forEach((li) => {
    li.classList.remove('open');
    const btn = li.querySelector('.primary-nav__toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

function renderMenu(root, items) {
  // Clear previous content (but keep the hidden data node)
  const dataEl = root.querySelector('script.primary-nav__data');
  root.innerHTML = '';
  if (dataEl) root.appendChild(dataEl);

  // Build nav
  const nav = document.createElement('nav');
  nav.className = 'primary-nav';
  nav.setAttribute('aria-label', 'Primary navigation');

  const ul = document.createElement('ul');
  ul.className = 'primary-nav__list';
  nav.appendChild(ul);
  root.appendChild(nav);

  const handleDocClick = (e) => {
    if (!nav.contains(e.target)) closeAllDropdowns(nav);
  };

  const onKeyDownTop = (e) => {
    const itemsEls = [...ul.querySelectorAll('.primary-nav__item > a, .primary-nav__item > .primary-nav__toggle')];
    const i = itemsEls.indexOf(document.activeElement);
    if (i === -1) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        itemsEls[(i + 1) % itemsEls.length].focus();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        itemsEls[(i - 1 + itemsEls.length) % itemsEls.length].focus();
        break;
      case 'Escape':
        closeAllDropdowns(nav);
        break;
      default:
        break;
    }
  };

  (items || []).forEach((item) => {
    const li = document.createElement('li');
    li.className = 'primary-nav__item';

    const a = makeLink(item);
    li.appendChild(a);

    if (Array.isArray(item.children) && item.children.length) {
      li.classList.add('has-dropdown');

      // Toggle for dropdown (separate from the link for clarity + a11y)
      const btn = document.createElement('button');
      btn.className = 'primary-nav__toggle';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', `Open submenu for ${item.label || 'this item'}`);
      btn.innerHTML = '<span aria-hidden="true">▾</span>';
      li.appendChild(btn);

      const sub = document.createElement('ul');
      sub.className = 'primary-nav__dropdown';
      sub.setAttribute('role', 'menu');

      item.children.forEach((child) => {
        const cli = document.createElement('li');
        cli.className = 'primary-nav__dropdown-item';
        const ca = makeLink(child);
        ca.setAttribute('role', 'menuitem');
        cli.appendChild(ca);
        sub.appendChild(cli);
      });

      li.appendChild(sub);

      // Toggle behavior
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const open = li.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        if (!open) return;
        // close others
        nav.querySelectorAll('.primary-nav__item.has-dropdown').forEach((other) => {
          if (other !== li) {
            other.classList.remove('open');
            const ob = other.querySelector('.primary-nav__toggle');
            if (ob) ob.setAttribute('aria-expanded', 'false');
          }
        });
      });

      // Keyboard in submenu
      sub.addEventListener('keydown', (e) => {
        const subLinks = [...sub.querySelectorAll('a')];
        const idx = subLinks.indexOf(document.activeElement);
        if (idx === -1) return;
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            subLinks[(idx + 1) % subLinks.length].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            subLinks[(idx - 1 + subLinks.length) % subLinks.length].focus();
            break;
          case 'Escape':
            e.preventDefault();
            btn.focus();
            btn.click();
            break;
          default:
            break;
        }
      });
    }

    ul.appendChild(li);
  });

  // Global listeners (once per render)
  document.addEventListener('click', handleDocClick, { once: true });
  ul.addEventListener('keydown', onKeyDownTop);
}

export default function decorate(block) {
  // Create a stable root container & preserve any UE nodes
  const wrapper = document.createElement('div');
  wrapper.className = 'primary-nav__root';
  while (block.firstChild) wrapper.appendChild(block.firstChild);
  block.appendChild(wrapper);

  // Ensure hidden data element exists (UE will bind JSON here via definition)
  let dataEl = wrapper.querySelector('script.primary-nav__data');
  if (!dataEl) {
    dataEl = document.createElement('script');
    dataEl.type = 'application/json';
    dataEl.className = 'primary-nav__data';
    wrapper.appendChild(dataEl);
  }

  // Initial render
  renderMenu(wrapper, safeParse(dataEl.textContent));

  // Re-render whenever UE updates the JSON (binding writes innerHTML)
  const mo = new MutationObserver(() => {
    renderMenu(wrapper, safeParse(dataEl.textContent));
  });
  mo.observe(dataEl, { characterData: true, childList: true, subtree: true });
}
