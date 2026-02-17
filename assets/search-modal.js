(() => {
  const modal = document.getElementById('search-modal');
  if (!modal) return;

  const openBtn = document.querySelector('.js-open-search');
  const closeBtns = modal.querySelectorAll('.js-close-search');
  const input = modal.querySelector('.js-search-input');
  const results = modal.querySelector('.js-search-results');
  const currency = modal.dataset.currency || 'USD';
  let debounce;

  const formatMoney = (cents) => {
    if (typeof cents !== 'number') return '';
    return (cents / 100).toLocaleString('es-MX', { style: 'currency', currency });
  };

  const openModal = () => {
    modal.hidden = false;
    document.body.classList.add('search-modal-open');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => input && input.focus(), 10);
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('search-modal-open');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
  };

  const renderResults = (products = []) => {
    if (!input.value.trim()) {
      results.innerHTML = '';
      return;
    }

    if (!products.length) {
      results.innerHTML = '<p class="search-empty">Sin resultados</p>';
      return;
    }

    results.innerHTML = products.map((product) => {
      const image = (product.featured_image && product.featured_image.url) || product.image || '';
      const price = formatMoney(product.price);

      return `
        <a class="search-item" href="${product.url}">
          <div class="search-item__image-wrap">
            ${image ? `<img src="${image}" alt="${product.title}" class="search-item__image">` : ''}
          </div>
          <div class="search-item__info">
            <p class="search-item__title">${product.title}</p>
            <p class="search-item__price">${price}</p>
          </div>
        </a>
      `;
    }).join('');
  };

  const fetchSuggestions = async (query) => {
    const endpoint = `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('No se pudo buscar');
    const data = await response.json();
    const products = (data && data.resources && data.resources.results && data.resources.results.products) || [];
    renderResults(products);
  };

  if (openBtn) {
    openBtn.addEventListener('click', (event) => {
      event.preventDefault();
      openModal();
    });
  }

  closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  if (input) {
    input.addEventListener('input', () => {
      const query = input.value.trim();
      clearTimeout(debounce);

      if (!query) {
        results.innerHTML = '';
        return;
      }

      debounce = setTimeout(async () => {
        try {
          await fetchSuggestions(query);
        } catch (error) {
          results.innerHTML = '<p class="search-empty">No fue posible cargar resultados</p>';
        }
      }, 250);
    });
  }
})();
