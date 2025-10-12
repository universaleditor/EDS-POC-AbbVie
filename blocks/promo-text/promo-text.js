export default function decorate(block) {
  console.group('promo-text: decorate()');

  // Log the initial state of the block before we touch it
  console.log('Initial block DOM:', block);
  console.log('Initial innerHTML:', block.innerHTML);

  // Clear authoring placeholder markup (tables/p tags, etc)
  block.innerHTML = '';
  console.log('Block cleared, building structure…');

  // Create wrapper div
  const root = document.createElement('div');
  root.className = 'promo-text';

  // Create UE binding target for `text`
  const textEl = document.createElement('div');
  textEl.className = 'promo-text__content';

  // These attributes allow UE to bind the model field
  textEl.setAttribute('data-aue-prop', 'text');
  textEl.setAttribute('data-aue-type', 'richtext');
  textEl.setAttribute('data-aue-label', 'Text');

  root.appendChild(textEl);
  block.appendChild(root);

  // Log final structure after decorate()
  console.log('Final block structure after JS:', block.outerHTML);

  // Check after Universal Editor (UE) tries to bind values
  setTimeout(() => {
    console.log('🔥 AFTER UE binding (should contain authored text):', block.outerHTML);
  }
