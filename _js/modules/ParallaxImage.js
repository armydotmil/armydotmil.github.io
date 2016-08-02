/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = require('./Helper');

/**
 * Parallax image
 */
class FullWidthParallax {
    /*
     * Creates FullWidthParallax object
     * @param {obj} elem - 
     */
    constructor(elem, topMargin) {
        var context = this;

        this.imgCont = elem.getElementsByClassName('full-width-image');
        this.img = (this.imgCont.length) ? this.imgCont[0].getElementsByTagName('img') : [];
        this.topVal = 0;
        this.longPage = false;
        this.isBanner = Helper.hasClass(elem, 'page-banner');
        if (this.img.length) {
            // they both exist, so set them as first in array...
            this.imgCont = this.imgCont[0];
            this.img = this.img[0];
            this.scrollPos = -1;
            this.topMargin = (topMargin) ? topMargin : 0;

            window.addEventListener('scroll', function() {
                context.runOnScroll();
            });
            window.addEventListener('resize', function() {
                context.runOnResize();
            });

            this.runOnResize();
        }
    }

    /**
     * Get updated window dimensions and update right column box if switched
     * between desktop and mobile
     */
    runOnResize() {
        var docElem = document.documentElement,
            maxPos,
            absTop,
            minTop;

        this.imgH = this.img.clientHeight;
        this.contH = this.imgCont.clientHeight;
        this.winW = Math.max(docElem.clientWidth, window.innerWidth || 0);
        this.winH = Math.max(docElem.clientHeight, window.innerHeight || 0);

        // if desktop size and container visible
        if (this.winW > 769 && this.contH > 0) {
            // top position of container, when touching bottom of viewport
            maxPos = this.winH - this.contH;
            // top position of image within container at lowest point
            absTop = Math.round((this.topMargin - maxPos) / 2);
            // lowest value for top of image
            minTop = this.contH - this.imgH;
            // image does not stay within bounds, with standard calculation (taller viewport)
            this.longPage = (absTop < minTop);
            this.runOnScroll();
        // if mobile size reset image to top
        } else if (this.topVal !== 0 && this.contH > 0) {
            this.img.style.top = 0;
            this.topVal = 0;
        }
    }

    /*
     * Called using onscroll event
     * Checks if scrolled up or down, then calls setPosition
     */
    runOnScroll() {
        var viewPos = this.imgCont.getBoundingClientRect(),
            imgContPos = this.topMargin - viewPos.top,
            imgTop = Math.round(imgContPos / 2),
            minView = this.winH - viewPos.top,
            percent;

        // do nothing if it's a smaller window or not in view
        if (this.winW > 769 && minView > 0 && imgContPos <= this.contH) {
            if (this.longPage && !this.isBanner){
                // percent container has moved within viewport (between top margin and bottom of screen)
                percent = (viewPos.top - this.topMargin) * 100 / (this.winH - this.contH - this.topMargin);
                // apply percent to top position of image (based on min top value)
                imgTop =  percent * (this.contH - this.imgH) / 100;
            }
            this.img.style.top = imgTop + 'px';
            this.topVal = imgTop;
        } else if (this.topVal !== 0) {
            this.img.style.top = 0;
            this.topVal = 0;
        }
    }

    updateParallax() {
        this.runOnResize();
    }
};

class ParallaxImage {
    /*
     * Creates FullWidthParallax object(s)
     * @param {int} topMargin - margin to top of full width image object
     */
    constructor(topMargin) {
        var banners = document.getElementsByClassName('parallax-image'),
            i;

        this.parallaxes = [];
        for (i = 0; i < banners.length; i++) {
            this.parallaxes.push(new FullWidthParallax(banners[i], topMargin));
        }
    }

    runUpdate() {
        var i;

        for (i = 0; i < this.parallaxes.length; i++) {
            this.parallaxes[i].updateParallax();
        }
    }
};

export default ParallaxImage;
