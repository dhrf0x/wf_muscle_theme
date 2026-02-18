(() => {
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

      if (icon) {
        icon.textContent = mode === 'dark' ? '☀️' : '🌙';
      }
    }
  };

  const normalizeMode = (value) => {
    const raw = (value || '').toString().trim().toLowerCase();

    if (raw === 'claro' || raw === 'light') return 'light';
    if (raw === 'oscuro' || raw === 'dark') return 'dark';
    if (raw === 'sistema' || raw === 'system' || raw === 'predeterminado') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const saveMode = (mode) => {
    const safeMode = supportedModes.includes(mode) ? mode : 'light';
    localStorage.setItem(STORAGE_KEY, safeMode);
    applyMode(safeMode);
  };

  const savedMode = normalizeMode(localStorage.getItem(STORAGE_KEY));
  saveMode(savedMode);

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const currentMode = normalizeMode(localStorage.getItem(STORAGE_KEY));
      saveMode(currentMode === 'dark' ? 'light' : 'dark');
    });
  }

  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const menuCloseButtons = document.querySelectorAll('[data-mobile-menu-close]');
  const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  const closeMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.hidden = true;
    document.body.classList.remove('mobile-menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.hidden = false;
    document.body.classList.add('mobile-menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else openMenu();
    });
  }

  menuCloseButtons.forEach((button) => button.addEventListener('click', closeMenu));
  mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const animateQty = (input) => {
    input.classList.remove('is-updated');
    void input.offsetWidth;
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

    let currentIndex = slides.findIndex((slide) => !slide.hidden);
    if (currentIndex < 0) currentIndex = 0;

    const setActiveSlide = (nextIndex) => {
      if (slides.length === 0) return;

      const index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === index;
        slide.hidden = !isActive;
      });

      thumbs.forEach((thumb, thumbIndex) => {
        const isActive = thumbIndex === index;
        thumb.classList.toggle('is-active', isActive);
        if (isActive) thumb.setAttribute('aria-current', 'true');
        else thumb.removeAttribute('aria-current');
      });

      currentIndex = index;
    };

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        setActiveSlide(index);
      });
    });

    prevBtn?.addEventListener('click', () => setActiveSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => setActiveSlide(currentIndex + 1));

    let touchStartX = null;
    gallery.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0]?.clientX ?? null;
    }, { passive: true });

    gallery.addEventListener('touchend', (event) => {
      if (touchStartX === null) return;
      const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
      const deltaX = touchEndX - touchStartX;

      if (Math.abs(deltaX) > 40) {
        if (deltaX > 0) setActiveSlide(currentIndex - 1);
        else setActiveSlide(currentIndex + 1);
      }

      touchStartX = null;
    }, { passive: true });

    const syncVariantVisuals = (option) => {
      if (!option) return;

      if (productPrice && option.dataset.price) {
        productPrice.textContent = option.dataset.price;
      }

      if (productCompare) {
        if (option.dataset.comparePrice) {
          productCompare.hidden = false;
          productCompare.textContent = option.dataset.comparePrice;
        } else {
          productCompare.hidden = true;
        }
      }

      if (selectedVariantLabel && option.dataset.title) {
        const label = selectedVariantLabel.textContent.split(':')[0] || 'Seleccionado';
        selectedVariantLabel.textContent = `${label}: ${option.dataset.title}`;
      }

      if (inventoryNotice) {
        const inventory = Number(option.dataset.inventory || 0);
        if (inventory > 0) {
          inventoryNotice.hidden = false;
          inventoryNotice.textContent = `Quedan ${inventory} unidades disponibles.`;
        } else {
          inventoryNotice.hidden = true;
        }
      }

      if (option.dataset.imageId) {
        const imageIndex = slides.findIndex((slide) => slide.dataset.imageId === option.dataset.imageId);
        if (imageIndex >= 0) setActiveSlide(imageIndex);
      }

      variantPills.forEach((pill) => {
        const isActive = pill.dataset.variantId === option.value;
        pill.classList.toggle('is-active', isActive);
        pill.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    if (variantSelect && variantIdInput) {
      variantSelect.addEventListener('change', (event) => {
        const option = event.target.selectedOptions[0];
        if (!option) return;
        variantIdInput.value = option.value;
        syncVariantVisuals(option);
      });

      variantPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          const matchingOption = Array.from(variantSelect.options).find((option) => option.value === pill.dataset.variantId);
          if (!matchingOption || matchingOption.disabled) return;

          variantSelect.value = matchingOption.value;
          variantSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });

      syncVariantVisuals(variantSelect.selectedOptions[0]);
    }

    setActiveSlide(currentIndex);
  });
})();
