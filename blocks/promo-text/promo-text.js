export default function decorate(block) {
  console.group('promo-text: decorate()');

  // Log the initial state of the block (raw from author)
  console.log('Initial block DOM:', block);
  console.log('Initial innerHTML:', block.innerHTML);

  // Clear any table/authoring markup
  block.innerHTML = '';
  console.log('Block cleared, building structure…');

  // Create wrapper
  const root = document.createElement('div');
  root.className = 'promo-text';

  // Create target element for UE bindings
  const textEl = document.createElement('div');
  textEl.className = 'promo-text__content';

  // Optional author inline editing hints (good practice)
  textEl.setAttribute('data-aue-prop', 'text');
  textEl.setAttribute('data-aue-type', 'richtext');
  textEl.setAttribute('data-aue-label', 'Text');

  root.appendChild(textEl);
  block.appendChild(root);

  // Log structure after JS runs
  console.log('Final block structure after JS:', block.outerHTML);
  console.groupEnd();
}
