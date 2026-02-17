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

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  menuCloseButtons.forEach((button) => button.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
})();
