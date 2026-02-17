# WF Muscle Theme - Versión Corregida y Mejorada

## 🎯 Descripción

Tema de Shopify optimizado para tiendas de ropa deportiva, fitness y lifestyle con diseño minimalista estilo "Muscle/Gym". Inspirado en marcas como Gymshark, YoungLA y similares.

**Versión:** 3.3.1 - Fixed  
**Compatible con:** Shopify OS 2.0+  
**Última actualización:** Febrero 2026

---

## ✨ Características Principales

### Diseño
- ✅ Grilla densa de 5 columnas (desktop)
- ✅ Diseño minimalista y limpio
- ✅ Efectos de vidrio (glass effects)
- ✅ Animaciones suaves y modernas
- ✅ Typography system escalable
- ✅ Hover effects en imágenes de productos

### Performance
- ✅ CSS optimizado con variables
- ✅ JavaScript modular y diferido
- ✅ Preconnect a CDNs críticos
- ✅ Lazy loading de imágenes
- ✅ Font-display: swap

### Responsive Design
- ✅ Mobile First
- ✅ 4 breakpoints optimizados
- ✅ Touch-friendly buttons (min 45px)
- ✅ Grillas adaptativas

### Accesibilidad (WCAG 2.1 AA)
- ✅ Skip to content link
- ✅ Estados :focus-visible
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ prefers-reduced-motion
- ✅ Contraste de color adecuado

### SEO
- ✅ Meta tags completos
- ✅ Open Graph para redes sociales
- ✅ Twitter Cards
- ✅ Structured data ready
- ✅ Canonical URLs

---

## 🔧 Correcciones Aplicadas

### Problemas Críticos Resueltos

1. **HTML Mal Estructurado** ✅
   - CSS ahora está dentro del `<head>`
   - Estructura HTML5 válida
   - Meta tags completos

2. **CSS Incompleto** ✅
   - Sistema de variables CSS completo
   - Reset CSS adecuado
   - Sistema tipográfico escalable
   - Componentes bien estructurados

3. **Responsive Deficiente** ✅
   - 4 breakpoints en lugar de 2
   - Transiciones suaves entre layouts
   - Grid system mejorado

4. **Sin Accesibilidad** ✅
   - Cumple WCAG 2.1 AA
   - Navegación por teclado
   - Screen reader friendly

5. **JavaScript con Errores** ✅
   - Estructura modular correcta
   - Sin errores 404
   - Context global apropiado

Ver [CORRECCIONES_Y_MEJORAS.md](./CORRECCIONES_Y_MEJORAS.md) para detalles completos.

---

## 📦 Instalación

### Opción 1: Instalación Manual

1. **Backup del tema actual:**
   ```
   Shopify Admin > Online Store > Themes > Actions > Duplicate
   ```

2. **Descargar tema corregido:**
   - Descarga el archivo ZIP completo
   - Descomprime en tu computadora

3. **Subir a Shopify:**
   ```
   Shopify Admin > Online Store > Themes > Add theme > Upload ZIP file
   ```

4. **Activar tema:**
   ```
   Actions > Publish
   ```

### Opción 2: Archivos Individuales

Si ya tienes el tema instalado, solo reemplaza:

1. **Archivos principales:**
   - `/layout/theme.liquid`
   - `/assets/base.css`
   - `/assets/components.css` (nuevo)

2. **Archivos opcionales (mejorados):**
   - `/snippets/product-card-improved.liquid` (nuevo)
   - Otros archivos según necesites

---

## 🚀 Configuración Inicial

### 1. Configurar Colores

```
Shopify Admin > Online Store > Themes > Customize > Colors
```

Configura:
- Background (BG): #000000
- Texto (Foreground): #ffffff
- Primario (Primary): #ffffff
- Bordes (Border): #333333

### 2. Configurar Tipografía

```
Theme Settings > Typography
```

Recomendaciones:
- **Headings:** Inter Black / Helvetica Bold
- **Body:** Inter Regular / Helvetica
- **Font Scale:** 1.0 - 1.2

### 3. Configurar Layout

```
Theme Settings > Global Design
```

- **Button Border Radius:** 0px (para estilo cuadrado) o 4-8px (para suave)
- **Badge Corner Radius:** 0px o 4px
- **Grid Gap:** 10-20px

### 4. Configurar Header

```
Sections > Header
```

- Logo (max 40px height recomendado)
- Menú principal
- Iconos de cuenta y carrito

---

## 📱 Breakpoints

```css
Mobile:        < 750px   (2 columnas)
Tablet:        750px+    (3 columnas)
Desktop:       990px+    (4 columnas)
Large Desktop: 1200px+   (5 columnas)
```

---

## 🎨 Personalización

### Modificar Variables CSS

Edita `/assets/base.css`:

```css
:root {
  /* Layout */
  --header-height: 70px;
  --page-width: 1600px;
  
  /* Spacing */
  --spacing-sections-desktop: 80px;
  --spacing-sections-mobile: 50px;
  
  /* Colors */
  --color-base-text: #ffffff;
  --color-base-background: #000000;
  --color-base-accent: #ffffff;
  
  /* Animation */
  --animation-speed: 0.3s;
}
```

### Añadir Sección Personalizada

1. Crea archivo en `/sections/`
2. Usa la estructura de bloques existente
3. Añade a templates según necesites

### Modificar Product Card

Usa el snippet mejorado:

```liquid
{% render 'product-card-improved', 
  product: product,
  show_quick_add: true,
  show_secondary_image: true,
  image_ratio: 'portrait'
%}
```

---

## 🧪 Testing

### Checklist Pre-Launch

- [ ] Probar en Chrome, Firefox, Safari, Edge
- [ ] Probar en móvil real (iOS y Android)
- [ ] Verificar accesibilidad con keyboard
- [ ] Revisar console sin errores 404
- [ ] Lighthouse score > 90
- [ ] Validar HTML en https://validator.w3.org/
- [ ] Test de accesibilidad en https://wave.webaim.org/

### Herramientas

```bash
# Shopify Theme Check
shopify theme check

# Lighthouse (Chrome DevTools)
DevTools > Lighthouse > Generate Report
```

---

## 📊 Performance

### Métricas Objetivo

- **Lighthouse Performance:** > 90
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Total Blocking Time:** < 200ms
- **Cumulative Layout Shift:** < 0.1

### Optimizaciones Incluidas

✅ Critical CSS inline (via Liquid)  
✅ Deferred JavaScript  
✅ Font preloading  
✅ Image lazy loading  
✅ Responsive images con srcset  
✅ Minimized render-blocking resources

---

## 🐛 Troubleshooting

### Problema: Estilos no se cargan

**Solución:**
1. Verifica que `base.css` esté en `/assets/`
2. Limpia caché del navegador
3. Verifica Theme Editor para errores

### Problema: Grilla se ve mal en móvil

**Solución:**
1. Verifica viewport meta tag en theme.liquid
2. Revisa media queries en base.css
3. Prueba en diferentes dispositivos

### Problema: JavaScript errors

**Solución:**
1. Verifica que todos los archivos .js existen
2. Revisa console para archivos faltantes
3. Verifica orden de carga de scripts

### Problema: Imágenes no cargan

**Solución:**
1. Verifica formato de image_url filters
2. Revisa permisos de archivos
3. Verifica CDN de Shopify

---

## 📚 Recursos

### Documentación Oficial

- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)
- [Theme Kit](https://shopify.dev/themes/tools/theme-kit)

### Herramientas Útiles

- [Shopify Theme Inspector](https://chrome.google.com/webstore/detail/shopify-theme-inspector/fndnankcflemoafdeboboehphmiijkgp)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [WAVE Accessibility Tool](https://wave.webaim.org/)

### Inspiración de Diseño

- [Gymshark](https://www.gymshark.com/)
- [YoungLA](https://www.youngla.com/)
- [Alphalete](https://alphaleteathletics.com/)
- [Nvgtn](https://nvgtn.com/)

---

## 🤝 Soporte

### Obtener Ayuda

1. **Revisa la documentación:** [CORRECCIONES_Y_MEJORAS.md](./CORRECCIONES_Y_MEJORAS.md)
2. **Shopify Community:** https://community.shopify.com/
3. **Shopify Experts:** https://experts.shopify.com/

### Reportar Bugs

Incluye en tu reporte:
- Versión del tema
- Navegador y versión
- Pasos para reproducir
- Screenshots o video
- Console errors (si aplica)

---

## 📝 Changelog

### v3.3.1-fixed (Febrero 2026)

**Correcciones Críticas:**
- ✅ HTML structure fixed (CSS in head)
- ✅ Complete meta tags system
- ✅ Robust CSS base system
- ✅ Improved responsive grid (4 breakpoints)
- ✅ WCAG 2.1 AA accessibility
- ✅ Fixed JavaScript context
- ✅ Performance optimizations

**Mejoras:**
- ➕ New component.css file
- ➕ Improved product card snippet
- ➕ Better typography system
- ➕ Enhanced button states
- ➕ Loading states & animations
- ➕ Print styles
- ➕ Comprehensive documentation

**Ver:** [CORRECCIONES_Y_MEJORAS.md](./CORRECCIONES_Y_MEJORAS.md) para detalles completos.

---

## 📄 Licencia

Este tema es una versión mejorada del tema base WF Muscle Glass. 
Para uso en proyectos Shopify.

---

## 🙏 Créditos

- **Diseño original:** WF Muscle Glass
- **Correcciones y mejoras:** Febrero 2026
- **Inspiración:** Gymshark, YoungLA, Alphalete

---

**¿Necesitas más ayuda?** Consulta [CORRECCIONES_Y_MEJORAS.md](./CORRECCIONES_Y_MEJORAS.md) para guía detallada de todas las mejoras.

