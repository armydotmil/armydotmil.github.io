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

    var nav = document.getElementsByClassName('dropdown-nav')[0],
        navItems = nav.getElementsByTagName('li'),
        navLen,
        x = 0;

    function makeClickListener(el) {
        el.addEventListener(
            'click',
            function() {
                for (var j = 0, len = navItems.length; j < len; j++) {
                    Helper.removeClass(navItems[j], 'active');
                }
                Helper.addClass(el, 'active');
                Helper.removeClass(regionNav, 'opened');
                Helper.removeClass(toggleBtn, 'active');
            },
            false
        );
    }

    for (x, navLen = navItems.length; x < navLen; x++) {
        makeClickListener(navItems[x]);
    }
})();

