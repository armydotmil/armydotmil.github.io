/* Canonical PhotoSlideshow implementation (ES module)
	Converted from bundled implementation to avoid CommonJS runtime errors. */
import Helper from './Helper';

class PhotoSlideshow {
	constructor(){
		const slideshows = document.getElementsByClassName('photo-slideshow');
		for(let i=0;i<slideshows.length;i++){
			this.addClicks(slideshows[i]);
		}
	}

	toggleCaption(el, ss){
		if(!Helper.hasClass(el,'has-click')){
			el.addEventListener('click', function(){ Helper.toggleClass(ss,'show-captions'); }, false);
			Helper.addClass(el,'has-click');
		}
	}

	navigateSlideshow(el, photos, ss){
		if(!Helper.hasClass(el,'has-click')){
			el.addEventListener('click', function(){
				Helper.removeClass(photos[ss.curPos],'cur-photo');
				if(Helper.hasClass(this,'ss-next')) ss.curPos++; else ss.curPos--;
				if(ss.curPos < 0) ss.curPos = photos.length - 1;
				if(ss.curPos >= photos.length) ss.curPos = 0;
				Helper.addClass(photos[ss.curPos],'cur-photo');
			}, false);
			Helper.addClass(el,'has-click');
		}
	}

	addClicks(ss){
		var captionBtn = ss.getElementsByClassName('image-caption-button'),
				moveBtn = ss.getElementsByClassName('ss-move'),
				photos = ss.getElementsByClassName('photo'),
				context = this;

		ss.curPos = 0;

		for(let i=0;i<captionBtn.length;i++){
			context.toggleCaption(captionBtn[i], ss);
		}

		for(let j=0;j<moveBtn.length;j++){
			context.navigateSlideshow(moveBtn[j], photos, ss);
		}
	}
}

// initialize on import
const _instance = new PhotoSlideshow();
export default _instance;
