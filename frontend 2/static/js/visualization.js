document.addEventListener('DOMContentLoaded', () => {
  const rawEl = document.querySelector('.raw-query');
  let text = rawEl.innerHTML;
  const rawFeatures = JSON.parse('{{ features | tojson | safe }}');
  const mapping = {
    sentiment: 'highlight-sentiment',
    genre: 'highlight-genre',
    mood: 'highlight-mood',
    length: 'highlight-length'
  };
  Object.entries(mapping).forEach(([key, cls]) => {
    let vals = rawFeatures[key];
    if (!vals) return;
    if (typeof vals === 'string') {
      vals = vals.split(',').map(v => v.trim());
    }
    vals.forEach(word => {
      if (!word) return;
      const safe = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${safe}\\b`, 'gi');
      text = text.replace(regex, `<span class="${cls}">$&</span>`);
    });
  });
  rawEl.innerHTML = text;
});
