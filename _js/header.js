/*global document, require*/
var Header = require('./modules/Header');
var ScrollNav = require('./modules/ScrollNav');

(function() {
    'use strict';
    var navbar = document.getElementsByClassName('navbar')[0].parentNode;
    new Header('menu');
    new Header('search');
    new ScrollNav(navbar, 150);
})();
