/*global document, require*/

var Carousel = require('./modules/Carousel'),
    Hammer = require('hammerjs');

(function() {
    'use strict';

    var stage = document.getElementsByClassName('carousel')[0],
        items = stage.getElementsByClassName('carousel-items'),
        carousel = new Carousel(stage),
        hammertime = new Hammer(stage);
        
    for(var i = 0 ; i < items.length;i++){
        items[i].ondragstart = function(e) {
            return false;
        }
    }
    
    hammertime.on('swipe', function(ev) {
        carousel.swipe(ev.deltaX);
    });
    
})();
