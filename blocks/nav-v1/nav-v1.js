export default function decorate(block) {
  // TEMP: Just to test if this custom block is rendering!
  const eyebrow = 'This is my custom Nav V1 Block!';

  // Clear existing content
  block.innerHTML = '';

  // Insert simple test output
  const p = document.createElement('p');
  p.textContent = eyebrow;
  block.appendChild(p);
}
