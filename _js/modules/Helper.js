/*jshint -W032 */ /* ignore unnecessary semicolon */
class Helper {
    static hasClass(el, className) {
        return el.classList.contains(className);
    }

    static addClass(el, className) {
        el.classList.add(className);
    }

    static removeClass(el, className) {
        el.classList.remove(className);
    }

    static toggleClass(el, className) {
        el.classList.toggle(className);
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
