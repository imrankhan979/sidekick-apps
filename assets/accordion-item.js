// class AccordionItem extends HTMLElement {
//   constructor() {
//     super();
//   }
//   connectedCallback() {
//     const button = this.querySelector('button[aria-expanded]');
//     const content = this.querySelector('.accordion_content');
//     if (!button || !content) return;
//     // Start with collapsed content
//     content.style.height = '0px';
//     button.addEventListener('click', () => {
//       const isExpanded = button.getAttribute('aria-expanded') === 'true';
//       // Collapse all
//       button.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
//       if (isExpanded) {
//         content.style.height = '0px';
//       } else {
//         // Temporarily remove height to measure natural height
//         const fullHeight = content.scrollHeight + 'px';
//         content.style.height = fullHeight;
//       }
//     });
//   }
// }
// customElements.define('accordion-item', AccordionItem);
class AccordionItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const button = this.querySelector('button[aria-expanded]');
    const content = this.querySelector('.accordion_content');
    if (!button || !content) return;

    // Check if parent has open-first-item="true" and this is the first item
    const parent = this.parentElement;
    const openFirstAttr = parent?.querySelector('accordion-item') === this &&
                          parent?.getAttribute('open-first-item') === 'true';

    if (openFirstAttr) {
      button.setAttribute('aria-expanded', 'true');
      content.style.height = content.scrollHeight + 'px';
    } else {
      button.setAttribute('aria-expanded', 'false');
      content.style.height = '0px';
    }

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      content.style.height = isExpanded ? '0px' : content.scrollHeight + 'px';
    });
  }
}

customElements.define('accordion-item', AccordionItem);
