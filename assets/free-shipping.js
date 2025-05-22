 class FreeShippingBar extends HTMLElement {
    constructor() {
      super();
      this.threshold = parseFloat(this.getAttribute('threshold')) || 200;
    }

    connectedCallback() {
      this.messageEl = this.querySelector('.free-shipping-text');
      this.progressEl = this.querySelector('.free-shipping-progress');

      if (!this.messageEl || !this.progressEl) return;

      this.updateFromCart();
    }

    updateFromCart() {
      fetch('/cart.js')
        .then((res) => res.json())
        .then((cart) => {
          const cartTotal = cart.total_price / 100;
          this.updateProgress(cartTotal);
        });
    }

    updateProgress(cartTotal) {
      const amountLeft = this.threshold - cartTotal;
      const percent = Math.min((cartTotal / this.threshold) * 100, 100);

      this.messageEl.innerHTML =
        amountLeft > 0
          ? `You’re <strong>$${amountLeft.toFixed(2)}</strong> away from free shipping.`
          : `You’ve qualified for free shipping! 🎉`;

      this.progressEl.style.width = percent + '%';
    }
  }

  customElements.define('free-shipping-bar', FreeShippingBar);

  // ✅ Event Delegation: Listen for any future .quantity__button clicks
document.addEventListener('click', (e) => {
    const isQtyButton = e.target.closest('.quantity__button');
    const isRemoveBtn = e.target.closest('[href*="/cart/change"]') || e.target.closest('button[name="updates[]"][value="0"]');

    if (isQtyButton || isRemoveBtn) {
      // Delay to let Shopify AJAX update the cart first
      setTimeout(() => {
        document.querySelectorAll('free-shipping-bar').forEach((bar) => {
          bar.updateFromCart?.();
        });
      }, 2000);
    }
  });

  // Initial load
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('free-shipping-bar').forEach((bar) => {
      bar.updateFromCart?.();
    });
  });