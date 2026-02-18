(() => {
  // ─── THEME TOGGLE ───────────────────────────────────────────────
  const STORAGE_KEY = 'wf_theme_mode';
  const root = document.documentElement;
  const supportedModes = ['light', 'dark'];
  const toggleButton = document.querySelector('[data-theme-toggle]');

  const applyMode = (mode) => {
    root.setAttribute('data-theme', mode);
    if (toggleButton) {
      const icon = toggleButton.querySelector('.theme-toggle__icon');
      const label = mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
      toggleButton.setAttribute('aria-label', label);
      toggleButton.setAttribute('title', label);
      if (icon) icon.textContent = mode === 'dark' ? '☀️' : '🌙';
    }
  };

  const normalizeMode = (value) => {
    const raw = (value || '').toString().trim().toLowerCase();
    if (raw === 'claro' || raw === 'light') return 'light';
    if (raw === 'oscuro' || raw === 'dark') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const saveMode = (mode) => {
    const safeMode = supportedModes.includes(mode) ? mode : 'light';
    localStorage.setItem(STORAGE_KEY, safeMode);
    applyMode(safeMode);
  };

  saveMode(normalizeMode(localStorage.getItem(STORAGE_KEY)));

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      saveMode(normalizeMode(localStorage.getItem(STORAGE_KEY)) === 'dark' ? 'light' : 'dark');
    });
  }

  // ─── MOBILE MENU ────────────────────────────────────────────────
  // FIX: We use an `is-open` CSS class for the slide animation instead of
  // relying on the [hidden] attribute for transitions.
  //
  // WHY: If we set `display: block` in CSS to override [hidden] for animation,
  // the invisible menu (opacity:0 / position:fixed inset:0) blocks ALL touch
  // events on mobile — making the page feel completely unresponsive.
  //
  // The pattern:
  //   OPEN  → remove [hidden] → rAF → add .is-open (triggers CSS transition)
  //   CLOSE → remove .is-open → wait for transition → add [hidden]
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const menuCloseButtons = document.querySelectorAll('[data-mobile-menu-close]');
  const MENU_TRANSITION_MS = 340;

  const openMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    // 1. Remove [hidden] so the element enters the DOM (display:block via :not([hidden]) CSS rule)
    mobileMenu.hidden = false;
    document.body.classList.add('mobile-menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    // 2. Force two animation frames so the browser paints the element before
    //    adding .is-open, allowing CSS transitions to fire properly.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mobileMenu.classList.add('is-open');
      });
    });
  };

  const closeMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    // 1. Remove .is-open → triggers the slide-out / fade-out CSS transitions
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    // 2. After the transition finishes, add [hidden] back so the element is
    //    fully removed from layout and cannot intercept any pointer events.
    window.setTimeout(() => {
      mobileMenu.hidden = true;
      document.body.classList.remove('mobile-menu-open');
    }, MENU_TRANSITION_MS);
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else openMenu();
    });
  }

  menuCloseButtons.forEach((btn) => btn.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // ─── QUANTITY STEPPER ───────────────────────────────────────────
  const animateQty = (input) => {
    input.classList.remove('is-updated');
    void input.offsetWidth; // force reflow
    input.classList.add('is-updated');
  };

  document.querySelectorAll('[data-quantity-stepper]').forEach((stepper) => {
    const input = stepper.querySelector('input[type="number"]');
    const increaseBtn = stepper.querySelector('[data-qty-increase]');
    const decreaseBtn = stepper.querySelector('[data-qty-decrease]');
    if (!input) return;

    const updateValue = (delta) => {
      const current = Number(input.value || 0);
      const min = Number(input.min || 0);
      const max = input.max ? Number(input.max) : null;
      let next = current + delta;
      if (next < min) next = min;
      if (max !== null && next > max) next = max;
      input.value = String(next);
      input.dispatchEvent(new Event('change', { bubbles: true }));
      animateQty(input);
    };

    increaseBtn?.addEventListener('click', () => updateValue(1));
    decreaseBtn?.addEventListener('click', () => updateValue(-1));
  });

  // ─── PRODUCT GALLERY ────────────────────────────────────────────
  document.querySelectorAll('[data-product-gallery]').forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll('[data-product-slide]'));
    const thumbs = Array.from(gallery.querySelectorAll('[data-product-thumb]'));
    const prevBtn = gallery.querySelector('[data-gallery-prev]');
    const nextBtn = gallery.querySelector('[data-gallery-next]');
    const section = gallery.closest('.product-page');
    const variantSelect = section?.querySelector('[data-variant-select]');
    const variantIdInput = section?.querySelector('[data-variant-id-input]');
    const productPrice = section?.querySelector('[data-product-price]');
    const productCompare = section?.querySelector('.product-page__compare');
    const inventoryNotice = section?.querySelector('.product-page__inventory');
    const selectedVariantLabel = section?.querySelector('[data-selected-variant]');
    const variantPills = Array.from(section?.querySelectorAll('[data-variant-option]') || []);

    if (slides.length === 0) return;

    let currentIndex = slides.findIndex((s) => !s.hidden);
    if (currentIndex < 0) currentIndex = 0;

    const setActiveSlide = (nextIndex) => {
      const index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== index; });
      thumbs.forEach((thumb, i) => {
        const active = i === index;
        thumb.classList.toggle('is-active', active);
        if (active) thumb.setAttribute('aria-current', 'true');
        else thumb.removeAttribute('aria-current');
      });
      currentIndex = index;
    };

    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => setActiveSlide(i)));
    prevBtn?.addEventListener('click', () => setActiveSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => setActiveSlide(currentIndex + 1));

    // Touch swipe
    let touchStartX = null;
    gallery.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0]?.clientX ?? null;
    }, { passive: true });
    gallery.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
      if (Math.abs(dx) > 40) setActiveSlide(currentIndex + (dx > 0 ? -1 : 1));
      touchStartX = null;
    }, { passive: true });

    // Variant sync
    const syncVariantVisuals = (option) => {
      if (!option) return;
      if (productPrice && option.dataset.price) productPrice.textContent = option.dataset.price;
      if (productCompare) {
        productCompare.hidden = !option.dataset.comparePrice;
        if (option.dataset.comparePrice) productCompare.textContent = option.dataset.comparePrice;
      }
      if (selectedVariantLabel && option.dataset.title) {
        const prefix = selectedVariantLabel.textContent.split(':')[0] || 'Seleccionado';
        selectedVariantLabel.textContent = `${prefix}: ${option.dataset.title}`;
      }
      if (inventoryNotice) {
        const inv = Number(option.dataset.inventory || 0);
        inventoryNotice.hidden = inv <= 0;
        if (inv > 0) inventoryNotice.textContent = `Quedan ${inv} unidades disponibles.`;
      }
      if (option.dataset.imageId) {
        const idx = slides.findIndex((s) => s.dataset.imageId === option.dataset.imageId);
        if (idx >= 0) setActiveSlide(idx);
      }
      variantPills.forEach((pill) => {
        const active = pill.dataset.variantId === option.value;
        pill.classList.toggle('is-active', active);
        pill.setAttribute('aria-selected', String(active));
      });
    };

    if (variantSelect && variantIdInput) {
      variantSelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        if (!opt) return;
        variantIdInput.value = opt.value;
        syncVariantVisuals(opt);
      });

      variantPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          const match = Array.from(variantSelect.options).find((o) => o.value === pill.dataset.variantId);
          if (!match || match.disabled) return;
          variantSelect.value = match.value;
          variantSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });

      syncVariantVisuals(variantSelect.selectedOptions[0]);
    }

    setActiveSlide(currentIndex);
  });
})();