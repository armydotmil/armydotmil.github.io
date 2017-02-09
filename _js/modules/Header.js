/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = require('./Helper');

class Header {
    constructor(section) {
        //This is for main navbar
        this.section = section;
        this.sectionBtn =
            document.getElementsByClassName(section + '-button')[0];
        this.sectionWin =
            document.getElementsByClassName(section + '-window')[0];
        this.headerElem = document.getElementsByTagName('header')[0];
        this.navbtns = document.getElementsByClassName('nav-button');
        this.navwins = document.getElementsByClassName('nav-window');
        this.sectionBtn.addEventListener(
            'click',
            this.toggleNavOption.bind(this),
            false
        );

        // uncheck boxes on refresh
        var checkboxes =
            this.headerElem.querySelectorAll('input[type=checkbox]:checked'),
            i = 0,
            len;

        for (i, len = checkboxes.length; i < len; i++) {
            checkboxes[i].checked = false;
        }
    }

    toggleNavOption() {
        var body = document.getElementsByTagName('body')[0],
            html = document.getElementsByTagName('html')[0],
            i = 0,
            secClass = this.sectionBtn.className,
            sectionOpen = (secClass.indexOf('close-button') === -1);

        for (i = 0; i < this.navbtns.length; i++) {
            Helper.removeClass(this.navbtns[i], 'close-button');
            Helper.removeClass(this.navwins[i], 'open-window');
            this.navbtns[i].setAttribute('aria-expanded', 'false');
            Helper.removeClass(html, 'menu-open');
            Helper.removeClass(body, 'menu-open');
        }
        if (sectionOpen) {
            Helper.addClass(this.sectionBtn, 'close-button');
            Helper.addClass(this.sectionWin, 'open-window');
            this.sectionBtn.setAttribute('aria-expanded', 'true');
            if (this.section === 'search') {
                document.getElementById('usagov-search-query').focus();
            } else {
                Helper.addClass(html, 'menu-open');
                Helper.addClass(body, 'menu-open');
            }
        }
    }
};

export default Header;
