/*global document,require*/

var Helper = require('./modules/Helper');

(function() {
    'use strict';

    var i,
        len,
        navs = document.getElementsByTagName('nav');

    for (i = 0, len = navs.length; i < len; i++) {
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
                    var active = nav.getElementsByClassName('active')[0];
                    e.preventDefault();
                    if (active) Helper.removeClass(active, 'active');
                    Helper.addClass(this, 'active');
                }
            );
        }
    }

})();

