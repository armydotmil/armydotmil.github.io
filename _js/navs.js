/*global document*/

import Subnav from './modules/SubNav';
import Helper from './modules/Helper';

(function() {
    var navs = document.getElementsByTagName('nav'),
        i;

    for (i = 0; i < navs.length; i++) {
        if (Helper.hasClass(navs[i], 'dropdown')) {
            new Subnav(navs[i], false, { persistentLabel: true });
        } else {
            new Subnav(navs[i]);
        }
    }
})();

