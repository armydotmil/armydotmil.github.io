/*jshint esversion: 6 */ /* ignore unnecessary semicolon */
/*global require*/

var Helper = require('./Helper');

class Validity {

    constructor(form, submit = '') {
        var $this = this;

        // rewrite checkValidity function if its not available in the browser
        form.checkValidity = form.checkValidity || function() {
            var invalid = 0;

            for (var i = 0, len = this.elements.length; i < len; i++) {
                var el = this.elements[i];

                if (!$this.isValid(el) &&
                    !Helper.hasClass(el, 'no-validate')) {

                    Helper.addClass(el, 'invalid');

                    invalid++;
                } else {
                    if (Helper.hasClass(el, 'invalid'))
                        Helper.removeClass(el, 'invalid');
                }
            }

            if (invalid > 0) return false;

            this.submit();
        };

        form.onsubmit = submit || function () {
            if (!this.checkValidity()) return false;
        };
    }

    isValid(el) {
        if (el.getAttribute('type') === 'email') {

            return !this.isEmpty(el) && this.validateEmail(el) && !this.isPlaceholder(el);

        } else if (el.getAttribute('type') === 'tel') {

            return !this.isEmpty(el) && this.validatePhone(el) && !this.isPlaceholder(el);

        } else if (el.getAttribute('type') === 'url') {

            return !this.isEmpty(el) && this.validateUrl(el) && !this.isPlaceholder(el);

        } else {
            return !this.isEmpty(el) && !this.isPlaceholder(el);
        }
    }

    validateEmail(el) {
        // http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
        return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(el.value);
    }

    validatePhone(el) {
        return /^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/.test(el.value);
    }

    validateUrl(el) {
        // http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gi.test(el.value);
    }

    isEmpty(el) {
        return el.value.length === 0 || !el.value.trim();
    }

    isPlaceholder(el) {
        return el.getAttribute('placeholder') && el.value === el.getAttribute('placeholder');
    }

};

export default Validity;