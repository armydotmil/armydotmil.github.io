/*global document, require*/

var Carousel = require('./modules/Carousel');

(function() {
    'use strict';

    new Carousel(document.getElementsByClassName('carousel')[0]);

})();
