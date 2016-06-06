/*global window,require*/

var CustomSelect = require('./modules/CustomSelect');

(function() {
    'use strict';
    var cselect = document.getElementsByClassName('custom-select'),
    i;

    for (i = 0; i < cselect.length; i++) {
        new CustomSelect(cselect[i]);
    };
})();
