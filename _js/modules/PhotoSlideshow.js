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
					try{
						var id = root.id || ('ps-' + Math.random().toString(36).slice(2,9));
				root.id = id;
				var ss = root.__photoSlideshowInstance || { el: root };
				ss.next = function(){ return PhotoSlideshow._move(root, 1); };
				ss.prev = function(){ return PhotoSlideshow._move(root, -1); };
				ss.toggleCaptions = function(){ return PhotoSlideshow._toggleCaptions(root); };
				root.__photoSlideshowInstance = ss;
				window.__PHOTO_SLIDESHOW_INSTANCES[id] = ss;
				if(!root._psWired){
					// console.warn('PhotoSlideshow (resources) wiring handlers for', id);
					root.addEventListener('click', function(e){
						try{
							// console.log('PhotoSlideshow.click handler', { target: e.target, root: root.id || null });
						}catch(err){}
						var mv = e.target.closest && e.target.closest('.ss-move');
						if(mv){
							try{ /* console.log('PhotoSlideshow detected mover element', mv.className, 'on root', root.id); */ }catch(err){}
							if(mv.classList.contains('ss-prev')){
								ss.prev();
							} else {
								try{ /* console.log('PhotoSlideshow calling next for', root.id); */ }catch(err){}
								ss.next();
							}
							e.preventDefault();
							return;
						}
						var cb = e.target.closest && e.target.closest('.image-caption-button');
						if(cb){
							/* caption button detected */
							ss.toggleCaptions();
							e.preventDefault();
							return;
						}
					});
					root._psWired = true;
					// console.warn('PhotoSlideshow.initAll status for', id, { hasInstance: !!root.__photoSlideshowInstance, wired: !!root._psWired, api: root.__photoSlideshowInstance ? { hasNext: !!root.__photoSlideshowInstance.next, hasPrev: !!root.__photoSlideshowInstance.prev, hasToggle: !!root.__photoSlideshowInstance.toggleCaptions } : null });
				}
			}catch(e){}
		});
	}

	static _move(root, dir){
		try{
			var figs = root.getElementsByClassName('photo');
			if(!figs || figs.length === 0) return;
			var curIndex = -1;
			for(var i=0;i<figs.length;i++){ if(figs[i].classList.contains('cur-photo')) { curIndex = i; break; } }
			if(curIndex === -1) curIndex = 0;
			var next = (curIndex + dir + figs.length) % figs.length;
			figs[curIndex].classList.remove('cur-photo');
			figs[next].classList.add('cur-photo');
			if(window.PHOTO_SLIDESHOW_HOOKS && typeof window.PHOTO_SLIDESHOW_HOOKS.onSlideChange === 'function'){
					// console.log('PhotoSlideshow._move triggered for', root.id, 'dir=', dir, 'from', curIndex, 'to', next);
				window.PHOTO_SLIDESHOW_HOOKS.onSlideChange(root);
			}
		}catch(e){}
	}

	static _toggleCaptions(root){
		try{
			root.classList.toggle('show-captions');
			if(window.PHOTO_SLIDESHOW_HOOKS && typeof window.PHOTO_SLIDESHOW_HOOKS.onCaptionToggle === 'function'){
					// console.log('PhotoSlideshow._toggleCaptions triggered for', root.id);
				window.PHOTO_SLIDESHOW_HOOKS.onCaptionToggle(root);
			}
		}catch(e){}
	}
}

export default PhotoSlideshow;

// Initialize when QuillLoader signals it's ready (ensures markup exists)
try{
	if(document && document.addEventListener){
		document.addEventListener('photo-slideshow:quill-ready', function(){ try{ PhotoSlideshow.init(); }catch(e){} }, false);
		// Also initialize on DOMContentLoaded as a fallback
		document.addEventListener('DOMContentLoaded', function(){ try{ PhotoSlideshow.init(); }catch(e){} }, false);
	}
}catch(e){}
