/*global window*/

import PhotoSlideshow from './modules/PhotoSlideshow';
// PhotoSlideshow auto-initializes on import; no need to construct here.
// init hooks-based ARIA/tabindex sync
import './modules/PhotoSlideshowHooks';

// Ensure slideshows are initialized when this module loads
if (PhotoSlideshow && typeof PhotoSlideshow.init === 'function') {
	/*
	try { /* enable guarded debug logs */ window.PHOTO_SLIDESHOW_DEBUG = true; /* console.log('slideshow.js calling PhotoSlideshow.init'); */ PhotoSlideshow.init(); } catch (e) { console.error('slideshow.init failed', e); }
	*/
	try { PhotoSlideshow.init(); } catch (e) { console.error('slideshow.init failed', e); }
}

	// Also ensure initialization runs on DOMContentLoaded in case slideshows are injected later
	try{
		if(document && document.addEventListener){
			document.addEventListener('DOMContentLoaded', function(){ try{ PhotoSlideshow.init(); }catch(e){} });
		}
	}catch(e){}

	// Temporary delegated listener was added for debugging and is now commented out
	/*
	document.addEventListener('click', function (e) {
		try {
			var ps = e.target.closest && e.target.closest('.photo-slideshow');
			if (ps) {
				/* console.log('DELEGATED CLICK on slideshow:', { target: e.target, classes: e.target.className }); */
			}
		} catch (err) { }
	}, true);
	*/