if (!customElements.get('countdown-timer')) {
    customElements.define(
      'countdown-timer',
      class CountdownTimer extends HTMLElement {
        constructor() {
          super();
          const countdownEnd = this.getAttribute('countdown-end');
          this.endTime = new Date(countdownEnd).getTime();
        }
  
        connectedCallback() {
          this.render();
          this.updateCountdown();
          this.interval = setInterval(() => this.updateCountdown(), 1000);
        }
  
        disconnectedCallback() {
          clearInterval(this.interval);
        }
  
        render() {
          this.innerHTML = `
              <div class="countdown_timer">
                  <div class="days">
                  <h2 class="product_single_timer">
                      <span class="digit-container" id="days"><span class="digit current">00</span><span class="digit next">00</span></span>
                  </h2>
                  <span class="item-text">Days</span>
                  </div>
              </div>
              <div class="countdown_timer">
                  <div class="hours">
                  <h2 class="product_single_timer">
                      <span class="digit-container" id="hours"><span class="digit current">00</span><span class="digit next">00</span></span>
                  </h2>
                  <span class="item-text">HOURS</span>
                  </div>
              </div>
              <div class="countdown_timer">
                  <div class="minutes">
                  <h2 class="product_single_timer">
                      <span class="digit-container" id="minutes"><span class="digit current">00</span><span class="digit next">00</span></span>
                  </h2>
                  <span class="item-text">MINUTES</span>
                  </div>
              </div>
              <div class="countdown_timer">
                  <div class="seconds">
                  <h2 class="product_single_timer">
                      <span class="digit-container" id="seconds"><span class="digit current">00</span><span class="digit next">00</span></span>
                  </h2>
                  <span class="item-text">SECONDS</span>
                  </div>
              </div>
          `;
        }
  
        animateDigitChange(containerId, newValue) {
          const container = this.querySelector(`#${containerId}`);
          const current = container.querySelector('.current');
          const next = container.querySelector('.next');
  
          if (current.textContent !== newValue) {
            next.textContent = newValue;
            container.classList.add('animate');
  
            setTimeout(() => {
              current.textContent = newValue;
              container.classList.remove('animate');
            }, 500); // match the duration of the CSS transition
          }
        }
  
        updateCountdown() {
          const now = new Date().getTime();
          const distance = this.endTime - now;
  
          let days = "00", hours = "00", minutes = "00", seconds = "00";
  
          if (distance >= 0) {
            days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
          }
  
          this.animateDigitChange('days', days);
          this.animateDigitChange('hours', hours);
          this.animateDigitChange('minutes', minutes);
          this.animateDigitChange('seconds', seconds);
        }
      }
    );
  }