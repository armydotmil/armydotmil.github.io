/*global document, require*/

var Carousel = require('./modules/Carousel'),
    Hammer = require('hammerjs');

(function() {
    'use strict';

    var carousel,
        el = document.getElementsByClassName('carousel'),
        hammertime,
        items;

    // to prevent phantom clicking on elements after dragging the carousel
    // need both stopPropagation and preventDefault here
    // for some reason, it wont work with just return false
    function halt(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    // used on dragstart and mousedown of li elements in carousel
    function end() {
        return false;
    }

    if (el.length) {
        carousel = new Carousel(el[0]);
        hammertime = new Hammer(el[0]);

        items = el[0].getElementsByTagName('li');

        for (var i = 0; i < items.length; i++) {
            items[i].ondragstart = end;
            items[i].onmousedown = end;
        }

        // function for tabbing through the carousel
        el[0].addEventListener(
            'keydown',
            function(e) {
                if (e.keyCode === 9) {
                    if (e.shiftKey) {
                        if (carousel.clicks > 0) carousel.prev();
                    } else {
                        if (carousel.clicks < carousel.maxClicks)
                            carousel.next();
                    }
                    carousel.move();
                }
            },
            false
        );

        hammertime.on('panstart', function(e) {
            carousel.start(e);
        });

        hammertime.on('panleft panright', function(e) {
            e.preventDefault();
            carousel.moving(e);
        });

        hammertime.on('panend pancancel', function(e) {
            carousel.end(e);
            if (e.target.tagName === 'A' ||
                e.target.tagName === 'SPAN' ||
                e.target.tagName === 'IMG') {
                e.target.removeEventListener('click', halt);
                e.target.addEventListener('click', halt);
            }
        });

        hammertime.on('tap', function(e) {
            e.target.removeEventListener('click', halt);
        });
    }

})();
