/*global document,window, init, require, class*/
/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = require('./Helper');

class CustomSelect {
    constructor(el) {
        this.cselect = el;
        this.opened = false;

        // overlay spans the select box (prevents direct click on select)
        this.createOverlayElement();
        // optionBox is the custom popup with select options
        this.createOptionsElement();
        
        document.body.addEventListener('click', this.hideOptions.bind(this));
    }

    toggleOptions() {
        if (!this.opened) {
            this.opened = true;
        } else {
            this.opened = false;
        }
        Helper.toggleClass(this.cselect, 'show-options');
    }

    hideOptions(e) {
        if (this.opened && e.target.className !== 'custom-overlay') {
            Helper.removeClass(this.cselect, 'show-options');
            this.opened = false;
        }
    }

    createOverlayElement() {
        var overlay = document.createElement('div');

        overlay.setAttribute('class', 'custom-overlay');
        overlay.addEventListener('click', this.toggleOptions.bind(this));
        this.cselect.appendChild(overlay);
    }

    createOptionsElement() {
        var evt = document.createEvent('HTMLEvents'),
            select = this.cselect.getElementsByTagName('select')[0],
            options = this.cselect.getElementsByTagName('option'),
            optionBox = document.createElement('div'),
            optionUl = document.createElement('ul'),
            optionLi,
            i;

        optionBox.setAttribute('class', 'custom-options');
        optionBox.appendChild(optionUl);

        for (i = 0; i < options.length; i++) {
            optionLi = document.createElement('li');
            optionLi.setAttribute('data-value', options[i].value);
            optionLi.setAttribute('class', 'custom-select-option');
            optionLi.innerHTML = options[i].textContent;
            optionLi.addEventListener('click', function() {
                evt.initEvent('change', false, true);
                select.value = this.getAttribute("data-value");
                select.dispatchEvent(evt);
            });
            optionUl.appendChild(optionLi);
        }
        this.cselect.appendChild(optionBox);
    }
};

export default CustomSelect;
