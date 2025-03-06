class SnazzyTab extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      const index = [...this.querySelectorAll('.snazzy-tab-button')].indexOf(event.target);
      if (index !== -1) this.updateTabs(index);
    });
    window.addEventListener('DOMContentLoaded', () => {
      this.initializeTabs();
    });
  }
  initializeTabs() {
    // Hide all products except first active tab
    this.querySelectorAll('.snazzy-tab-content').forEach((content, index) => {
      if (index !== 0) {
        content.querySelectorAll('.content-grid-item').forEach(item => item.style.opacity = '0');
      }
    });
    setTimeout(() => this.animateProducts(0), 400);
  }
  updateTabs(index) {
    this.querySelectorAll('.snazzy-tab-button, .snazzy-tab-content').forEach((el) => el.classList.remove('active'));
    this.querySelectorAll('.snazzy-tab-button')[index].classList.add('active');
    this.querySelectorAll('.snazzy-tab-content')[index].classList.add('active');
    this.animateProducts(index);
  }
  animateProducts(index) {
    const activeProducts = this.querySelectorAll('.snazzy-tab-content')[index].querySelectorAll('.content-grid-item');
    activeProducts.forEach((item, i) => {
      item.style.opacity = '0'; 
      item.style.transform = 'translateY(30px)';
      item.style.visibility = "hidden"
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.visibility = "visible"
      }, i * 150); 
    });
  }
}
customElements.define('snazzy-tab', SnazzyTab);
