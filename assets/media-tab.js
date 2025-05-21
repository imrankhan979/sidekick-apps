class MediaTab extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const tabWrapper = this.querySelector('#our-journey-tab');
    if (!tabWrapper) return;
    const [tabMnu, tabContent, tabImages] = [
      tabWrapper.querySelectorAll('.tabs_menu li'),
      tabWrapper.querySelectorAll('.our_journey_content > .tab-pane'),
      this.querySelectorAll('.our_journey_images'),
    ];
    if (!tabMnu.length || !tabContent.length) return;
    const activateTab = (tabIndex) => {
      const tabId = `tab${tabIndex}`;
      tabContent.forEach((tc, i) => {
        const isActive = tc.dataset.tab === tabId;
        tc.style.display = isActive ? 'block' : 'none';
        tc.classList.toggle('active', isActive);
      });
      tabImages.forEach((ti) => (ti.style.display = ti.dataset.tab === tabId ? 'block' : 'none'));
      tabMnu.forEach((tm) => tm.classList.remove('active'));
      tabMnu[tabIndex].classList.add('active');
    };
    tabContent.forEach((tc, i) => {
      tc.style.display = i === 0 ? 'block' : 'none';
      tc.dataset.tab = `tab${i}`;
      tc.classList.toggle('active', i === 0);
    });
    tabMnu.forEach((tm, i) => {
      tm.dataset.tab = `tab${i}`;
      tm.addEventListener('click', () => activateTab(i));
    });
    tabImages.forEach((ti, i) => {
      ti.dataset.tab = `tab${i}`;
      ti.style.display = i === 0 ? 'block' : 'none';
    });
    activateTab(0);
  }
}

customElements.define('media-tab', MediaTab);