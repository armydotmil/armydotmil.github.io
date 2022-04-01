/*global document*/
import Header from './modules/Header';
import ScrollNav from './modules/ScrollNav';

(function() {
    var navbar = document.getElementsByClassName('navbar')[0].parentNode;
    new Header('menu');
    new Header('search');
    new ScrollNav(navbar, 150);
})();
