/*global document,require*/

var Helper = require('./modules/Helper');

(function() {
    'use strict';

    var accordion = document.getElementsByClassName('accordion')[0],
        i = 0,
        len,
        toggles = accordion.getElementsByClassName('toggle-list'),
        navs = document.getElementsByTagName('nav');

    function addToggle(e) {
        e.addEventListener(
            'click',
            function() {
                if (e.parentNode.classList.contains('expanded')) {
                    e.parentNode.classList.remove('expanded');
                } else {
                    e.parentNode.classList.add('expanded');
                }
            },
            false
        );
    }

    for (i, len = toggles.length; i < len; i++) {
        addToggle(toggles[i]);
    }

    for (i = 0; i < navs.length; i++) {
        addNavClicks(navs[i]);
    }

    function addNavClicks(nav) {
        var menuItems = nav.getElementsByTagName('a'),
            check = nav.getElementsByTagName('input')[0],
            j;
        
        if (check) check.checked = false;
        for (j = 0; j < menuItems.length; j++) {
            menuItems[j].addEventListener('click',
                function(e) {
                    var k;
                    e.preventDefault();
                    for (k = 0; k < menuItems.length; k++) {
                        if (menuItems[k] === this) {
                            Helper.addClass(this, 'active');
                        } else {
                            Helper.removeClass(menuItems[k], 'active');
                        }
                    }
                }
            );
        }
    }

})();

