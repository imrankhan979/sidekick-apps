document.querySelectorAll('.custom-scroller').forEach((carousel) => {
  const container = carousel.closest('.carousel-wrapper'); // or any shared wrapper
  const scrollbar = container.querySelector('.scrollbar');
  const thumb = container.querySelector('.scroll-thumb');

  const updateThumb = () => {
    const { scrollWidth, clientWidth, scrollLeft } = carousel;
    if (scrollWidth > clientWidth) {
      scrollbar.style.display = 'block';
      carousel.classList.add('has-scrollbar');
      const thumbWidth = (clientWidth / scrollWidth) * scrollbar.clientWidth;
      const maxLeft = scrollbar.clientWidth - thumbWidth;
      const left = (scrollLeft / (scrollWidth - clientWidth)) * maxLeft;
      thumb.style.width = `${thumbWidth}px`;
      thumb.style.transform = `translateX(${left}px)`;
    } else {
      scrollbar.style.display = 'none';
      carousel.classList.remove('has-scrollbar');
    }
  };

  carousel.addEventListener('scroll', updateThumb);
  window.addEventListener('resize', updateThumb);
  updateThumb();

  // Dragging scrollbar thumb
  let isDraggingThumb = false,
      startXThumb,
      startScrollLeftThumb;

  thumb.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDraggingThumb = true;
    startXThumb = e.clientX;
    startScrollLeftThumb = carousel.scrollLeft;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingThumb) return;
    const dx = e.clientX - startXThumb;
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    const thumbWidth = thumb.offsetWidth;
    const maxThumbX = scrollbar.clientWidth - thumbWidth;
    const scrollRatio = scrollWidth / maxThumbX;
    carousel.scrollLeft = startScrollLeftThumb + dx * scrollRatio;
  });

  document.addEventListener('mouseup', () => {
    isDraggingThumb = false;
    document.body.style.userSelect = '';
  });

  // Click scrollbar to jump
  scrollbar.addEventListener('click', (e) => {
    if (e.target !== thumb) {
      const { left: scrollbarLeft, width: scrollbarWidth } = scrollbar.getBoundingClientRect();
      const clickX = e.clientX - scrollbarLeft;
      const thumbWidth = thumb.offsetWidth;
      const maxThumbX = scrollbarWidth - thumbWidth;
      const targetThumbX = Math.min(Math.max(clickX - thumbWidth / 2, 0), maxThumbX);
      const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
      const scrollRatio = scrollWidth / maxThumbX;
      carousel.scrollLeft = targetThumbX * scrollRatio;
    }
  });

  // Drag carousel itself
  let isDraggingCarousel = false,
      startXCarousel,
      scrollLeftCarousel;

  carousel.addEventListener('mousedown', (e) => {
    isDraggingCarousel = true;
    startXCarousel = e.pageX - carousel.offsetLeft;
    scrollLeftCarousel = carousel.scrollLeft;
    carousel.classList.add('dragging');
    document.body.style.userSelect = 'none';
  });

  carousel.addEventListener('mouseleave', () => {
    isDraggingCarousel = false;
    carousel.classList.remove('dragging');
    document.body.style.userSelect = '';
  });

  carousel.addEventListener('mouseup', () => {
    isDraggingCarousel = false;
    carousel.classList.remove('dragging');
    document.body.style.userSelect = '';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDraggingCarousel) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    carousel.scrollLeft = scrollLeftCarousel - (x - startXCarousel) * 1.5;
  });
});
