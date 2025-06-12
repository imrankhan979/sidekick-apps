  function setupCommunityVideoHover() {
    const videos = document.querySelectorAll('.slider_community_images video');
    videos.forEach((video) => {
      const parent = video.parentElement;
      if (!parent.classList.contains('hover-bound')) {
        parent.classList.add('hover-bound');
        parent.addEventListener('mouseenter', function () {
          videos.forEach((v) => {
            v.removeAttribute('autoplay');
            v.pause();
          });
          video.setAttribute('autoplay', '');
          video.play();
        });
      }
    });
  }
  document.addEventListener('DOMContentLoaded', setupCommunityVideoHover);
  document.addEventListener('shopify:section:load', setupCommunityVideoHover);