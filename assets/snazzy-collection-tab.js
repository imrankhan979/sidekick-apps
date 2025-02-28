class SnazzyTab extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('click', (event) => {
        const index = [...this.querySelectorAll('.snazzy-tab-button')].indexOf(event.target);
        if (index !== -1) this.updateTabs(index);
      });
    }
    updateTabs(index) {
      this.querySelectorAll('.snazzy-tab-button, .snazzy-tab-content').forEach((el) => el.classList.remove('active'));
      this.querySelectorAll('.snazzy-tab-button')[index].classList.add('active');
      this.querySelectorAll('.snazzy-tab-content')[index].classList.add('active');
    }
  }
  customElements.define('snazzy-tab', SnazzyTab);