class SnazzyTab extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      const tabButtons = [...this.querySelectorAll('.snazzy-tab-button')];
      const clickedButton = event.target.closest('.snazzy-tab-button');
      const index = tabButtons.indexOf(clickedButton);
      if (index !== -1) this.updateTabs(index);
    });

    window.addEventListener('DOMContentLoaded', () => {
      this.initializeTabs();
      this.observeScrollTrigger();
    });
  }

  initializeTabs() {
    this.querySelectorAll('.snazzy-tab-content').forEach((content, index) => {
      const items = content.querySelectorAll('.content-grid-item');
      if (items.length === 0) return; // Skip if no items found

      if (index !== 0) {
        items.forEach(item => {
          item.style.opacity = '0';
          item.style.visibility = 'hidden';
          item.style.transform = 'translateY(30px)';
        });
      }
    });

    setTimeout(() => this.animateProducts(0), 100);
  }

  updateTabs(index) {
    this.querySelectorAll('.snazzy-tab-button, .snazzy-tab-content').forEach((el) => el.classList.remove('active'));
    this.querySelectorAll('.snazzy-tab-button')[index].classList.add('active');
    this.querySelectorAll('.snazzy-tab-content')[index].classList.add('active');

    this.animateProducts(index);
  }

  animateProducts(index) {
    const activeProducts = this.querySelectorAll('.snazzy-tab-content')[index]?.querySelectorAll('.content-grid-item');
    if (!activeProducts || activeProducts.length === 0) return; // Skip if no items found

    activeProducts.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.visibility = 'hidden';

      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.visibility = 'visible';
      }, i * 150);
    });
  }

  observeScrollTrigger() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateProducts(0);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this);
  }
}

customElements.define('snazzy-tab', SnazzyTab);
