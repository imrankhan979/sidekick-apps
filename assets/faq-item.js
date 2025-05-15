class FaqItem extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const button = this.querySelector('button[aria-expanded]');
    const content = this.querySelector('.accordion_content');
    if (!button || !content) return;
    // Start with collapsed content
    content.style.height = '0px';
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      // Collapse all
      button.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      if (isExpanded) {
        content.style.height = '0px';
      } else {
        // Temporarily remove height to measure natural height
        const fullHeight = content.scrollHeight + 'px';
        content.style.height = fullHeight;
      }
    });
  }
}
customElements.define('faq-accordion', FaqItem);