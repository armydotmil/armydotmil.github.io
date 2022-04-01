/*global window*/

import CustomSelect from './modules/CustomSelect';

(function() {
    var cselect = document.getElementsByClassName('custom-select'),
        i;

    for (i = 0; i < cselect.length; i++) {
        new CustomSelect(cselect[i]);
    };
})();