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
            i, j,
            mDiv,
            urlArr = document.URL.split('#'),
            url = urlArr[0],
            hash = window.location.hash.toLowerCase(),
            hashItem,
            subnavCheck,
            menuLink,
            mItems,
            docElem = document.documentElement,
            winW = Math.max(docElem.clientWidth, window.innerWidth || 0);

        this.defaults = this.initDefaults(options);
        this.callback = callbackFn;
        this.subnav = el;

        subnavCheck = this.subnav.getElementsByTagName('input');
        mItems = this.subnav.querySelectorAll('ul a');
        this.menuItems = {};
        this.menuDivs = {};
        this.firstHash = '';
        this.currentSelect = '';
        this.toggleLabel = this.subnav.getElementsByTagName('label');

        if (this.toggleLabel.length > 0) {
            this.toggleLabel = this.toggleLabel[0];
        } else {
            this.toggleLabel = document.createElement('div');
        }
        this.toggleLabelDefault = this.toggleLabel.innerHTML;

        if (subnavCheck.length > 0 && subnavCheck[0].type === 'checkbox') {
            subnavCheck = subnavCheck[0];
            if (winW <= 992) this.defaults.initializeOpen = false;
            // FF maintains checked state on reload
            subnavCheck.checked = this.defaults.initializeOpen;
        }

        for (i = 0; i < mItems.length; i++) {
            // each menu item has a corresponding div
            // (menuItem href = div.className)
            menuLink = mItems[i].getAttribute('href').toLowerCase();
            mDiv = (menuLink === '') ?
                [] :
                document.getElementsByClassName(menuLink.substr(1));
            // fallback to ID if href hash not found
            if (mDiv.length === 0 && mItems[i].getAttribute('data-id')) {
                mDiv = document.getElementsByClassName(mItems[i].getAttribute('data-id'));
                menuLink = '#' + mItems[i].getAttribute('data-id');
            } else if (mDiv.length === 0 && mItems[i].id) {
                mDiv = document.getElementsByClassName(mItems[i].id);
                menuLink = '#' + mItems[i].id;
            }
            if (menuLink === hash && hash) hashItem = menuLink;
            if (i === 0) this.firstHash = menuLink;
            this.menuItems[menuLink] = mItems[i];
            this.menuDivs[menuLink] = mDiv;
            for (j = 0; j < mDiv.length; j++) {
                Helper.addClass(mDiv[j], 'subnav-selectable');
            }

            // click event for menu item
            mItems[i].onclick = function(e) {
                var hashval = this.getAttribute('href'),
                    page = location.pathname + location.search + hashval,
                    linkid = (this.getAttribute('data-id')) ? this.getAttribute('data-id') : this.id,
                    hashLink = (hashval === '') ? '#' + linkid : hashval;
                if (_this.defaults.preventDefault) e.preventDefault();
                if (hashval === '') hashval = url;
                if (history.pushState)
                    history.pushState(null, document.title, hashval);
                if (typeof ga !== 'undefined')
                    ga('send', 'event', 'subnav', 'click', page);
                _this.setMenu(hashLink);
                if (subnavCheck) subnavCheck.checked = false;
            };
        }

        window.addEventListener(
            "hashchange",
            function(e) {
                var body = document.getElementsByTagName('body')[0],
                    html = document.getElementsByTagName('html')[0],
                    i,              
                    nav = document.getElementsByTagName('header'),
                    navwins,
                    navcls;

                _this.setMenu(location.hash, true);
                if (subnavCheck) subnavCheck.checked = false;

                // clear open menu
                Helper.removeClass(html, 'menu-open');
                Helper.removeClass(body, 'menu-open');
                if (nav.length) {
                    // clear close buttons and open windows
                    navcls = nav[0].getElementsByClassName('close-button');
                    navwins = nav[0].getElementsByClassName('open-window');
                    for (i = navcls.length - 1; i >= 0; i--) {
                        Helper.removeClass(navcls[i], 'close-button');
                    }
                    for (i = navwins.length - 1; i >= 0; i--) {
                        Helper.removeClass(navwins[i], 'open-window');
                    }
                }
            },
            false
        );

        if (this.defaults.initializeEmpty) {
            this.setMenu('empty');
        } else if (hashItem) {
            this.setMenu(hashItem);
        } else {
            // initialize the first menuItem as selected
            this.setMenu(this.firstHash);
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
                initializeEmpty: false,
                initializeOpen: false
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
    setMenu(hashIndex, toTop) {
        var i,
            active,
            selected;

        if ((this.menuItems[hashIndex] || hashIndex === 'empty') && this.currentSelect !== hashIndex) {
            active = this.subnav.getElementsByClassName('active');
            selected = document.getElementsByClassName('subnav-selected');

            // changing classname of nodelist element can remove element from
            // list (changing indexes), so loop through list backwards...
            for (i = active.length - 1; i >= 0; i--) {
                Helper.removeClass(active[i], 'active');
            }
            for (i = selected.length - 1; i >= 0; i--) {
                Helper.removeClass(selected[i], 'subnav-selected');
            }

            if (hashIndex !== 'empty') {
                Helper.addClass(this.menuItems[hashIndex], 'active');
                // only change the menu button and div, if a div exists
                if (this.menuDivs[hashIndex]) {
                    if (!this.defaults.persistentLabel) {
                        this.toggleLabel.innerHTML =
                            this.menuItems[hashIndex].innerHTML;
                    }
                    this.showMenuDiv(this.menuDivs[hashIndex], true);
                    if (toTop) window.scrollTo(0, 0);
                } else {
                    this.toggleLabel.innerHTML = this.toggleLabelDefault;
                }

                if (typeof this.callback === 'function') {
                    this.callback(this.menuItems[hashIndex]);
                }
            }

            this.currentSelect = hashIndex;
        }
    }

    showMenuDiv(divs, add) {
        var i;

        for (i = divs.length - 1; i >= 0; i--) {
            if (add === true) {
                Helper.addClass(divs[i], 'subnav-selected');
            } else {
                Helper.removeClass(divs[i], 'subnav-selected');
            }
        }
    }
};

export default SubNav;
