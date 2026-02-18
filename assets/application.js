(() => {
  // ─── MOBILE MENU ────────────────────────────────────────────────
  // Pattern: remove [hidden] first → rAF → add .is-open (triggers CSS transitions)
  // Closing: remove .is-open → wait for transition → add [hidden] back
  // NEVER set display:block on .mobile-menu in CSS — invisible fixed overlay
  // blocks ALL touch events on mobile!
  const mobileMenu    = document.getElementById('mobile-menu-drawer');
  const menuToggle    = document.querySelector('[data-mobile-menu-toggle]');
  const menuCloseBtns = document.querySelectorAll('[data-mobile-menu-close]');
  const MENU_DURATION = 360; // ms — must match CSS transition

  const openMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.hidden = false;
    document.body.classList.add('mobile-menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
    });
  };

  const closeMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      mobileMenu.hidden = true;
      document.body.classList.remove('mobile-menu-open');
    }, MENU_DURATION);
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });
  }
  menuCloseBtns.forEach(btn => btn.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // ─── QUANTITY STEPPER ───────────────────────────────────────────
  const animateQty = (input) => {
    input.classList.remove('is-updated');
    void input.offsetWidth;
    input.classList.add('is-updated');
  };

  document.querySelectorAll('[data-quantity-stepper]').forEach(stepper => {
    const input  = stepper.querySelector('input[type="number"]');
    const incBtn = stepper.querySelector('[data-qty-increase]');
    const decBtn = stepper.querySelector('[data-qty-decrease]');
    if (!input) return;

    const update = (delta) => {
      const min  = Number(input.min || 0);
      const max  = input.max ? Number(input.max) : null;
      let   next = Number(input.value || 0) + delta;
      if (next < min) next = min;
      if (max !== null && next > max) next = max;
      input.value = String(next);
      input.dispatchEvent(new Event('change', { bubbles: true }));
      animateQty(input);
    };

    incBtn?.addEventListener('click', () => update(1));
    decBtn?.addEventListener('click', () => update(-1));
  });

  // ─── PRODUCT GALLERY ────────────────────────────────────────────
  // Uses style.display instead of element.hidden / [hidden] attribute
  // to avoid CSS specificity fights and cross-browser inconsistencies.
  document.querySelectorAll('[data-product-gallery]').forEach(gallery => {
    const slides   = Array.from(gallery.querySelectorAll('[data-product-slide]'));
    const thumbs   = Array.from(gallery.querySelectorAll('[data-product-thumb]'));
    const prevBtn  = gallery.querySelector('[data-gallery-prev]');
    const nextBtn  = gallery.querySelector('[data-gallery-next]');
    const section  = gallery.closest('.product-page');

    const variantSelect        = section?.querySelector('[data-variant-select]');
    const variantIdInput       = section?.querySelector('[data-variant-id-input]');
    const productPrice         = section?.querySelector('[data-product-price]');
    const productCompare       = section?.querySelector('.product-page__compare');
    const inventoryNotice      = section?.querySelector('.product-page__inventory');
    const selectedVariantLabel = section?.querySelector('[data-selected-variant]');
    const variantPills         = Array.from(section?.querySelectorAll('[data-variant-option]') || []);

    if (!slides.length) return;

    // Initialise: use style.display so it overrides any CSS rule.
    // Remove the HTML [hidden] attribute first so only JS controls visibility.
    slides.forEach(s => s.removeAttribute('hidden'));

    // Determine start index from data-image-index="0" being visible, else 0
    let currentIndex = Number(gallery.dataset.initialIndex || 0);
    if (Number.isNaN(currentIndex)) currentIndex = 0;

    // Immediately hide all then show the active one
    const setActiveSlide = (next) => {
      const idx = ((next % slides.length) + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.style.display = i === idx ? 'block' : 'none';
      });
      thumbs.forEach((t, i) => {
        const active = i === idx;
        t.classList.toggle('is-active', active);
        if (active) t.setAttribute('aria-current', 'true');
        else t.removeAttribute('aria-current');
      });
      currentIndex = idx;
    };

    // Init display
    setActiveSlide(currentIndex);

    thumbs.forEach((t, i) => t.addEventListener('click', () => setActiveSlide(i)));
    prevBtn?.addEventListener('click', () => setActiveSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => setActiveSlide(currentIndex + 1));

    // Touch/swipe
    let touchStartX = null;
    gallery.addEventListener('touchstart', e => {
      touchStartX = e.touches[0]?.clientX ?? null;
    }, { passive: true });
    gallery.addEventListener('touchend', e => {
      if (touchStartX === null) return;
      const dx = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
      if (Math.abs(dx) > 40) setActiveSlide(currentIndex + (dx > 0 ? -1 : 1));
      touchStartX = null;
    }, { passive: true });

    // Variant sync
    const syncVariant = (opt) => {
      if (!opt) return;
      if (productPrice && opt.dataset.price)    productPrice.textContent = opt.dataset.price;
      if (productCompare) {
        productCompare.style.display = opt.dataset.comparePrice ? '' : 'none';
        if (opt.dataset.comparePrice) productCompare.textContent = opt.dataset.comparePrice;
      }
      if (selectedVariantLabel && opt.dataset.title) {
        const prefix = selectedVariantLabel.textContent.split(':')[0] || 'Seleccionado';
        selectedVariantLabel.textContent = `${prefix}: ${opt.dataset.title}`;
      }
      if (inventoryNotice) {
        const inv = Number(opt.dataset.inventory || 0);
        inventoryNotice.style.display = (inv > 0 && inv <= 10) ? 'flex' : 'none';
        if (inv > 0) inventoryNotice.textContent = `Quedan ${inv} unidades disponibles.`;
      }
      if (opt.dataset.mediaId) {
        const idx = slides.findIndex(s => s.dataset.mediaId === opt.dataset.mediaId);
        if (idx >= 0) setActiveSlide(idx);
      }
      variantPills.forEach(p => {
        const active = p.dataset.variantId === opt.value;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-selected', String(active));
      });
    };

    if (variantSelect && variantIdInput) {
      variantSelect.addEventListener('change', e => {
        const opt = e.target.selectedOptions[0];
        if (!opt) return;
        variantIdInput.value = opt.value;
        syncVariant(opt);
      });

      variantPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const match = Array.from(variantSelect.options).find(o => o.value === pill.dataset.variantId);
          if (!match || match.disabled) return;
          variantSelect.value = match.value;
          variantSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });

      syncVariant(variantSelect.selectedOptions[0]);
    }
  });
})();