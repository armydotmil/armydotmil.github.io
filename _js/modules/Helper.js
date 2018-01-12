/*jshint -W032 */ /* ignore unnecessary semicolon */
class Helper {
    static hasClass(el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return !!el.className.match(
                new RegExp('(\\s|^)' + className + '(\\s|$)')
            );
    }

    static addClass(el, className) {
        if (el.classList)
            el.classList.add(className);
        else if (!this.hasClass(el, className)) el.className += ' ' + className;
    }

    static removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else if (this.hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }

    static toggleClass(el, className) {
        if (this.hasClass(el, className))
            this.removeClass(el, className);
        else
            this.addClass(el, className);
    }

    static randomNumberToken() {
        return new Date().valueOf();
    }
};

export default Helper;
