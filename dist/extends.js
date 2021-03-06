import Event from './event.js';
import * as Functions from './functions.js';
export * from './functions.js';
Object.defineProperties(Array.prototype, {
    compare: {
        value(arr2) {
            if (this.length !== arr2.length) {
                return false;
            }
            for (let i = 0; i < this.length; i++) {
                if (this[i] instanceof Array && arr2[i] instanceof Array) {
                    if (!this[i].compare(arr2[i])) {
                        return false;
                    }
                }
                else if (this[i] !== arr2[i]) {
                    return false;
                }
            }
            return true;
        },
        enumerable: false
    },
    unique: {
        value() {
            return this.filter((v, i, a) => a.indexOf(v) === i);
        },
        enumerable: false
    },
    first: {
        enumerable: false,
        get() {
            return this[0];
        },
    },
    last: {
        enumerable: false,
        get() {
            return this[this.length - 1];
        },
    },
    filterAsync: {
        enumerable: false,
        async value(predicate) {
            return this.reduce(async (memo, e) => await predicate(e) ? [...await memo, e] : memo, []);
        },
    },
    shuffle: {
        enumerable: false,
        value() {
            return this.map((i) => [Math.random(), i])
                .sort((a, b) => a[0] - b[0])
                .map((i) => i[1]);
        },
    },
});
Object.defineProperties(Array, {
    compare: {
        value(a, b) {
            return a.compare(b);
        },
        enumerable: false,
    },
    fromAsync: {
        value: Functions.arrayFromAsync,
        enumerable: false,
    },
});
Object.defineProperties(DOMRect.prototype, {
    contains: {
        value(x, y) {
            return (x > this.left && x < this.right) && (y > this.top && y < this.bottom);
        },
    },
});
Object.defineProperties(Number.prototype, {
    map: {
        value(lowerBoundIn, upperBoundIn, lowerBoundOut, upperBoundOut) {
            return (this - lowerBoundIn) * (upperBoundOut - lowerBoundOut) / (upperBoundIn - lowerBoundIn) + lowerBoundOut;
        },
        enumerable: false,
    },
    clamp: {
        value(lowerBound, upperBound) {
            return Math.min(Math.max(this, lowerBound), upperBound);
        },
        enumerable: false,
    },
    mod: {
        value(radix) {
            return ((this % radix) + radix) % radix;
        },
        enumerable: false,
    },
});
Object.defineProperties(String.prototype, {
    toDashCase: {
        value() {
            return this.replace(/([A-Z])/g, (w, u) => `-${u.toLowerCase()}`).replace(/^-+|-+$/g, '');
        },
        enumerable: false,
    },
    toSnakeCase: {
        value() {
            return this.replace(/([A-Z])/g, (w, u) => `_${u.toLowerCase()}`).replace(/^_+|_+$/g, '');
        },
        enumerable: false,
    },
    toCamelCase: {
        value() {
            return this.replace(/[\-_]([a-z])/g, (w, m) => m.toUpperCase());
        },
        enumerable: false,
    },
    capitalize: {
        value() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        enumerable: false,
    },
    [Symbol.asyncIterator]: {
        async *value() {
            const c = this.length;
            for (let i = 0; i < c; i++) {
                yield this[i];
            }
        },
        enumerable: false,
    },
    toAsyncIterable: {
        async *value() {
            yield* this;
        },
        enumerable: false,
    },
});
Object.defineProperties(EventTarget.prototype, {
    trigger: {
        value(name) {
            Event.trigger(this, name);
            return this;
        }
    },
    on: {
        value(selector, settings) {
            if (settings !== undefined && typeof selector === 'string') {
                if (settings.hasOwnProperty('options') === false) {
                    settings.options = {};
                }
                settings.options.selector = selector;
            }
            Event.on(this, settings ?? selector);
            return this;
        }
    },
    emit: {
        value(name, detail = {}, composed = false) {
            const event = new CustomEvent(name, {
                bubbles: true,
                detail,
                composed,
            });
            this.dispatchEvent(event);
            return event;
        }
    },
    await: {
        async value(event) {
            return Event.await(this, event);
        },
    },
});
Object.defineProperties(JSON, {
    tryParse: {
        value(str, ret = false) {
            let out = str;
            try {
                out = JSON.parse(str);
            }
            catch (e) {
                if (ret === true) {
                    return null;
                }
            }
            return out;
        },
    },
});
Object.defineProperties(DocumentFragment, {
    fromString: {
        value(str) {
            return document.createRange().createContextualFragment(str);
        },
    },
});
Object.defineProperties(DocumentFragment.prototype, {
    innerHTML: {
        get() {
            const div = document.createElement('div');
            div.appendChild(this.cloneNode(true));
            return div.innerHTML;
        }
    },
});
const originalRemove = Node.prototype.remove;
Object.defineProperties(Node.prototype, {
    remove: {
        value() {
            Event.dispose(this);
            originalRemove.call(this);
        }
    },
});
Object.defineProperties(NodeList.prototype, {
    clear: {
        value() {
            for (const node of this) {
                node.remove();
            }
            return this;
        }
    },
});
Object.defineProperties(Element.prototype, {
    __index: {
        get() {
            return Number.parseInt(this.getAttribute('index')
                ?? Array.from(this.parentNode.children).indexOf(this));
        },
    },
});
Object.defineProperties(Promise.prototype, {
    stage: {
        async value(callback) {
            const data = await this;
            await callback(data);
            return data;
        },
    },
    delay: {
        value(milliseconds) {
            return this.then(data => new Promise(r => setTimeout(() => r(data), milliseconds)));
        },
    },
});
Object.defineProperties(Promise, {
    delay: {
        value(milliseconds) {
            return Promise.resolve().delay(milliseconds);
        },
    },
});
Object.defineProperties(NamedNodeMap.prototype, {
    toggle: {
        value(key) {
            if (Array.from(this).some(i => i.name === key)) {
                this.removeNamedItem(key);
            }
            else {
                let attr = document.createAttribute(key);
                attr.value = '';
                this.setNamedItem(attr);
            }
        },
    },
    setOnAssert: {
        value(condition, name, value = '') {
            if (Array.isArray(name)) {
                for (let n of name) {
                    this.setOnAssert(condition, n, value);
                }
            }
            else if (condition === true) {
                let attr = document.createAttribute(name);
                attr.value = value;
                this.setNamedItem(attr);
            }
            else if (condition === false && this.getNamedItem(name) !== null) {
                this.removeNamedItem(name);
            }
            return this;
        },
    },
});
Object.defineProperties(window, {
    AsyncFunction: {
        value: Object.getPrototypeOf(async function () { }).constructor,
    },
    range: {
        value: (s, e) => Array(e - s).fill(1).map((_, i) => s + i),
    },
});
//# sourceMappingURL=extends.js.map