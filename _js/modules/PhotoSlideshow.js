/*global document, require*/
/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = require('./Helper');

class PhotoSlideshow {
    constructor() {
        var slideshows = document.getElementsByClassName('photo-slideshow'),
            i;

        for (i = 0; i < slideshows.length; i++) {
            this.addClicks(slideshows[i]);
        }
    }

    toggleCaption(el, ss) {
        el.addEventListener(
            'click',
            function() {
                Helper.toggleClass(ss, 'show-captions');
            },
            false
        );
    }

    navigateSlideshow(el, p, ss) {
        el.addEventListener(
            'click',
            function() {
                Helper.removeClass(p[ss.curPos], 'cur-photo');

                if (Helper.hasClass(this, 'ss-next')) {
                    ss.curPos++;
                } else {
                    ss.curPos--;
                }

                if (ss.curPos < 0) ss.curPos = p.length - 1;
                if (ss.curPos >= p.length) ss.curPos = 0;

                Helper.addClass(p[ss.curPos], 'cur-photo');
            },
            false
        );
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
};

export default PhotoSlideshow;
