(() => {
  const STORAGE_KEY = 'wf_theme_mode';
  const PROMPTED_KEY = 'wf_theme_mode_prompted';
  const root = document.documentElement;

  const applyMode = (mode) => {
    if (!mode || mode === 'system') {
      root.removeAttribute('data-theme');
      return;
    }

    root.setAttribute('data-theme', mode);
  };

  const savedMode = localStorage.getItem(STORAGE_KEY) || 'system';
  applyMode(savedMode);

  const alreadyPrompted = localStorage.getItem(PROMPTED_KEY) === '1';
  if (alreadyPrompted) return;

  window.setTimeout(() => {
    const wantsPicker = window.confirm('¿Quieres elegir apariencia?\nAceptar = elegir modo\nCancelar = usar modo del sistema');
    let mode = 'system';

    if (wantsPicker) {
      const choice = window.prompt('Escribe: claro, oscuro o sistema', savedMode === 'system' ? 'sistema' : savedMode);
      const normalized = (choice || '').trim().toLowerCase();

      if (normalized === 'claro' || normalized === 'light') mode = 'light';
      if (normalized === 'oscuro' || normalized === 'dark') mode = 'dark';
      if (normalized === 'sistema' || normalized === 'system') mode = 'system';
    }

    localStorage.setItem(STORAGE_KEY, mode);
    localStorage.setItem(PROMPTED_KEY, '1');
    applyMode(mode);
  }, 900);
})();
