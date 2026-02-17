(() => {
  const STORAGE_KEY = 'wf_theme_mode';
  const PROMPTED_KEY = 'wf_theme_mode_prompted';
  const root = document.documentElement;
  const supportedModes = ['light', 'dark', 'system'];

  const applyMode = (mode) => {
    if (mode === 'system') {
      root.removeAttribute('data-theme');
      return;
    }

    root.setAttribute('data-theme', mode);
  };

  const normalizeMode = (value) => {
    const raw = (value || '').toString().trim().toLowerCase();

    if (raw === 'claro' || raw === 'light') return 'light';
    if (raw === 'oscuro' || raw === 'dark') return 'dark';
    if (raw === 'sistema' || raw === 'system' || raw === 'predeterminado') return 'system';

    return 'system';
  };

  const saveMode = (mode) => {
    const safeMode = supportedModes.includes(mode) ? mode : 'system';
    localStorage.setItem(STORAGE_KEY, safeMode);
    applyMode(safeMode);
  };

  const savedMode = normalizeMode(localStorage.getItem(STORAGE_KEY));
  applyMode(savedMode);

  const alreadyPrompted = localStorage.getItem(PROMPTED_KEY) === '1';
  if (!alreadyPrompted) {
    window.setTimeout(() => {
      const choice = window.prompt(
        'Elige apariencia: claro, oscuro o sistema (predeterminado).',
        savedMode === 'system' ? 'sistema' : savedMode
      );

      saveMode(normalizeMode(choice || 'system'));
      localStorage.setItem(PROMPTED_KEY, '1');
    }, 900);
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const mode = normalizeMode(localStorage.getItem(STORAGE_KEY));
    if (mode === 'system') {
      applyMode('system');
    }
  });
})();
