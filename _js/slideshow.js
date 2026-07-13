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
  // QuillLoader dispatches `photo-slideshow:quill-ready` after it creates slideshow markup.
  // Listen for that event so PhotoSlideshow can initialize deterministically when Quill finishes.
  document.addEventListener('photo-slideshow:quill-ready', function() {
    try {
      console.log('slideshow: received photo-slideshow:quill-ready');
      PhotoSlideshow.init();
      console.log('slideshow: init called after quill-ready');
    } catch (e) {
      if (window.DEBUG) console.warn('PhotoSlideshow.init failed (quill-ready)', e);
    }
  }, false);

  document.addEventListener('DOMContentLoaded', function() {
    try {
      console.log('slideshow: DOMContentLoaded - calling PhotoSlideshow.init()');
      PhotoSlideshow.init();
    } catch (e) {
      console.error('slideshow DOMContentLoaded init failed', e);
    }
  });
}
