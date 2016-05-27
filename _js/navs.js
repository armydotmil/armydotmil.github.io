/*global document,require*/

var Helper = require('./modules/Helper');

(function() {
    'use strict';

    var accordion = document.getElementsByClassName('accordion')[0],
        i = 0,
        len,
        toggles = accordion.getElementsByClassName('toggle-list');

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

    var regionNav = document.getElementsByClassName('dropdown-nav')[0],
        filterBtn = document.getElementsByClassName('filter-btn')[0],
        toggleBtn = filterBtn.getElementsByTagName('span')[0];

    filterBtn.addEventListener(
        'click',
        function() {
            if (!Helper.hasClass(regionNav, 'opened')) {
                Helper.addClass(regionNav, 'opened');
                Helper.addClass(toggleBtn, 'active');
            } else {
                Helper.removeClass(regionNav, 'opened');
                Helper.removeClass(toggleBtn, 'active');
            }
        },
        false
    );
})();

