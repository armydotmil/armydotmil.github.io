/*jshint esversion: 6*/ /* ignore unnecessary semicolon */

var Helper = require('./Helper');

// const max container width
const MAX_CONTAINER_W = 1020;

// const short transition
const SHORT_TRANSITION = 40;

/**
 * Carousel
 */
class Carousel {

    /**
     * Carousel constructor
     * @param {obj} carousel - default to objects with classname 'carousel'
     */
    constructor(carousel = document.getElementsByClassName('carousel')[0]) {
        this.carousel = carousel;
        this.items = carousel.getElementsByTagName('li');
        this.itemWidth = 0;

        this.doEdgeTransition = false;

        // used when moving the carousel
        this.translate = 0;
        this.newPosition = 0;
        this.startPosition = 0;
        this.endPosition = 0;
        this.endVelocity = 0;

        // add click listener to left/right buttons
        this.addOnClick();

        // find width of items
        this.getWidth();

        // set width of main carousel container to items width * number of items
        this.setWidth();

        // get max swipe amount and max clicks allowed for use in carousel
        this.getMaxVals();

        this.clicks = 0;
        this.disableBtn();

        // resize function to set the size of container
        this.onResize();

        // detect browser support for translate3d
        this.caniuse();
    }

    addOnClick() {
        var controls = document.querySelectorAll('.controls a'),
            i = 0,
            len;

        // add event listeners to control buttons
        for (i, len = controls.length; i < len; i++) {
            this.onBtnClick(controls[i]);
        }
    }

    getWidth() {
        // use maxwidth of all the items for amount to move carousel
        for (var i = 0, len = this.items.length; i < len; i++) {
            if (this.items[i].clientWidth > this.itemWidth)
                this.itemWidth = this.items[i].clientWidth;
        }
    }

    setWidth() {
        // set width of carousel to total width of all items
        this.carouselW = this.itemWidth * this.items.length;
        this.carousel.style.width = `${this.carouselW}px`;

        // set container size
        this.containerW = window.innerWidth >= MAX_CONTAINER_W ?
            MAX_CONTAINER_W :
            window.innerWidth;
    }

    caniuse() {
        var el = document.createElement('div'),
            supports3d;

        this.setStyle(
            el,
            'transform',
            'translate3d(0px, 0px, 0px)'
        );

        supports3d = el.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g);

        this.supports3d = (supports3d && supports3d.length === 1);
    }

    // add css prefixes
    setStyle(el, prop, val) {
        var uc = prop.substr(0, 1).toUpperCase() + prop.substr(1);
        el.style['Webkit' + uc] = val;
        el.style['Moz' + uc] = val;
        el.style['MS' + uc] = val;
        el.style['o' + uc] = val;
        el.style[prop] = val;
    }

    // either set translate3d value or left value
    // depending on browser support
    setTranslate() {
        if (this.supports3d) {
            this.setStyle(
                this.carousel,
                'transform',
                `translate3d(${this.translate}px, 0, 0)`
            );
        } else {
            this.carousel.style.left = `${this.translate}px`;
        }
    }

    move() {
        var _this = this;

        // move carousel
        _this.setTranslate();

        if (_this.doEdgeTransition) {

            Helper.addClass(_this.carousel, 'quick');

            // setTimeout for cool effect
            setTimeout(function() {
                _this.translate = -(Math.abs(_this.translate) - SHORT_TRANSITION);

                // move carousel
                _this.setTranslate();

                Helper.removeClass(_this.carousel, 'quick');
                _this.doEdgeTransition = false;
            }, 150);

        }

        _this.disableBtn();
    }

    onBtnClick(el) {
        var _this = this;

        el.addEventListener(
            'click',
            function() {

                if (Helper.hasClass(this, 'right')) {
                    _this.next();
                } else {
                    _this.prev();
                }

                _this.move();

                return false;
            },
            false
        );
    }

    start(e) {
        // newPosition is the current pos of the mouse/touch less translate
        this.newPosition = e.deltaX - this.translate;

        // startPosition is just the current pos of the mouse/touch
        this.startPosition = e.deltaX;
    }

    moving(e) {
        var abs;

        if (!Helper.hasClass(this.carousel, 'moving'))
            Helper.addClass(this.carousel, 'moving');

        // set translate value to current pos less newPosition that was set when we started
        this.translate = e.deltaX - this.newPosition;
        abs = Math.abs(this.translate);

        // slow translate when you pull it too far
        // beginning of carousel
        if (this.translate > 0) {
            this.translate /= 5;

        // end of carousel
        } else if (abs > this.maxSwipeAmt) {

            /**
             * first, if the absolute value of translate is greater than the "max swipe amount"
             * aka, carousel width minus container width, then
             * get 4/5 of the absolute value minus the max swipe amount
             * and add that to translate (adding a positive value to it)
             * so in the end we are only adding .2 for every px dragged
             */
            this.translate += (abs - this.maxSwipeAmt) * 4 / 5;
        }

        // set endPosition to current pos
        this.endPosition = e.deltaX;

        // set endVelocity to current velocityX amount
        this.endVelocity = e.velocityX;

        // move carousel
        this.setTranslate();
    }

    end(e) {
        var transformRounded = 0;

        Helper.removeClass(this.carousel, 'moving');

        // by rounding up or down, we can move the carousel to the right position
        // based off of where the user started dragging the carousel
        // and where they stopped
        if (this.endPosition < this.startPosition) {

            // swipe forwards
            transformRounded = Math.floor(this.translate / this.itemWidth);
        } else {

            // swipe backwards
            transformRounded = Math.ceil(this.translate / this.itemWidth);
        }

        // set clicks eq to rounded translate over item width
        // since transformRounded is negative and clicks can only be positive,
        // multiply by -1
        // then check if it needs to be reset to 0 or max clicks
        this.clicks = -(transformRounded);

        // add velocity!!
        if (this.endVelocity >= 1 ||
            this.endVelocity <= -1)
            this.clicks -= Math.round(this.endVelocity / 5);

        if (this.clicks < 0) {
            this.clicks = 0;
        } else if (this.clicks > this.maxClicks) {
            this.clicks = this.maxClicks;
        }

        // get translate value
        this.getTranslate();

        // move carousel
        this.setTranslate();

        // disable the appropriate button
        this.disableBtn();
    }

    // TODO add ability to attach these functions to whatever buttons you want
    next() {

        if (this.clicks < this.maxClicks) {
            this.clicks++;

            // get translate value
            this.getTranslate();
        } else {
            this.translate -= SHORT_TRANSITION;
            this.doEdgeTransition = true;
        }

    }

    prev() {

        if (this.clicks > 0) {
            this.clicks--;

            // get translate value
            this.getTranslate();
        } else {
            this.translate += SHORT_TRANSITION;
            this.doEdgeTransition = true;
        }

    }

    // DRY function used in swipe and click next/prev
    getTranslate() {

        // if we are at the end of the carousel, set translate differently
        if (this.clicks === this.maxClicks) {

            // set translate to carousel width - container width
            this.translate = -(this.maxSwipeAmt);
        } else {

            // set translate to clicks * item width
            this.translate = -(this.clicks * this.itemWidth);

            // center the items on small screens
            if (this.containerW <= 500 && this.clicks > 0)
                this.translate += (this.containerW - this.itemWidth) / 2;
        }

    }

    disableBtn() {
        var controls = document.querySelectorAll('.controls a'),
            disabled = [],
            i,
            j = 0,
            len;

        if (this.maxClicks > 0) {

            // disable left button if at 0 clicks
            if (this.clicks === 0) {
                disabled.push(controls[0]);

            // disable right button if at max clicks
            } else if (this.clicks === this.maxClicks) {
                disabled.push(controls[1]);
            }
        } else {

            // disable both buttons if maxClicks eq 0
            disabled = controls;
        }

        // seems counterintuitive to remove then add
        // but we do this if we need to disable one and not the other
        for (i = controls.length - 1; i >= 0; i--) {
            Helper.removeClass(controls[i], 'disabled');
        }

        for (j, len = disabled.length; j < len; j++) {
            Helper.addClass(disabled[j], 'disabled');
        }
    }

    getMaxVals() {
        if (this.carouselW >= this.containerW) {

            // set max swipe amount allowed for dragging the carousel
            this.maxSwipeAmt = this.carouselW - this.containerW;

            // set total amount of clicks to reach the end
            this.maxClicks = Math.ceil(this.maxSwipeAmt / this.itemWidth);
        } else {
            this.maxSwipeAmt = 0;
            this.maxClicks = 0;
        }
    }

    // TODO fix position of carousel on resize
    onResize() {
        var _this = this;

        window.onresize = function() {
            _this.containerW = this.innerWidth >= MAX_CONTAINER_W ?
                MAX_CONTAINER_W :
                this.innerWidth;

            _this.getMaxVals();

            _this.disableBtn();
        };
    }

};

export default Carousel;
