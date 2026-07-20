/*global window*/

import PhotoSlideshow from './modules/PhotoSlideshow';
// PhotoSlideshow auto-initializes on import; defensive init call
if (PhotoSlideshow && typeof PhotoSlideshow.init === 'function') {
  try {
    var __ps = PhotoSlideshow.init();
  } catch (e) {
    if (window && window.DEBUG) console.error('slideshow.init failed', e);
  }
}

// Also ensure initialization runs on DOMContentLoaded in case slideshows are injected later
if (document && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', function() {
    try {
      PhotoSlideshow.init();
    } catch (e) {
      if (window && window.DEBUG) console.error('slideshow DOMContentLoaded init failed', e);
    }
  });
}

