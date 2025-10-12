// /blocks/hero-v1/hero-v1.js (diagnostic)
export default function decorate(block) {
  // nuke anything UE injected so we control the DOM
  block.textContent = '';

  // build a tiny, stable DOM (no 100vh, no grids, no background)
  const h = document.createElement('h2');
  h.className = 'hero-v1__headline';
  h.textContent = block.dataset.headline || '(no data)';

  // keep it small so overlays can't inflate
  const wrap = document.createElement('div');
  wrap.style.cssText = 'max-width:600px;margin:16px auto;padding:12px;border:1px solid #ddd;border-radius:8px;background:#fafafa;font:600 16px system-ui;';
  wrap.append(h);
  block.append(wrap);

  // live update when UE changes attributes on the block
  new MutationObserver(() => { h.textContent = block.dataset.headline || '(no data)'; })
    .observe(block, { attributes: true, attributeFilter: ['data-headline'] });
}
