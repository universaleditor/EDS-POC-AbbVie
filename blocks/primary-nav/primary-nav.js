function safeParse(s) {
  try { return JSON.parse(s || '[]') || []; } catch { return []; }
}

function makeLink({ label = '', href = '', newWindow = false }) {
  const a = document.createElement('a');
  a.textContent = label || '';
  if (href) a.href = href;
  if (newWindow) a.target = '_blank';
  return a;
}

function renderMenu(root, items) {
  const dataEl = root.querySelector('script.primary-nav__data');

  // debug
  console.group('primary-nav render');
  console.log('raw JSON:', (dataEl && dataEl.textContent || '').slice(0, 200));
  console.log('parsed items:', items);
  console.groupEnd();

  // rebuild nav (keep dataEl)
  const prev = root.querySelector('nav.primary-nav');
  if (prev) prev.remove();

  const nav = document.createElement('nav');
  nav.className = 'primary-nav';
  nav.setAttribute('aria-label', 'Primary navigation');
  const ul = document.createElement('ul');
  ul.className = 'primary-nav__list';
  nav.appendChild(ul);
  root.appendChild(nav);

  (items || []).forEach((item) => {
    const li = document.createElement('li');
    li.className = 'primary-nav__item';
    li.appendChild(makeLink(item));

    if (Array.isArray(item.children) && item.children.length) {
      li.classList.add('has-dropdown');

      const btn = document.createElement('button');
      btn.className = 'primary-nav__toggle';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span aria-hidden="true">▾</span>';
      li.appendChild(btn);

      const sub = document.createElement('ul');
      sub.className = 'primary-nav__dropdown';
      item.children.forEach((child) => {
        const cli = document.createElement('li');
        cli.className = 'primary-nav__dropdown-item';
        cli.appendChild(makeLink(child));
        sub.appendChild(cli);
      });
      li.appendChild(sub);

      btn.addEventListener('click', () => {
        const open = li.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
    }

    ul.appendChild(li);
  });
}

export default function decorate(block) {
  // root
  const wrapper = document.createElement('div');
  wrapper.className = 'primary-nav__root';
  while (block.firstChild) wrapper.appendChild(block.firstChild);
  block.appendChild(wrapper);

  // ensure data node for UE binding
  let dataEl = wrapper.querySelector('script.primary-nav__data');
  if (!dataEl) {
    dataEl = document.createElement('script');
    dataEl.type = 'application/json';
    dataEl.className = 'primary-nav__data';
    wrapper.appendChild(dataEl);
  }

  // initial + reactive render
  renderMenu(wrapper, safeParse(dataEl.textContent));

  const mo = new MutationObserver(() => {
    renderMenu(wrapper, safeParse(dataEl.textContent));
  });
  mo.observe(dataEl, { characterData: true, childList: true, subtree: true });
}
