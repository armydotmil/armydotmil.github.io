/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = require('./Helper');
/**
 * Sets up a sub navigation for selecting particular DIV elements
 */
class SubNav {

    /**
     * Initialize the sub navigation links
     */
    constructor(el, callbackFn, options) {
        var _this = this,
            i,
            mDiv,
            urlArr = document.URL.split('#'),
            url = urlArr[0],
            hash = window.location.hash,
            hashItem,
            subnavCheck,
            subnav = el; // document.getElementsByTagName('nav')[0]

        this.defaults = this.initDefaults(options);
        this.callback = callbackFn;
        if (hash !== '') hash = hash.substr(1); // remove '#'

        subnavCheck = subnav.getElementsByTagName('input');
        this.menuItems = subnav.querySelectorAll('ul a');
        this.menuDivs = [];
        this.currentSelect = '';
        this.toggleLabel = subnav.getElementsByTagName('label');

        if (this.toggleLabel.length > 0) {
            this.toggleLabel = this.toggleLabel[0];
        } else {
            this.toggleLabel = document.createElement('div');
        }
        this.toggleLabelDefault = this.toggleLabel.innerHTML;

        if (subnavCheck.length > 0 && subnavCheck[0].type === 'checkbox') {
            subnavCheck = subnavCheck[0];
            // FF maintains checked state on reload
            subnavCheck.checked = false;
        }

        for (i = 0; i < this.menuItems.length; i++) {
            // each menu item has a corresponding div
            // (menuItem.id = div.className)
            mDiv = document.getElementsByClassName(this.menuItems[i].id)[0];
            if (this.menuItems[i].id === hash && hash) hashItem = this.menuItems[i];
            this.menuDivs.push(mDiv);
            if (mDiv) {
                Helper.addClass(mDiv, 'subnav-selectable');
            }

            // click event for menu item
            this.menuItems[i].onclick = function(e) {
                var hashval = this.href.substr(url.length);
                if (_this.defaults.preventDefault) e.preventDefault();
                if (hashval === '') hashval = url;
                if (history.pushState) {
                    history.pushState(null, document.title, hashval);
                }
                _this.setMenu(this);
                if (subnavCheck) subnavCheck.checked = false;
            };
        }

        if (this.defaults.initializeEmpty) {
            this.setMenu('empty');
        } else if (hashItem) {
            this.setMenu(hashItem);
        } else {
            // initialize the first menuItem as selected
            this.setMenu(this.menuItems[0]);
        }
    }

    /**
     * initialize the defaults object, using options
     * @param {object} options
     */
    initDefaults(options) {
        var defaults = {
                preventDefault: true,
                persistentLabel: false,
                initializeEmpty: false
            },
            key;

        for (key in options) {
            if (defaults.hasOwnProperty(key)) {
                defaults[key] = options[key];
            }
        }

        return defaults;
    }

    /**
     * set and unset selected menu items
     * @param {object} menu item DOM element
     */
    setMenu(menuItem) {
        var i;

        if (this.currentSelect !== menuItem) {
            if (typeof this.callback === 'function' && menuItem !== 'empty') this.callback(menuItem);
            for (i = 0; i < this.menuItems.length; i++) {
                if (this.menuItems[i] === menuItem) {
                    this.currentSelect = menuItem;
                    Helper.addClass(menuItem, 'active');
                    // only change the menu button and div, if a div exists
                    if (this.menuDivs[i]) {
                        if (!this.defaults.persistentLabel) this.toggleLabel.innerHTML = this.menuItems[i].innerHTML;
                        this.showMenuDiv(this.menuDivs[i], true);
                    } else {
                        this.toggleLabel.innerHTML = this.toggleLabelDefault;
                    }
                } else {
                    Helper.removeClass(this.menuItems[i], 'active');
                    this.showMenuDiv(this.menuDivs[i]);
                }
            }
        }
    }

    showMenuDiv(elem, add) {
        if (elem) {
            if (add === true) {
                Helper.addClass(elem, 'subnav-selected');
            } else {
                Helper.removeClass(elem, 'subnav-selected');
            }
        }
    }
};

export default SubNav;
