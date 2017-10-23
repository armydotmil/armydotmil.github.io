/*jshint esversion: 6 */ /* ignore unnecessary semicolon */
/*global require*/

var Helper = require('./Helper');

class Validity {

    constructor(form, submit = '', normalSubmit = false) {
        var i = 0,
            len,
            $this = this;

        $this.validationFn = typeof form.checkValidity === 'function' ?
            function(el) { return el.checkValidity(); } :
            function(el) { return $this.isValid(el); };

        for (i = 0, len = form.elements.length; i < len; i++) {
            $this.validateOnBlur(form.elements[i]);
        }

        form.validate = function() {
            var j = 0,
                invalid = 0,
                len;

            // check all items once more on submit
            for (j = 0, len = this.elements.length; j < len; j++) {
                if (!$this.markField($this.validationFn(this.elements[j]), this.elements[j])) invalid++;
            }

            if (invalid > 0) return false;

            // if you've gotten to this point, the form is good to go
            if (normalSubmit)
                this.submit();
            else
                return true;
        };

        form.onsubmit = submit || function () {
            if (!this.validate()) return false;
        };
    }

    validateOnBlur(el) {
        var $this = this;

        if (el.getAttribute('type') === 'checkbox') {
            el.addEventListener(
                'click',
                function() {
                    $this.markField($this.validationFn(this), this);
                },
                false
            );
        } else {
            el.addEventListener(
                'blur',
                function() {
                    if (!Helper.hasClass(this, 'no-validate'))
                        $this.markField($this.validationFn(this), this);
                },
                false
            );
        }
    }

    markField(valid, el) {
        if (!valid) {
            el.setCustomValidity('');

            Helper.addClass(el, 'invalid');

            return false;
        } else {
            if (Helper.hasClass(el, 'invalid'))
                Helper.removeClass(el, 'invalid');
        }

        return true;
    }

    isValid(el) {
        if (el.getAttribute('type') === 'email') {

            return !this.isEmpty(el) && this.validateEmail(el) && !this.isPlaceholder(el);

        } else if (el.getAttribute('type') === 'tel') {

            return !this.isEmpty(el) && this.validatePhone(el) && !this.isPlaceholder(el);

        } else if (el.getAttribute('type') === 'url') {

            return !this.isEmpty(el) && this.validateUrl(el) && !this.isPlaceholder(el);

        } else if (el.getAttribute('type') === 'checkbox') {

            return this.validateCheckbox(el);

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
        // custom URL validation... more flexible, more accurate
        return /^(https?:\/\/)?(\w+(-\w+)*\.){2,}[a-z]{2,}(:[0-9]+)?(\/[\w\-]+)*(\/([\w\-\x40$\.\x2B!*\x27(),]|(%[A-Z0-9]{2}))+)?((\.[a-z]{2,})|\/)?((\?[\w\-]+=([\w\-\x40$\.\x2B!*\x27(),]|(%[A-Z0-9]{2}))+)(\x26[\w\-]+=([\w\-\x40$\.\x2B!*\x27(),]|(%[A-Z0-9]{2}))+)*)?(#([\w\-\x40$\.\x2B!*\x27(),]|(%[A-Z0-9]{2}))+)?$/gi.test(el.value);
    }

    validateCheckbox(el) {
        return el.checked;
    }

    isEmpty(el) {
        return el.value.length === 0 || !el.value.trim();
    }

    isPlaceholder(el) {
        return el.getAttribute('placeholder') && el.value === el.getAttribute('placeholder');
    }

};

export default Validity;