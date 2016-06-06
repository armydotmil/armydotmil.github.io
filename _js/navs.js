/*global document,require*/

var Subnav = require('./modules/SubNav');

(function() {
    'use strict';
    var navs = document.getElementsByTagName('nav'),
        i;

    for (i = 0; i < navs.length; i++) {
        new Subnav(navs[i]);
    }
})();

