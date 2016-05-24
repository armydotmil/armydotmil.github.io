/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = require('./Helper');
/**
 * Toggle class name on element as user scrolls page
 */
class ScrollNav {

    /**
     * elem {obj}           - DOM element to add scroll class to
     * minTop {int}         - minimum px distance from top of page to start
                              adding scroll class
     */
    constructor(elem, minTop) {
        this.navElem = elem;
        // window.pageYOffset for all browsers, except IE9 and lower
        this.scrollPos = (window.pageYOffset !== undefined) ?
            window.pageYOffset :
            document.documentElement.scrollTop;
        this.minTop = (!minTop) ? 0 : minTop;
        this.minScroll = 25; // minimum scrolling distance before transitioning
        window.addEventListener('scroll', this.runOnScroll.bind(this));
        this.runOnScroll(this);
    }

    runOnScroll(e) {
        var newPos = (window.pageYOffset !== undefined) ?
            window.pageYOffset :
            document.documentElement.scrollTop,
            navOpen = document.getElementsByClassName('open-window');

        if (!navOpen.length) {
            // scrolling down
            if (this.scrollPos + this.minScroll <= newPos &&
                newPos > this.minTop) {
                Helper.addClass(this.navElem, 'scrolled-down');
                this.scrollPos = newPos;
            // scrolling up
            } else if (this.scrollPos - this.minScroll >= newPos) {
                Helper.removeClass(this.navElem, 'scrolled-down');
                this.scrollPos = newPos;
            }
        }
    }
};

export default ScrollNav;
