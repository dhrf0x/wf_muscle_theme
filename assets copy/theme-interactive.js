/**
 * WF Muscle Theme - Interactive Features
 * Liquid Glass & Gymshark Inspired
 */

class WFMuscleTheme {
  constructor() {
    this.init();
  }

  init() {
    this.initStickyHeader();
    this.initQuickView();
    this.initCartDrawer();
    this.initProductZoom();
    this.initQuantityInputs();
    this.initMobileMenu();
    this.initScrollAnimations();
    this.initFilterToggle();
  }

  /**
   * Sticky Header with Scroll Detection
   */
  initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add scrolled class for shadow
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show header on scroll
      if (currentScroll > lastScroll && currentScroll > headerHeight) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    });
  }

  /**
   * Quick View Modal
   */
  initQuickView() {
    const quickViewButtons = document.querySelectorAll('[data-action="quick-view"]');
    
    quickViewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const productHandle = button.dataset.productHandle;
        const productId = button.dataset.productId;
        
        this.openQuickView(productHandle || productId);
      });
    });
  }

  async openQuickView(productIdentifier) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop-glass';
    backdrop.style.opacity = '0';
    document.body.appendChild(backdrop);

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-glass quick-view-modal';
    modal.style.opacity = '0';
    modal.style.transform = 'translate(-50%, -45%)';
    modal.innerHTML = `
      <div class="modal-header">
        <button type="button" class="modal-close btn-glass" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="quick-view-loading">
          <div class="glass-shimmer" style="width: 100%; height: 400px; border-radius: 12px;"></div>
          <p style="text-align: center; margin-top: 1rem; color: #666;">Loading product...</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => {
      backdrop.style.transition = 'opacity 250ms ease';
      backdrop.style.opacity = '1';
      modal.style.transition = 'all 250ms ease';
      modal.style.opacity = '1';
      modal.style.transform = 'translate(-50%, -50%)';
    });

    // Fetch product data
    try {
      const response = await fetch(`/products/${productIdentifier}?view=quick-view`);
      const html = await response.text();
      
      modal.querySelector('.modal-body').innerHTML = html;
    } catch (error) {
      console.error('Error loading product:', error);
      modal.querySelector('.modal-body').innerHTML = `
        <p style="text-align: center; color: #ef4444;">Error loading product. Please try again.</p>
      `;
    }

    // Close handlers
    const closeModal = () => {
      backdrop.style.opacity = '0';
      modal.style.opacity = '0';
      modal.style.transform = 'translate(-50%, -45%)';
      
      setTimeout(() => {
        backdrop.remove();
        modal.remove();
      }, 250);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // ESC key to close
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  /**
   * Cart Drawer
   */
  initCartDrawer() {
    const cartTriggers = document.querySelectorAll('[data-cart-trigger]');
    const cartDrawer = document.querySelector('.cart-drawer-glass');
    
    if (!cartDrawer) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop-glass';
    backdrop.style.display = 'none';
    document.body.appendChild(backdrop);

    const openCart = () => {
      cartDrawer.classList.add('active');
      backdrop.style.display = 'block';
      setTimeout(() => backdrop.style.opacity = '1', 10);
      document.body.style.overflow = 'hidden';
    };

    const closeCart = () => {
      cartDrawer.classList.remove('active');
      backdrop.style.opacity = '0';
      setTimeout(() => {
        backdrop.style.display = 'none';
        document.body.style.overflow = '';
      }, 250);
    };

    cartTriggers.forEach(trigger => {
      trigger.addEventListener('click', openCart);
    });

    backdrop.addEventListener('click', closeCart);
    
    const closeBtn = cartDrawer.querySelector('[data-cart-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCart);
    }
  }

  /**
   * Product Image Zoom
   */
  initProductZoom() {
    const zoomableImages = document.querySelectorAll('[data-zoom]');
    
    zoomableImages.forEach(img => {
      img.style.cursor = 'zoom-in';
      
      img.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop-glass';
        modal.style.cursor = 'zoom-out';
        modal.innerHTML = `
          <img 
            src="${img.src}" 
            alt="${img.alt}"
            style="
              max-width: 90vw;
              max-height: 90vh;
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            "
          >
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => modal.style.opacity = '1', 10);
        
        modal.addEventListener('click', () => {
          modal.style.opacity = '0';
          setTimeout(() => modal.remove(), 250);
        });
      });
    });
  }

  /**
   * Quantity Inputs
   */
  initQuantityInputs() {
    const quantityContainers = document.querySelectorAll('.quantity-selector');
    
    quantityContainers.forEach(container => {
      const input = container.querySelector('input[type="number"]');
      const decreaseBtn = container.querySelector('[data-quantity-decrease]');
      const increaseBtn = container.querySelector('[data-quantity-increase]');
      
      if (!input) return;

      const min = parseInt(input.min) || 1;
      const max = parseInt(input.max) || 999;

      if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
          const currentValue = parseInt(input.value) || min;
          if (currentValue > min) {
            input.value = currentValue - 1;
            input.dispatchEvent(new Event('change'));
          }
        });
      }

      if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
          const currentValue = parseInt(input.value) || min;
          if (currentValue < max) {
            input.value = currentValue + 1;
            input.dispatchEvent(new Event('change'));
          }
        });
      }
    });
  }

  /**
   * Mobile Menu
   */
  initMobileMenu() {
    const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    
    if (!menuToggle || !mobileMenu) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop-glass';
    backdrop.style.display = 'none';
    document.body.appendChild(backdrop);

    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      
      if (mobileMenu.classList.contains('active')) {
        backdrop.style.display = 'block';
        setTimeout(() => backdrop.style.opacity = '1', 10);
        document.body.style.overflow = 'hidden';
      } else {
        backdrop.style.opacity = '0';
        setTimeout(() => {
          backdrop.style.display = 'none';
          document.body.style.overflow = '';
        }, 250);
      }
    });

    backdrop.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      backdrop.style.opacity = '0';
      setTimeout(() => {
        backdrop.style.display = 'none';
        document.body.style.overflow = '';
      }, 250);
    });
  }

  /**
   * Scroll Animations
   */
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Filter Toggle
   */
  initFilterToggle() {
    const filterTrigger = document.querySelector('[data-filter-trigger]');
    const filterPanel = document.querySelector('[data-filter-panel]');
    
    if (!filterTrigger || !filterPanel) return;

    filterTrigger.addEventListener('click', () => {
      filterPanel.classList.toggle('active');
    });
  }
}

/**
 * Cart API Utilities
 */
class CartAPI {
  static async add(items) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items })
      });
      
      if (!response.ok) throw new Error('Failed to add to cart');
      
      return await response.json();
    } catch (error) {
      console.error('Cart add error:', error);
      throw error;
    }
  }

  static async get() {
    try {
      const response = await fetch('/cart.js');
      return await response.json();
    } catch (error) {
      console.error('Cart get error:', error);
      throw error;
    }
  }

  static async update(updates) {
    try {
      const response = await fetch('/cart/update.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Cart update error:', error);
      throw error;
    }
  }

  static async change(line, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ line, quantity })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Cart change error:', error);
      throw error;
    }
  }
}

/**
 * Toast Notifications
 */
class Toast {
  static show(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast glass-strong toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      z-index: 9999;
      animation: slideInUp 250ms ease;
      max-width: 400px;
    `;
    
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    
    toast.style.background = `linear-gradient(135deg, ${colors[type]} 0%, ${colors[type]}cc 100%)`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutDown 250ms ease';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
  
  [data-animate] {
    opacity: 0;
    transform: translateY(30px);
    transition: all 600ms ease;
  }
  
  [data-animate].animate-in {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Initialize theme
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WFMuscleTheme();
  });
} else {
  new WFMuscleTheme();
}

// Export for use in other scripts
window.WFMuscleTheme = WFMuscleTheme;
window.CartAPI = CartAPI;
window.Toast = Toast;