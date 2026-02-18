(() => {
  const modal = document.getElementById('search-modal');
  if (!modal) return;

  // FIX: Use querySelectorAll — there are TWO .js-open-search elements:
  //   1. The desktop header button
  //   2. The mobile drawer link
  // querySelector only grabs the first one, so mobile search never fires.
  const openBtns = document.querySelectorAll('.js-open-search');
  const closeBtns = modal.querySelectorAll('.js-close-search');
  const input   = modal.querySelector('.js-search-input');
  const results = modal.querySelector('.js-search-results');
  const currency = modal.dataset.currency || 'MXN';

  let debounce;
  let isClosing = false;

  const formatMoney = (cents) => {
    if (typeof cents !== 'number') return '';
    return (cents / 100).toLocaleString('es-MX', { style: 'currency', currency });
  };

  const openModal = () => {
    if (!modal.hidden) return;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-active'));
    document.body.classList.add('search-modal-open');
    openBtns.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
    setTimeout(() => input?.focus(), 320);
  };

  const closeModal = () => {
    if (isClosing || modal.hidden) return;
    isClosing = true;
    modal.classList.remove('is-active');
    modal.classList.add('is-closing');
    setTimeout(() => {
      modal.classList.remove('is-closing');
      modal.hidden = true;
      isClosing = false;
    }, 420);
    document.body.classList.remove('search-modal-open');
    openBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  };

  const renderResults = (products = []) => {
    if (!input?.value.trim()) { results.innerHTML = ''; return; }
    if (!products.length) { results.innerHTML = '<p class="search-empty">Sin resultados</p>'; return; }

    results.innerHTML = products.map(p => {
      const img   = p.featured_image?.url || p.image || '';
      const price = formatMoney(p.price);
      return `
        <a class="search-item" href="${p.url}">
          <div class="search-item__image-wrap">
            ${img ? `<img src="${img}" alt="${p.title}" class="search-item__image" loading="lazy">` : ''}
          </div>
          <div class="search-item__info">
            <p class="search-item__title">${p.title}</p>
            <p class="search-item__price">${price}</p>
          </div>
        </a>`;
    }).join('');
  };

  const fetchSuggestions = async (query) => {
    const url  = `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Search failed');
    const data = await resp.json();
    renderResults(data?.resources?.results?.products || []);
  };

  // Bind ALL open buttons (desktop + mobile)
  openBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  if (input) {
    input.addEventListener('input', () => {
      const query = input.value.trim();
      clearTimeout(debounce);
      if (!query) { results.innerHTML = ''; return; }
      debounce = setTimeout(async () => {
        try { await fetchSuggestions(query); }
        catch { results.innerHTML = '<p class="search-empty">No fue posible cargar resultados</p>'; }
      }, 250);
    });
  }
})();