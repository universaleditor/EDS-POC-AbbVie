// /blocks/hero-v1/hero-v1.js
export default function decorate(block) {
  console.log('[hero-v1] decorator file loaded');
  console.log('[hero-v1] decorate() called', block);

  // Build a tiny test UI so you can *see* it fired
  const test = document.createElement('div');
  test.className = 'hero-v1__proof';
  test.textContent = 'hero-v1 decorator ACTIVE ✅';
  block.prepend(test);

  // Add a marker class
  block.classList.add('hero-v1--decorated');
}
