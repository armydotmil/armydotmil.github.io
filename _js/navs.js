/*global document,require*/

var Subnav = require('./modules/SubNav'),
    Helper = require('./modules/Helper');

(function() {
    'use strict';
    var navs = document.getElementsByTagName('nav'),
        i;

    for (i = 0; i < navs.length; i++) {
        if (Helper.hasClass(navs[i], 'dropdown')) {
            new Subnav(navs[i], false, { persistentLabel: true });
        } else {
            new Subnav(navs[i]);
        }
    }
})();

