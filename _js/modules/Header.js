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
    }

    static addSubmenu() {
        var items = document.getElementsByClassName('menu-item'),
            i = 0, lastClass, li;
        for (i; i < items.length; i++) {
            // function is inside loop because it would not work outside
            // -- you need to add the event listener to each menu item
            items[i].addEventListener('click', function() {
                // a click on the span shouldn't register since we only add the event listener to the anchors
                li = this.parentNode;
                lastClass = Helper.hasClass(li, 'social') ? 'social ' : '';
                li.className = !Helper.hasClass(li, 'expanded') ?
                    lastClass + 'expanded' :
                    lastClass;
            },false);
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
            Helper.removeClass(html, 'menu-open');
            Helper.removeClass(body, 'menu-open');
        }
        if (sectionOpen) {
            Helper.addClass(this.sectionBtn, 'close-button');
            Helper.addClass(this.sectionWin, 'open-window');
            if (this.section === 'search') {
                document.getElementById('query').focus();
            } else {
                Helper.addClass(html, 'menu-open');
                Helper.addClass(body, 'menu-open');
            }
        }
    }
};

export default Header;
