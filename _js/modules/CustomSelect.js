/*global document,window, init, require, class*/
/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = require('./Helper');

class CustomSelect {
    constructor(el) {
        this.optionBox = document.createElement('div');
        this.opened = false;

        // overlay spans the select box (prevents direct click on select)
        this.createOverlayElement(el);
        // optionBox is the custom popup with select options
        this.createOptionsElement(el);
        
        document.body.addEventListener('click', this.hideOptions.bind(this));
    }

    toggleOptions() {
        if (!this.opened) {
            this.opened = true;
        } else {
            this.opened = false;
        }
        Helper.toggleClass(this.optionBox, 'show');        
    }

    hideOptions(e) {
        if (this.opened && e.target.className !== 'custom-overlay') {
            Helper.removeClass(this.optionBox, 'show');
            this.opened = false;
        }
    }

    createOverlayElement(cselect) {
        var overlay = document.createElement('div');

        overlay.setAttribute('class', 'custom-overlay');
        overlay.addEventListener('click', this.toggleOptions.bind(this));
        cselect.appendChild(overlay);
    }

    createOptionsElement(cselect) {
        var select = cselect.getElementsByTagName('select')[0],
            options = cselect.getElementsByTagName('option'),
            optionUl = document.createElement('ul'),
            optionLi,
            i;

        this.optionBox.setAttribute('class', 'custom-options');
        this.optionBox.appendChild(optionUl);

        for (i = 0; i < options.length; i++) {
            optionLi = document.createElement('li');
            optionLi.setAttribute('data-value', options[i].value);
            optionLi.setAttribute('class', 'custom-select-option');
            optionLi.innerHTML = options[i].textContent;
            optionLi.addEventListener('click', function() {
                select.value = this.getAttribute("data-value");
            });
            optionUl.appendChild(optionLi);
        }
        cselect.appendChild(this.optionBox);
    }
};

export default CustomSelect;
