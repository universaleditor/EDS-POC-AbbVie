function findEyebrow(block) {
  // 1) data-* on the block (most common in UE)
  if (block.dataset && typeof block.dataset.eyebrow !== 'undefined') {
    return { value: block.dataset.eyebrow, source: 'data-eyebrow (dataset)' };
  }
  const attrVal = block.getAttribute('data-eyebrow');
  if (attrVal !== null) {
    return { value: attrVal, source: 'data-eyebrow (attribute)' };
  }

  // 2) inline JSON: <script type="application/json">{ "fields":[{ "name":"Eyebrow","value":"..." }] }</script>
  const jsonEl = block.querySelector(':scope > script[type="application/json"]');
  if (jsonEl) {
    try {
      const data = JSON.parse(jsonEl.textContent || '{}');
      if (Array.isArray(data.fields)) {
        const f = data.fields.find((x) => String(x.name || '').toLowerCase() === 'eyebrow');
        if (f && (f.value ?? f.text ?? f.html)) {
          return { value: f.value ?? f.text ?? f.html, source: 'inline JSON (fields[].value)' };
        }
      }
      if (typeof data.Eyebrow !== 'undefined') {
        return { value: data.Eyebrow, source: 'inline JSON (Eyebrow key)' };
      }
    } catch (e) {
      console.warn('nav-v1: failed to parse inline JSON', e);
    }
  }

  return { value: null, source: 'not found' };
}

export default function decorate(block) {
  const { value, source } = findEyebrow(block);

  // Diagnostics in console
  console.group('nav-v1 debug');
  console.log('block:', block);
  console.log('dataset:', block.dataset);
  console.log('Eyebrow value:', value);
  console.log('Source:', source);
  console.groupEnd();

  // Clear and render
  block.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'nav-v1';

  const eyebrowEl = document.createElement('div');
  eyebrowEl.className = 'nav-v1-eyebrow';

  // If the field uses richtext and produces HTML, allow it; else textContent
  if (value && /<\w/.test(value)) {
    eyebrowEl.innerHTML = value;
  } else {
    eyebrowEl.textContent = value ?? 'No eyebrow set';
  }

  // Tiny badge to show where we read from (helps verify quickly in-page)
  const badge = document.createElement('small');
  badge.className = 'nav-v1-source';
  badge.textContent = `source: ${source}`;
  badge.style.display = 'block';
  badge.style.opacity = '0.6';
  badge.style.fontSize = '12px';
  badge.style.marginTop = '4px';

  wrap.appendChild(eyebrowEl);
  wrap.appendChild(badge);
  block.appendChild(wrap);
}
