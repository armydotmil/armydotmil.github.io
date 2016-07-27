/*global document,window, init, require, class*/
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

    addClicks(ss) {
        var captionBtn = ss.getElementsByClassName('image-caption-button'),
            moveBtn = ss.getElementsByClassName('ss-move'),
            photos = ss.getElementsByClassName('photo'),
            curPos = 0,
            context = this,
            i;

        // initialize the first image as current photo
        if (photos.length > 0) Helper.addClass(photos[0], 'cur-photo');

        // click event for caption toggle
        for (i = 0; i < captionBtn.length; i++) {
            captionBtn[i].addEventListener(
                'click',
                function() {
                    Helper.toggleClass(ss, 'show-captions');
                }
            );
        }

        // click event for prev/next navigation
        for (i = 0; i < moveBtn.length; i++) {
            moveBtn[i].addEventListener(
                'click',
                function() {
                    Helper.removeClass(photos[curPos], 'cur-photo');
                    if (Helper.hasClass(this, 'ss-next')) {
                        curPos = curPos + 1;
                    } else {
                        curPos = curPos - 1;
                    }
                    curPos = context.navigateSlideshow(photos, curPos);
                }
            );
        }
    }

    navigateSlideshow(photos, toPos) {
        if (toPos < 0) toPos = photos.length - 1;
        if (toPos >= photos.length) toPos = 0;

        Helper.addClass(photos[toPos], 'cur-photo');

        return toPos;
    }
};

export default PhotoSlideshow;
