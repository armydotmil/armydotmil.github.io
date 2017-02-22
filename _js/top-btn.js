/*global document, window, require*/

var Helper = require('./modules/Helper');

(function() {
    'use strict';

    var autoScrolling = false,
        body = document.body,
        dist = 0,
        doc = document.documentElement,
        id,
        increment = 16,
        lastScrollTop = 0,
        pos,
        topBtn = document.getElementsByClassName('top-btn')[0];

    window.onscroll = function () {
        pos = body.scrollTop || doc.scrollTop;

        if (!autoScrolling) {
            if (pos >= 750 && pos < lastScrollTop) {
                Helper.addClass(topBtn, 'visible');
            } else {
                Helper.removeClass(topBtn, 'visible');
            }
        }

        lastScrollTop = pos;
    };

    function scrollUp() {
        dist = pos / (-1 * increment);

        window.scrollBy(0, dist < -1 ? dist : -1.5);

        if (pos > 0) {
            id = window.requestAnimationFrame(scrollUp);
        } else {
            window.cancelAnimationFrame(id);

            // allow scrolling
            enableScroll();
        }
    }

    function preventScroll(e) {
        e = e || window.event;
        if (e.preventDefault) e.preventDefault();
    }

    function disableScroll() {
        window.onwheel = preventScroll;
        window.ontouchmove  = preventScroll;
        autoScrolling = true;
    }

    function enableScroll() {
        window.onwheel = null;
        window.ontouchmove = null;
        autoScrolling = false;
    }

    topBtn.addEventListener(
        'click',
        function(e) {
            if (window.requestAnimationFrame) {
                e.preventDefault();
                Helper.removeClass(topBtn, 'visible');
                scrollUp();

                // prevent user from scrolling
                disableScroll();
            }
            return;
        },
        false
    );

})();
