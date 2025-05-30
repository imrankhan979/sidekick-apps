class SnazzyTab extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      const tabButtons = [...this.querySelectorAll('.snazzy-tab-button')];
      const clickedButton = event.target.closest('.snazzy-tab-button');
      const index = tabButtons.indexOf(clickedButton);
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
