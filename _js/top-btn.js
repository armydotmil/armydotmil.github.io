/*global document, window, require*/

var Helper = require('./modules/Helper');

(function() {
    'use strict';

    var bodyElem = document.getElementsByTagName('body')[0],
        docElem = document.documentElement,
        lastScrollTop = 0,
        topBtn = document.getElementsByClassName('top-btn')[0];

    window.onscroll = function () {
        var scrolled = bodyElem.scrollTop || docElem.scrollTop;

        if (scrolled >= 750 && scrolled < lastScrollTop) {
            Helper.addClass(topBtn, 'visible');
        } else {
            Helper.removeClass(topBtn, 'visible');
        }

        lastScrollTop = scrolled;
    };

})();
