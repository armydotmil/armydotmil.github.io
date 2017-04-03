/*global window,require*/

var ParallaxImg = require('./modules/ParallaxImage'),
    Header = require('./modules/Header'),
    SubNav = require('./modules/SubNav');

(function() {
    'use strict';
    var nav = document.getElementsByTagName('nav')[0],
        para,
        header = document.getElementsByClassName('navbar'),
        headerHeight = (header.length) ? header[0].clientHeight : 0;
    new Header('menu');
    new Header('search');
    para = new ParallaxImg(headerHeight);
    new SubNav(nav, function() {
        para.runUpdate();
    });
})();
