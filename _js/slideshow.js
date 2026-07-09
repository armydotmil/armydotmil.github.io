/*global window*/

import PhotoSlideshow from './modules/PhotoSlideshow';
// PhotoSlideshow auto-initializes on import; no need to construct here.
// accessibility/tabindex behavior is provided by the canonical PhotoSlideshow module

// Ensure slideshows are initialized when this module loads
if (PhotoSlideshow && typeof PhotoSlideshow.init === 'function') {
  try { PhotoSlideshow.init(); } catch (e) { console.error('slideshow.init failed', e); }
}

// Also ensure initialization runs on DOMContentLoaded in case slideshows are injected later
if(document && document.addEventListener){
  // QuillLoader dispatches `photo-slideshow:quill-ready` after it creates slideshow markup.
  // Listen for that event so PhotoSlideshow can initialize deterministically when Quill finishes.
  document.addEventListener('photo-slideshow:quill-ready', function(){ try{ PhotoSlideshow.init(); }catch(e){ if(window.DEBUG) console.warn('PhotoSlideshow.init failed (quill-ready)', e); } }, false);

  document.addEventListener('DOMContentLoaded', function(){ PhotoSlideshow.init(); });
}
