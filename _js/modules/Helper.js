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

    static showWhileFocused(containerEl, callback) {
        if (containerEl) {
            containerEl.addEventListener('focusin', () => {
                this.addClass(containerEl, 'focus-in');
                callback?.('focus-in');
            });
            containerEl.addEventListener('focusout', () => {
                // the document.activeElement is not available until after a timeout
                setTimeout(() => {
                    var active = document.activeElement;
                    // if the active element is the container, something in the container, or the body element
                    // (body element is returned for click events)
                    var inside = (containerEl == active || containerEl.contains(active) || active === document.body);
                    
                    // if the active element is no longer in the container, close it
                    if (!inside) {
                        this.removeClass(containerEl, 'focus-in');
                        callback?.('focus-out');
                    }
                }, 1);
            });
        }
    }
};

export default Helper;
