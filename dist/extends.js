import { waitFor as eventWaitFor, on as eventOn, dispatch, } from './event.js';
import { range as numberRange, } from './function/number.js';
Object.defineProperties(EventTarget.prototype, {
    on: {
        value(selector, settings) {
            if (settings !== undefined && typeof selector === 'string') {
                if (settings.hasOwnProperty('options') === false) {
                    settings.options = {};
                }
                settings.options.selector = selector;
            }
            eventOn(this, settings ?? selector);
            return this;
        }
    },
    emit: {
        value(name, detail, options = {}) {
            return dispatch(this, name, {
                bubbles: true,
                composed: false,
                ...options,
                detail,
            });
        }
    },
    await: {
        async value(event) {
            return eventWaitFor(this, event);
        },
    },
});
if (typeof DocumentFragment !== 'undefined') {
    Object.defineProperties(DocumentFragment.prototype, {
        innerHTML: {
            get() {
                console.warn('deprecated, `DocumentFragment.innerHTML` will be removed');
                const div = document.createElement('div');
                div.appendChild(this.cloneNode(true));
                return div.innerHTML;
            }
        },
    });
}
if (typeof HTMLTemplateElement !== 'undefined') {
    Object.defineProperties(HTMLTemplateElement.prototype, {
        innerHTML: {
            get() {
                console.warn('deprecated, `HTMLTemplateElement.innerHTML` will be removed');
                const div = document.createElement('div');
                div.appendChild(this.content.cloneNode(true));
                return div.innerHTML;
            }
        },
    });
}
if (typeof window !== 'undefined') {
    Object.defineProperties(window, {
        range: { value: numberRange },
    });
}
//# sourceMappingURL=extends.js.map