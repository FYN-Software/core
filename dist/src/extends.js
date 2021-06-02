import Event from './event';
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
    sum: {
        enumerable: false,
        get() {
            return this.reduce((t, v) => t + v, 0);
        },
    },
    indexOfMinValue: {
        enumerable: false,
        get() {
            let value = Infinity;
            let index = -1;
            for (const [i, v] of this.entries()) {
                if (v < value) {
                    value = v;
                    index = i;
                }
            }
            return index;
        },
    },
    indexOfMaxValue: {
        enumerable: false,
        get() {
            let value = -Infinity;
            let index = -1;
            for (const [i, v] of this.entries()) {
                if (v > value) {
                    value = v;
                    index = i;
                }
            }
            return index;
        },
    },
    chunk: {
        enumerable: false,
        value(size) {
            let out = [];
            const chunks = Math.ceil(this.length / size);
            for (let c = 0; c < chunks; c++) {
                out.push(this.slice(c * size, Math.min(this.length, (c + 1) * size)));
            }
            return out;
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
        async value(iterable, map = i => i) {
            const result = [];
            for await (const item of iterable) {
                result.push(await map(item));
            }
            return result;
        },
        enumerable: false,
    },
});
Object.defineProperties(Math, {
    clamp: {
        value(lowerBound, upperBound, value) {
            return value.clamp(lowerBound, upperBound);
        },
        enumerable: false,
    },
    mod: {
        value(value, radix) {
            return value.mod(radix);
        },
        enumerable: false,
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
            yield* this;
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
        value(selector, settings = null) {
            if (settings !== null && typeof selector === 'string') {
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
            let out;
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
Object.defineProperties(DocumentFragment.prototype, {
    innerHTML: {
        get() {
            const div = document.createElement('div');
            div.appendChild(this.cloneNode(true));
            return div.innerHTML;
        }
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
export function clone(obj, root = null) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // Handle Date
    if (obj instanceof Date) {
        let copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (root === null) {
        root = obj;
    }
    // Handle Array
    if (obj instanceof Array) {
        return obj.reduce((t, i) => {
            if (Object.is(i, root) === false) {
                t.push(clone(i));
            }
            return t;
        }, []);
    }
    // Handle Set
    if (obj instanceof Set) {
        return new Set(Array.from(obj).map(v => clone(v)));
    }
    // Handle Object
    return Object.entries(obj).reduce((t, [k, v]) => {
        if (!Object.is(v, root) && !k.startsWith('__')) {
            t[k] = clone(v, root);
        }
        return t;
    }, {});
}
export function equals(a, b, references = new WeakSet()) {
    // NOTE(Chris Kruining) This is an attempt to catch cyclic references
    if (typeof a === 'object' && a !== undefined && a !== null) {
        if (references.has(a)) {
            return true;
        }
        references.add(a);
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
        return a === b;
    }
    // Handle Array
    if (a instanceof Array && b instanceof Array) {
        return Array.compare(a, b);
    }
    // Handle Object
    if (a instanceof Object && b instanceof Object) {
        if (a.constructor.name !== b.constructor.name) {
            return false;
        }
        if (Object.getOwnPropertyNames(a).compare(Object.getOwnPropertyNames(b)) === false) {
            return false;
        }
        for (const p of Object.getOwnPropertyNames(a)) {
            if (equals(a[p], b[p], references) !== true) {
                return false;
            }
        }
        return true;
    }
    return a === b;
}
