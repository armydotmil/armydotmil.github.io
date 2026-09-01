/*global document, require*/
/*jshint -W032 */ /* ignore unnecessary semicolon */
import Helper from './Helper';

class PhotoSlideshow {
    static SLIDE_FOCUSABLE = 'a.rich-text-img-link, .ss-move, .image-caption-button';

    constructor() {
        let slideshows = document.querySelectorAll('.photo-slideshow'), current;

        slideshows.forEach(element => {

            this.addClicks(element);
            this.setTabindex(element, element.querySelector('.cur-photo'));
        });
    }

    setTabindex(ss, current) {
        // set tabindex to -1 on buttons for every slide
        ss.querySelectorAll(PhotoSlideshow.SLIDE_FOCUSABLE).forEach(element => {
            element.setAttribute('tabindex', '-1');
        });

        // set tabindex to 0 on buttons in current slide
        current?.querySelectorAll(PhotoSlideshow.SLIDE_FOCUSABLE).forEach(element => {
            element.setAttribute('tabindex', '0');
        });
    }

    toggleCaption(el, ss) {
        if (!Helper.hasClass(el, 'has-click')) {
            ['click', 'keydown'].forEach(eventType => {
                el.addEventListener(eventType, function(e) {
                    let k = e.key || e.code || null;
                    if (e.type === 'click' || (e.type === 'keydown' && (k === 'Enter' || k === ' ' || k === 'Spacebar' || k === 'Space'))) {
                        e.preventDefault();
                        Helper.toggleClass(ss, 'show-captions');
                    }
                }, false);
                Helper.addClass(el, 'has-click');
            });
        }
    }

    navigateSlideshow(moveBtn, photos, ss) {
        const context = this;
        if (!Helper.hasClass(moveBtn, 'has-click')) {
            ['click', 'keydown'].forEach(eventType => {
                moveBtn.addEventListener(eventType, function(e) {
                    let k = e.key || e.code || null;
                    let isNext;
                    if (e.type === 'click' || (e.type === 'keydown' && (k === 'Enter' || k === ' ' || k === 'Spacebar' || k === 'Space'))) {
                        e.preventDefault();
                        Helper.removeClass(photos[ss.curPos], 'cur-photo');

                        if (Helper.hasClass(this, 'ss-next')) {
                            isNext = true;
                            ss.curPos++;
                        } else {
                            isNext = false;
                            ss.curPos--;
                        }

                        if (ss.curPos < 0) ss.curPos = photos.length - 1;
                        if (ss.curPos >= photos.length) ss.curPos = 0;

                        Helper.addClass(photos[ss.curPos], 'cur-photo');

                        // update accessibility state after navigation
                        context.setTabindex(ss, photos[ss.curPos]);
                        // set focus to the appropriate button after navigation
                        photos[ss.curPos].querySelector((isNext) ? '.ss-next' : '.ss-prev')?.focus();
                    }
                }, false);
                Helper.addClass(moveBtn, 'has-click');
            });
        }
    }

    addClicks(ss) {
        var captionBtn = ss.getElementsByClassName('image-caption-button'),
            moveBtn = ss.getElementsByClassName('ss-move'),
            photos = ss.getElementsByClassName('photo'),
            context = this,
            i, j;

        /*
         * save curPos value to slideshow object
         * allows us to have multiple slideshows
         * on one page if its ever necessary
         */
        ss.curPos = 0;

        // click event for caption toggle
        for (i = 0; i < captionBtn.length; i++) {
            context.toggleCaption(captionBtn[i], ss);
        }

        // click event for prev/next navigation
        for (j = 0; j < moveBtn.length; j++) {
            context.navigateSlideshow(moveBtn[j], photos, ss);
        }
    }
}

export default PhotoSlideshow;
