/*global document, require*/

var Carousel = require('./modules/Carousel'),
    Hammer = require('hammerjs');

(function() {
    'use strict';

    var stage = document.getElementsByClassName('carousel')[0],
        carousel = new Carousel(stage),
        hammertime = new Hammer(stage);
    
    hammertime.on('swipe', function(ev) {
        carousel.swipe(ev.deltaX);
    });
    
})();
