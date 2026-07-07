/*global window*/

import PhotoSlideshow from './modules/PhotoSlideshow';
// PhotoSlideshow auto-initializes on import; no need to construct here.
// init hooks-based ARIA/tabindex sync
import './modules/PhotoSlideshowHooks';

// Ensure slideshows are initialized when this module loads
if (PhotoSlideshow && typeof PhotoSlideshow.init === 'function') {
  try { PhotoSlideshow.init(); } catch (e) { console.error('slideshow.init failed', e); }
}

// Also ensure initialization runs on DOMContentLoaded in case slideshows are injected later
if(document && document.addEventListener){
  document.addEventListener('DOMContentLoaded', function(){ PhotoSlideshow.init(); });
}
