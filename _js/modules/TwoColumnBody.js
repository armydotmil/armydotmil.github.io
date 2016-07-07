/*jshint -W032 */ /* ignore unnecessary semicolon */

/**
 * Maintain position of box in right column
 * as you scroll to the bottom, the box needs to stay within
 * the main content container aka show above the footer
 */
class ScrollRightColumn {
    /*
     * Creates ScrollRightColumn object
     * @param {obj} mainCont - container object of two-column-body
     * @param {int} margin - top and bottom margin to edge of screen
     * @param {int} topMargin - overrides default top margin
     */
    constructor(mainCont, margin, topMargin) {
        var context = this;

        this.rightCol = mainCont.getElementsByClassName('right-column');

        if (this.rightCol.length) {
            this.scrollPos = -1;
            this.innerTop = -1;
            this.mobile = true;

            this.rightCol = this.rightCol[0];
            this.inner = this.rightCol.firstElementChild;

            this.margin = (margin) ? margin : 20;
            this.topMargin = (topMargin) ? topMargin : this.margin;
            this.positionVal = 'none';

            this.winH = 0;
            this.noScroll = false;
            this.hold = false;

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
        var totHeight = this.inner.clientHeight + this.topMargin + this.margin,
            docElem = document.documentElement;
        this.winW = Math.max(docElem.clientWidth, window.innerWidth || 0);
        this.winH = Math.max(docElem.clientHeight, window.innerHeight || 0);
        // if desktop size
        if (this.winW > 992) {
            this.noScroll = (this.winH - totHeight) >= 0;
            // if switching from mobile or positioned on bottom
            if (this.mobile || this.positionVal === 'bottom') {
                this.mobile = false;
                this.innerTop = -1;
                this.hold = false;
                this.runOnScroll();
            }
        // if mobile size position is static
        } else {
            this.mobile = true;
            if (this.inner.style.position !== 'static') {
                this.inner.style.position = 'static';
            }
        }
    }

    /*
     * Called using onscroll event
     * Checks if scrolled up or down, then calls setPosition
     */
    runOnScroll() {
        var d = document,
            bodyElem = d.getElementsByTagName('body')[0],
            scrolledAmt = bodyElem.scrollTop || d.documentElement.scrollTop,
            scrollDown = (scrolledAmt > this.scrollPos);

        this.scrollPos = scrolledAmt;

        this.setPosition(scrollDown);
    }

    /*
     * Sets the top position of the right column inner element
     * @param {bool} scrollDown - is scrolling down
     */
    setPosition(scrollDown) {
        var position = this.rightCol.getBoundingClientRect(),
            innerHeight = this.inner.clientHeight,
            adjustTop = this.topMargin - position.top,
            adjustBottom = this.winH - this.margin - innerHeight - position.top,
            max = (!scrollDown || this.innerTop === -1 || this.noScroll) ?
                adjustTop : adjustBottom;

        max += innerHeight;

        // above the point of transitioning to sticky
        if (position.top > this.topMargin || this.winW <= 992) {
            this.holdStatic();
        // if box is at lowest point
        } else if (max >= this.rightCol.clientHeight) {
            this.maxBottom(adjustTop);
        // if box fits in viewport
        } else if (this.noScroll) {
            if (this.innerTop === -1) this.hold = true;
            this.fixedTop(adjustTop);
        } else {
            // initialize box to top position
            if (this.innerTop === -1) {
                this.hold = true;
                this.fixedTop(adjustTop);
            // scrolling down page
            } else if (scrollDown) {
                // box scrolled down to lower margin
                if (adjustBottom >= this.innerTop) {
                    this.fixedBottom(adjustBottom);
                } else {
                    this.absoluteTop(adjustTop);
                }
            // scrolling up page
            } else {
                // box scrolled up to top margin
                if (this.innerTop >= adjustTop) {
                    this.fixedTop(adjustTop);
                } else {
                    this.absoluteBottom(adjustBottom);
                }
            }
        }
    }

    /*
     * Holds the position as static
     */
    holdStatic() {
        if (this.innerTop !== 0 || !this.hold) {
            this.inner.style.position = 'static';
            this.positionVal = 'top';
            this.innerTop = 0;
            this.hold = true;
        }
    }

    /*
     * Positions at very bottom of right column
     * @param {int} adjustTop - pixel amount from top of right column
     */
    maxBottom(adjustTop) {
        this.innerTop = adjustTop;
        if (!this.hold) {
            this.inner.style.position = 'absolute';
            this.positionVal = 'max';
            this.inner.style.top = 'auto';
            this.inner.style.bottom = '0px';
            this.hold = true;
        }
    }

    /*
     * Fixed position to topMargin
     * @param {int} adjustTop - pixel amount from top of right column
     */
    fixedTop(adjustTop) {
        this.innerTop = adjustTop;
        if (this.hold) {
            this.inner.style.position = 'fixed';
            this.positionVal = 'top';
            this.inner.style.top = this.topMargin + 'px';
            this.inner.style.bottom = 'auto';
            this.hold = false;
        }
    }

    /*
     * Fixed position to bottom margin
     * @param {int} adjustBottom - pixel amount from top of right column,
     * when the box is at bottom margin
     */
    fixedBottom(adjustBottom) {
        this.innerTop = adjustBottom;
        if (this.hold) {
            this.inner.style.position = 'fixed';
            this.positionVal = 'bottom';
            this.inner.style.top = 'auto';
            this.inner.style.bottom = this.margin + 'px';
            this.hold = false;
        }
    }

    /*
     * Absolute position at current value and hold
     * @param {int} adjustTop - pixel amount from top of right column
     */
    absoluteTop(adjustTop) {
        if (!this.hold) {
            this.innerTop = adjustTop;
            this.inner.style.position = 'absolute';
            this.positionVal = 'top';
            this.inner.style.top = adjustTop + 'px';
            this.inner.style.bottom = 'auto';
            this.hold = true;
        }
    }

    /*
     * Absolute position at current value and hold
     * @param {int} adjustBottom - pixel amount from top of right column,
     * when the box is at bottom margin
     */
    absoluteBottom(adjustBottom) {
        if (!this.hold) {
            this.innerTop = adjustBottom;
            this.inner.style.position = 'absolute';
            this.positionVal = 'bottom';
            this.inner.style.top = adjustBottom + 'px';
            this.inner.style.bottom = 'auto';
            this.hold = true;
        }
    }
};

class TwoColumnBody {
    /*
     * Creates ScrollRightColumn object(s)
     * @param {int} margin - top and bottom margin to edge of screen
     * @param {int} topMargin - overrides default top margin
     */
    constructor(margin, topMargin) {
        var mainCont = document.getElementsByClassName('two-column-body'),
            i;

        for (i = 0; i < mainCont.length; i++) {
            new ScrollRightColumn(mainCont[i], margin, topMargin);
        }
    }
};

export default TwoColumnBody;
