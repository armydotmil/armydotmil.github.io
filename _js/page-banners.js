/*global window*/

import ParallaxImg from './modules/ParallaxImage';
import Header from './modules/Header';
import SubNav from './modules/SubNav';

(function() {
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