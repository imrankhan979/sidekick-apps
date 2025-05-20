   class FreeShippingBar extends HTMLElement {
      constructor() {
        super();
        this.threshold = parseFloat(this.getAttribute('threshold')) || 200;
      }

      connectedCallback() {
        const cartTotal = parseFloat(this.getAttribute('cart-total')) || 0;

        // Assume that HTML structure already exists inside this element
        this.messageEl = this.querySelector('.free-shipping-text');
        this.progressEl = this.querySelector('.free-shipping-progress');

        if (this.messageEl && this.progressEl) {
          this.updateProgress(cartTotal);
        } else {
          console.warn('FreeShippingBar: Missing .free-shipping-text or .free-shipping-progress inside the element.');
        }
      }

updateProgress(cartTotal) {
  const amountLeft = this.threshold - cartTotal;
  const progressPercent = Math.min((cartTotal / this.threshold) * 100, 100);

  if (amountLeft > 0) {
    this.messageEl.innerHTML = `You’re <strong>$${amountLeft.toFixed(2)}</strong> away from free shipping.`;
  } else {
    this.messageEl.textContent = `You’ve qualified for free shipping! 🎉`;
  }

  this.progressEl.style.width = progressPercent + '%';
}

    }

    customElements.define('free-shipping-bar', FreeShippingBar);