/*global window*/

import PhotoSlideshow from './modules/PhotoSlideshow';
console.log('slideshow module loaded');
// PhotoSlideshow auto-initializes on import; add logs and defensive init calls
if (PhotoSlideshow && typeof PhotoSlideshow.init === 'function') {
  try {
    console.log('slideshow: calling PhotoSlideshow.init()');
    var __ps = PhotoSlideshow.init();
    console.log('slideshow: init result', !!__ps);
  } catch (e) {
    console.error('slideshow.init failed', e);
  }
}

// Also ensure initialization runs on DOMContentLoaded in case slideshows are injected later
if (document && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', function() {
    try {
      console.log('slideshow: DOMContentLoaded - calling PhotoSlideshow.init()');
      PhotoSlideshow.init();
    } catch (e) {
      console.error('slideshow DOMContentLoaded init failed', e);
    }
  });
}

