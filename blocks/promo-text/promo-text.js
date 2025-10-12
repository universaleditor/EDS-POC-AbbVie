export default function decorate(block) {
  // Normalize any pasted markup
  block.innerHTML = '';

  const root = document.createElement('div');
  root.className = 'promo-text';

  // Auto-binding target for the "text" field
  const textEl = document.createElement('div');
  textEl.className = 'promo-text__content';
  textEl.setAttribute('data-aue-prop', 'text');      // <-- field name (must match model.name)
  textEl.setAttribute('data-aue-type', 'richtext');  // author UX hint; UE writes innerHTML
  textEl.setAttribute('data-aue-label', 'Text');

  root.appendChild(textEl);
  block.appendChild(root);
}
