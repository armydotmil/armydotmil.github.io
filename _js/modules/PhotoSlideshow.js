// Re-export the canonical PhotoSlideshow from the submodule to keep a single source
// Minimal PhotoSlideshow class placeholder to avoid circular import initialization
class PhotoSlideshow {
	constructor(){
		// Minimal runtime wiring so extensions/hooks can attach and rely on `ss` instances.
		this.initAll();
	}

	static init(){
		// create an instance which will run initAll()
		new PhotoSlideshow();
	}

	initAll(){
		var nodes = document.querySelectorAll('.photo-slideshow');
		if(!window.__PHOTO_SLIDESHOW_INSTANCES) window.__PHOTO_SLIDESHOW_INSTANCES = {};
		nodes.forEach(function(root){
			if(!root) return;
			var id = root.id || ('ps-' + Math.random().toString(36).slice(2,9));
			root.id = id;
			var ss = root.__photoSlideshowInstance || { el: root };
			ss.next = function(){ return PhotoSlideshow._move(root, 1); };
			ss.prev = function(){ return PhotoSlideshow._move(root, -1); };
			root.__photoSlideshowInstance = ss;
			window.__PHOTO_SLIDESHOW_INSTANCES[id] = ss;
			if(!root._psWired){
				root.addEventListener('click', function(e){
					var mv = e.target.closest && e.target.closest('.ss-move');
					if(mv){
						if(mv.classList.contains('ss-prev')){
							ss.prev();
						} else {
							ss.next();
						}
						e.preventDefault();
						return;
					}
				});
				root._psWired = true;
			}
		});
	}

	static _move(root, dir){
		if(!root || !root.getElementsByClassName) return;
		var figs = root.getElementsByClassName('photo');
		if(!figs || figs.length === 0) return;
		var curIndex = -1;
		for(var i=0;i<figs.length;i++){ if(figs[i].classList.contains('cur-photo')) { curIndex = i; break; } }
		if(curIndex === -1) curIndex = 0;
		var next = (curIndex + dir + figs.length) % figs.length;
		figs[curIndex].classList.remove('cur-photo');
		figs[next].classList.add('cur-photo');
		if(window.PHOTO_SLIDESHOW_HOOKS && typeof window.PHOTO_SLIDESHOW_HOOKS.onSlideChange === 'function'){
			window.PHOTO_SLIDESHOW_HOOKS.onSlideChange(root);
		}
	}
}

export default PhotoSlideshow;

// Initialize when QuillLoader signals it's ready (ensures markup exists)
if(typeof document !== 'undefined' && document.addEventListener){
	document.addEventListener('photo-slideshow:quill-ready', function(){ try{ PhotoSlideshow.init(); }catch(e){ if(window.DEBUG) console.warn('PhotoSlideshow.init failed (quill-ready)', e); } }, false);
	// Also initialize on DOMContentLoaded as a fallback
	document.addEventListener('DOMContentLoaded', function(){ try{ PhotoSlideshow.init(); }catch(e){ if(window.DEBUG) console.warn('PhotoSlideshow.init failed (DOMContentLoaded)', e); } }, false);
}
