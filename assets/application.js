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
})();
