class MarqueeComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setupMarquee();
  }

  setupMarquee() {
    const track = this.querySelector(".marquee-track");
    const wrapper = this.querySelector(".modern-marquee");

    if (!track || !wrapper) {
      console.warn(
        "Missing .modern-marquee or .marquee-track inside <marquee-component>"
      );
      return;
    }

    const speed = parseFloat(this.getAttribute("data-speed")) || 50;
    const direction = this.getAttribute("data-direction") || "left";
    const pauseOnHover = this.getAttribute("data-pause-on-hover") !== "false"; // defaults to true

    const originalItems = [...track.children];
    const containerWidth = this.offsetWidth;
    let contentWidth = track.scrollWidth;

    // Clone items until content is at least twice the container width
    while (contentWidth < containerWidth * 2) {
      originalItems.forEach((item) => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
      contentWidth = track.scrollWidth;
    }

    const totalDistance = contentWidth / 2;
    const duration = totalDistance / speed; // duration in seconds
    const animationName =
      direction === "right" ? "scroll-right" : "scroll-left";

    track.style.animation = `${animationName} ${duration}s linear infinite`;

    // Pause on hover if enabled
    if (pauseOnHover) {
      wrapper.addEventListener("mouseenter", () => {
        track.style.animationPlayState = "paused";
      });
      wrapper.addEventListener("mouseleave", () => {
        track.style.animationPlayState = "running";
      });
    }
  }
}

customElements.define("marquee-component", MarqueeComponent);