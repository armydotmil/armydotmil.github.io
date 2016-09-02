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
        this.translate = {
            'x': 0,
            'y': 0
        };
        this.doEdgeTransition = false;
        this.events = {};
        // this.supports3d = true; // may need to initialize something here

        // add click listener to left/right buttons
        this.addOnClick();

        // find width of items
        this.getWidth();

        // set width of main carousel container to items width * number of items
        this.setWidth();

        // set total amount of clicks to reach the end
        this.maxClicks = Math.ceil(
            (this.carouselW - this.containerW) /
            this.itemWidth
        );
        this.clicks = 0;

        // resize function to set the size of container
        this.onResize();

        // detect browser support for translate3d and touch
        this.caniuse();

        // add drag capability
        this.move();
    }

    addOnClick() {
        var controls = document.getElementsByClassName('controls')[0],
            controlBtns = controls.getElementsByTagName('a'),
            i,
            len;

        // add event listeners to control buttons
        for(i = 0, len = controlBtns.length; i < len; i++) {
            this.onBtnClick(controlBtns[i]);
        }
    }

    getWidth() {
        var i,
            len;

        // use maxwidth of all the items for amount to move carousel
        for(i = 0, len = this.items.length; i < len; i++) {
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

        // TODO figure out how to make touch and mouse work together
        if ('ontouchstart' in window || // works on most browsers
            window.navigator.msMaxTouchPoints) {

            this.events = {
                'start' : 'touchstart',
                'move' : 'touchmove',
                'end' : 'touchend' // touchcancel was in there too
            };
        } else {

            this.events = {
                'start' : 'mousedown',
                'move' : 'mousemove',
                'end' : 'mouseup'
            };
        }
    }

    move() {
        var _this = this,
            dragging = false,
            newPositions = {
                'x': 0,
                'y': 0
            },
            startPositions = {
                'x': 0,
                'y': 0
            };

        function listeners(active) {
            if (active) {
                document.addEventListener(_this.events.move, moving, false);
                document.addEventListener(_this.events.end, end, false);
            } else {
                document.removeEventListener(_this.events.move, moving);
                document.removeEventListener(_this.events.end, end);
            }
        }

        function coordinates(e) {
            return e.touches !== undefined ?
                {
                    'x' : e.touches[0].pageX,
                    'y' : e.touches[0].pageY
                } :
                {
                    'x' : (e.pageX || e.clientX),
                    'y' : (e.pageY || e.clientY)
                };
        }

        function start(e) {
            e.preventDefault();

            newPositions.x = coordinates(e).x - _this.translate.x;
            newPositions.y = coordinates(e).y - _this.translate.y;

            startPositions.x = coordinates(e).x;

            listeners(1);


            // not returning false here does some funky stuff :P
            return false;
        }

        function moving(e) {
            e.preventDefault();

            dragging = true;

            Helper.addClass(_this.carousel, 'moving');

            // TODO add ability to slow translate when you pull it too far
            _this.translate.x = coordinates(e).x - newPositions.x;

            // TODO
            // if we are grabbing the carousel, but want to move up or down the page,
            // remove the event listener
            // (only would happen on touch devices)
            // _this.translate.y = coordinates(e).y - newPositions.y;
            // if (_this.translate.y > 10 || _this.translate.y < -10) {
            //     listeners(0);
            // }

            // move carousel
            _this.setTranslate(_this.translate.x);
        }

        function end(e) {
            var transformRounded = 0;

            // need to see if we are dragging because this function is activated
            // when you click anywhere inside the carousel
            if (dragging) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();

                Helper.removeClass(_this.carousel, 'moving');

                // by rounding up or down, we can move the carousel to the right position
                // based off of where the user started dragging the carousel
                // and where they stopped
                if (coordinates(e).x < startPositions.x) {

                    // swipe forwards
                    transformRounded = Math.floor(_this.translate.x / _this.itemWidth);
                } else {

                    // swipe backwards
                    transformRounded = Math.ceil(_this.translate.x / _this.itemWidth);
                }

                // set clicks eq to rounded translate over item width
                // since transformRounded is negative and clicks can only be positive,
                // multiply by -1
                // then check if it needs to be reset to 0 or max clicks
                _this.clicks = -(transformRounded);

                if (_this.clicks < 0) {
                    _this.clicks = 0;
                } else if (_this.clicks > _this.maxClicks) {
                    _this.clicks = _this.maxClicks;
                }

                // if we are at the end of the carousel, set translate differently
                if (_this.clicks === _this.maxClicks) {

                    // set translate to carousel width - container width
                    _this.translate.x = -(_this.carouselW - _this.containerW);
                } else {

                    // set translate to clicks * item width
                    _this.translate.x = -(_this.clicks * _this.itemWidth);
                }

                // move carousel
                _this.setTranslate(_this.translate.x);

                // disable the appropriate button
                _this.disableBtn();

                listeners(0);

                // dont follow the link if we are moving the carousel
                if (e.target.tagName === 'A' ||
                    e.target.parentNode.tagName === 'A') {
                    e.target.onclick = function() { return false; };
                }
            } else {

                // else we are just clicking inside the carousel,
                // so follow the link
                e.target.onclick = function() { return true; };
            }

            if (document.activeElement != document.body) document.activeElement.blur();

            dragging = false;

            return false;
        }

        _this.carousel.addEventListener(_this.events.start, start, true);

    }

    // add css prefixes
    setStyle(el, prop, val) {
        var uc = prop.substr(0,1).toUpperCase() + prop.substr(1);
        el.style['Webkit' + uc] = val;
        el.style['Moz' + uc] = val;
        el.style['MS' + uc] = val;
        el.style['o' + uc] = val;
        el.style[prop] = val;
    }

    // either set translate3d value or left value
    // depending on browser support
    setTranslate(val) {
        if (this.supports3d) {
            this.setStyle(
                this.carousel,
                'transform',
                `translate3d(${val}px, 0, 0)`
            );
        } else {
            this.carousel.style.left = `${val}px`;
        }
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

                if (_this.doEdgeTransition) {
                    Helper.addClass(_this.carousel, 'quick');

                    // move carousel
                    _this.setTranslate(_this.translate.x);

                    // setTimeout for cool effect
                    setTimeout(function() {
                        _this.translate.x = _this.clicks === 0 ?
                            _this.translate.x - SHORT_TRANSITION :
                            _this.translate.x + SHORT_TRANSITION;

                        // move carousel
                        _this.setTranslate(_this.translate.x);

                        Helper.removeClass(_this.carousel, 'quick');
                        _this.doEdgeTransition = false;
                    }, 150);

                } else {

                    // move carousel
                    _this.setTranslate(_this.translate.x);
                }

                _this.disableBtn();

                return false;
            },
            false
        );
    }

    // TODO add ability to attach these functions to whatever buttons you want
    next() {

        if (this.clicks < this.maxClicks) {
            this.clicks++;

            // if we are at the end of the carousel, set translate differently
            if (this.containerW < MAX_CONTAINER_W &&
                this.clicks === this.maxClicks) {

                // set translate to carousel width - container width
                this.translate.x = -(this.carouselW - this.containerW);
            } else {

                // set instance translate value to clicks * item width
                this.translate.x = -(this.clicks * this.itemWidth);
            }

        } else {
            this.translate.x -= SHORT_TRANSITION;
            this.doEdgeTransition = true;
        }

    }

    prev() {

        if (this.clicks > 0) {
            this.clicks--;
            this.translate.x = -(this.clicks * this.itemWidth);
        } else {
            this.translate.x += SHORT_TRANSITION;
            this.doEdgeTransition = true;
        }

    }

    // TODO disable both buttons if there arent enough items to fill container
    // or maybe do it the other way
    // only enable the buttons if there are enough items to fill container
    // many ways to skin a cat :P
    disableBtn() {
        var btnToDisable,
            controls = document.getElementsByClassName('controls')[0],
            controlBtns = controls.getElementsByTagName('a'),
            disabled,
            i;

        // disable left button if at 0 clicks
        if (this.clicks === 0) {
            disabled = 1;
            btnToDisable = controlBtns[0];

        // disable right button if at max clicks
        } else if (this.clicks === this.maxClicks) {
            disabled = 1;
            btnToDisable = controlBtns[1];

        // else dont disable anything
        } else {
            disabled = 0;
        }

        for(i = controlBtns.length - 1; i >= 0; i--) {
            Helper.removeClass(controlBtns[i], 'disabled');
        }

        if (disabled) Helper.addClass(btnToDisable, 'disabled');
    }

    // TODO fix position of carousel on resize
    onResize() {
        var _this = this;

        window.onresize = function() {
            _this.containerW = this.innerWidth >= MAX_CONTAINER_W ?
                MAX_CONTAINER_W :
                this.innerWidth;

            // reset total amount of clicks to reach the end
            _this.maxClicks = Math.ceil(
                (_this.carouselW - _this.containerW) /
                _this.itemWidth
            );

            _this.disableBtn();
        };
    }

};

export default Carousel;

    // TODO
    // count items in container
    // see if 4 items are visible - if more, add ability to go left/right
    // if less than 4 items visible and screen width is more than width of all items combined, add ability to go left/right

    // later TODO
    // add touch capability

    // detect touch capability:
    // function is_touch_device() {
    //   return 'ontouchstart' in window        // works on most browsers
    //       || 'onmsgesturechange' in window;  // works on IE10 with some false positives
    // };


