/*global document, require*/
/*jshint -W032 */ /* ignore unnecessary semicolon */
import Helper from './Helper';

/* Accessibility helper functions ported from PhotoSlideshowHooks.js.
   These are the canonical in-file implementation so the slideshow
   provides tabindex and keyboard activation behavior directly. */
var SLIDE_FOCUSABLE = 'a.rich-text-img-link, .ss-move';

function setFigureTabindex(figure, isCurrent) {
    var nodes = figure.querySelectorAll ? figure.querySelectorAll(SLIDE_FOCUSABLE) : [];
    for (var i = 0; i < nodes.length; i++) {
        try { nodes[i].setAttribute('tabindex', isCurrent ? '0' : '-1'); } catch (err) {}
    }
}

function initSlideshowTabManagement(slideshow) {
    if (!slideshow || !slideshow.getElementsByClassName) return;
    var figures = slideshow.getElementsByClassName('photo');
    for (var i = 0; i < figures.length; i++) {
        setFigureTabindex(figures[i], figures[i].classList && figures[i].classList.contains('cur-photo'));
    }
}

function initKeyActivation(slideshow) {
    if (!slideshow || !slideshow.getElementsByClassName) return;
    var movers = slideshow.getElementsByClassName('ss-move');
    for (var i = 0; i < movers.length; i++) {
        (function(mv){
            if (mv._psHookInit) return;
            mv._psHookInit = true;
            mv.addEventListener('keydown', function(e){
                var k = e.key || e.code;
                if (k === 'Enter' || k === ' ' || k === 'Spacebar' || k === 'Space') {
                    e.preventDefault();
                    try { var ev = new MouseEvent('click', { bubbles: true }); mv.dispatchEvent(ev); } catch (err) { if (typeof mv.click === 'function') mv.click(); }
                    setTimeout(function(){
                        var cur = slideshow.querySelector ? slideshow.querySelector('figure.photo.cur-photo') : null;
                        if (!cur) return;
                        initSlideshowTabManagement(slideshow);
                        var isPrev = mv.classList && mv.classList.contains('ss-prev');
                        var target = cur.querySelector(isPrev ? '.ss-prev' : '.ss-next');
                        if (target) {
                            try { target.setAttribute('tabindex','0'); } catch (err) {}
                            if (typeof target.focus === 'function') target.focus();
                        } else {
                            var first = cur.querySelector ? cur.querySelector('a.rich-text-img-link, .ss-next, .ss-prev') : null;
                            if (first) {
                                try { first.setAttribute('tabindex','0'); } catch (err) {}
                                if (typeof first.focus === 'function') first.focus();
                            }
                        }
                    }, 0);
                }
            });
        })(movers[i]);
    }
}

class PhotoSlideshow {
    constructor() {
        var slideshows = document.getElementsByClassName('photo-slideshow'),
            i;

        for (i = 0; i < slideshows.length; i++) {
            this.addClicks(slideshows[i]);
        }

        // Initialize accessibility hooks for existing slideshows
        for (i = 0; i < slideshows.length; i++) {
            var ss = slideshows[i];
            initSlideshowTabManagement(ss);
            initKeyActivation(ss);
        }
    }

    toggleCaption(el, ss) {
        if (!Helper.hasClass(el, 'has-click')) {
            el.addEventListener(
                'click',
                function() {
                    Helper.toggleClass(ss, 'show-captions');
                },
                false
            );
            Helper.addClass(el, 'has-click');
        }
    }

    navigateSlideshow(el, p, ss) {
        if (!Helper.hasClass(el, 'has-click')) {
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

                    // update accessibility state after navigation
                    initSlideshowTabManagement(ss);
                    initKeyActivation(ss);
                },
                false
            );
            Helper.addClass(el, 'has-click');
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
};

export default PhotoSlideshow;
