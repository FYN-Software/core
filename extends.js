import Event from './event.js';

Object.defineProperties(Number, {
    couldBeNumber: {
        value(val)
        {
            return Number.isNaN(Number.parseInt(val)) !== true;
        },
        enumerable: false,
    },
});

Object.defineProperties(String.prototype, {
    toDashCase: {
        value()
        {
            return this.replace(/([A-Z])/g, (w, u) => `-${ u.toLowerCase() }`).replace(/^-+|-+$/g, '');
        },
        enumerable: false,
    },
    toCamelCase: {
        value()
        {
            return this.replace(/-([a-z])/g, (w, m) => m.toUpperCase());
        },
        enumerable: false,
    },
    capitalize: {
        value()
        {
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        enumerable: false,
    },
});

Object.defineProperties(Array.prototype, {
    apply: {
        value(callback, ...args)
        {
            return Array.from(this).map(i => callback.apply(i, args));
        },
        enumerable: false
    },
    compare: {
        value(arr2)
        {
            if(this.length !== arr2.length)
            {
                return false;
            }

            for(let i = 0; i < this.length; i++)
            {
                if(this[i] instanceof Array && arr2[i] instanceof Array)
                {
                    if(!this[i].compare(arr2[i]))
                    {
                        return false;
                    }
                }
                else if(this[i] !== arr2[i])
                {
                    return false;
                }
            }

            return true;
        },
        enumerable: false
    },
    unique: {
        value()
        {
            return this.filter((v, i, a) => a.indexOf(v) === i);
        },
        enumerable: false
    },
    first: {
        enumerable: false,
        get()
        {
            return this[0];
        },
    },
    last: {
        enumerable: false,
        get()
        {
            return this[this.length - 1];
        },
    },
    sum: {
        enumerable: false,
        get()
        {
            return this.reduce((t, v) => t + v, 0);
        },
    },
    indexOfMinValue: {
        enumerable: false,
        get()
        {
            let value = Infinity;
            let index = -1;

            for(const [ i, v ] of this.entries())
            {
                if(v < value)
                {
                    value = v;
                    index = i;
                }
            }

            return index;
        },
    },
    indexOfMaxValue: {
        enumerable: false,
        get()
        {
            let value = -Infinity;
            let index = -1;

            for(const [ i, v ] of this.entries())
            {
                if(v > value)
                {
                    value = v;
                    index = i;
                }
            }

            return index;
        },
    },
    chunk: {
        enumerable: false,
        value(size)
        {
            let out = [];
            const chunks = Math.ceil(this.length / size);

            for(let c = 0; c < chunks; c++)
            {
                out.push(this.slice(c * size, Math.min(this.length, (c + 1) * size)));
            }

            return out;
        },
    },
});
Object.defineProperties(Array, {
    compare: {
        value(a, b)
        {
            return a.compare(b);
        },
        enumerable: false
    },
    fromAsync: {
        async value(iterator)
        {
            const result = [];

            for await (const item of iterator)
            {
                result.push(item);
            }

            return result;
        },
        enumerable: false
    },
});

Object.defineProperties(Math, {
    clamp: {
        value(lower, upper, value)
        {
            return Math.min(Math.max(value, lower), upper);
        },
        enumerable: false,
    },
    mod: {
        value(n, m)
        {
            return ((n % m) + m) % m;
        },
        enumerable: false,
    },
});

if(typeof EventTarget !== 'undefined')
{
    Object.defineProperties(EventTarget.prototype, {
        trigger: {
            value(name)
            {
                Event.trigger(this, name);

                return this;
            }
        },
        on: {
            value(selector, settings = null)
            {
                if(settings !== null && typeof selector === 'string')
                {
                    if(settings.hasOwnProperty('options') === false)
                    {
                        settings.options = {};
                    }

                    settings.options.selector = selector;
                }

                Event.on(this, settings || selector);

                return this;
            }
        },
        emit: {
            value(name, detail = {}, composed = false)
            {
                this.dispatchEvent(new CustomEvent(name, {
                    bubbles: true,
                    detail,
                    composed,
                }));

                return this;
            }
        },
        await: {
            async value(event)
            {
                return Event.await(this, event);
            },
        },
    });
}

if(typeof DOMTokenList != 'undefined')
{
    Object.defineProperties(DOMTokenList.prototype, {
        toggle: {
            value(name)
            {
                this[Array.from(this).includes(name) ? 'remove' : 'add'](name);

                return this;
            },
        },
        setOnAssert: {
            value(condition, name, ...alt)
            {
                if(condition)
                {
                    this.add(name);
                    this.remove(...alt);
                }
                else
                {
                    this.remove(name);
                    this.add(...alt);
                }

                return this;
            },
        },
    });
}

if(typeof NamedNodeMap != 'undefined')
{
    Object.defineProperties(NamedNodeMap.prototype, {
        toggle: {
            value(key)
            {
                if(Array.from(this).some(i => i.name === key))
                {
                    this.removeNamedItem(key);
                }
                else
                {
                    let attr = document.createAttribute(key);
                    attr.value = '';
                    this.setNamedItem(attr);
                }
            },
        },
        setOnAssert: {
            value(condition, name, value = '')
            {
                if(Array.isArray(name))
                {
                    for(let n of name)
                    {
                        this.setOnAssert(condition, n, value);
                    }
                }
                else if(condition === true)
                {
                    let attr = document.createAttribute(name);
                    attr.value = value;

                    this.setNamedItem(attr);
                }
                else if(condition === false && this.getNamedItem(name) !== null)
                {
                    this.removeNamedItem(name);
                }

                return this;
            },
        },
        apply: {
            value: Array.prototype.apply,
        },
    });
}

if(typeof HTMLElement != 'undefined')
{
    const originalRemove = HTMLElement.prototype.remove;

    Object.defineProperties(HTMLElement.prototype, {
        getInnerClientRect: {
            value()
            {
                const style = window.getComputedStyle(this);
                const rect = this.getBoundingClientRect();

                return new DOMRect(
                    rect.left,
                    rect.top,
                    rect.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
                    rect.height - parseFloat(style.paddingBottom) - parseFloat(style.paddingTop)
                );
            },
        },
        getOuterClientRect: {
            value()
            {
                const style = window.getComputedStyle(this);
                const rect = this.getBoundingClientRect();

                return new DOMRect(
                    rect.left,
                    rect.top,
                    rect.width + parseFloat(style.marginLeft) + parseFloat(style.marginRight),
                    rect.height + parseFloat(style.marginBottom) + parseFloat(style.marginTop)
                );
            },
        },
        index: {
            get()
            {
                return this.hasAttribute('index')
                    ? Number.parseInt(this.getAttribute('index'))
                    : Array.from(this.parentNode.children).indexOf(this);
            },
        },
        cloneStyle: {
            value(src, s = null)
            {
                const style = window.getComputedStyle(src);

                Array.from(style).filter(k => s === null || s.some(p => k.includes(p)))
                    .forEach(k => this.style.setProperty(
                        k,
                        style.getPropertyValue(k),
                        style.getPropertyPriority(k)
                    ));

                return this;
            },
        },
        insertAfter: {
            value(newChild, refChild)
            {
                if(refChild.nextSibling === null)
                {
                    this.appendChild(newChild);
                }
                else
                {
                    this.insertBefore(newChild, refChild.nextSibling);
                }

                return this;
            },
        },
        extract: {
            value()
            {
                this.removeAttribute('template');

                return this.parentNode.removeChild(this);
            },
        },
        remove: {
            value()
            {
                Event.dispose(this);
                originalRemove.call(this);
            }
        },
    });

    Object.defineProperties(HTMLFormElement.prototype, {
        toObject: {
            value(useLabel = false)
            {
                return objectFromEntries(Array.from(this)
                    .filter(i => i.id.length > 0 && (i.type === 'checkbox' ? i.checked : true))
                    .map(f => [ useLabel ? f.label : f.name, f.value ])
                    .filter(([ , v ]) => v.length > 0));
            },
        },
    });
}

if(typeof NodeList != 'undefined')
{
    Object.defineProperties(NodeList.prototype, {
        first: {
            value(callback, ...args)
            {
                if(this.length === 0)
                {
                    return null;
                }

                if(callback !== undefined)
                {
                    callback.apply(this[0], args);
                }

                return this[0];
            },
        },
        on: {
            value(settings, ...args)
            {
                if(!(settings instanceof Object))
                {
                    throw new Error('first argument must be an object');
                }

                this.forEach(el => el.on.apply(el, [ settings, ...args ]));

                return this;
            },
        },
        clear: {
            value()
            {
                Array.from(this).forEach(e => {
                    e.remove();
                    e = undefined;
                });

                return this;
            },
        },
        apply: {
            value: Array.prototype.apply,
        },
    });
}

if(typeof HTMLCollection != 'undefined')
{
    Object.defineProperties(HTMLCollection.prototype, {
        on: {
            value: NodeList.prototype.on,
        },
        clear: {
            value: NodeList.prototype.clear,
        },
        apply: {
            value: Array.prototype.apply,
        },
    });
}

if(typeof Node != 'undefined')
{
    Object.defineProperties(Node.prototype, {
        childOf: {
            value(parent)
            {
                let el = this.parentNode;

                while(el !== null)
                {
                    if(el === parent)
                    {
                        return true;
                    }

                    el = el.parentNode;
                }

                return false;
            },
        },
        findUpstream: {
            value(cb)
            {
                for(const p of this.path)
                {
                    const res = cb(p);

                    if(res)
                    {
                        return res;
                    }
                }

                return undefined;
            },
        },
        path: {
            get()
            {
                let path = [];
                let el = this.parentNode;

                while(el instanceof Node)
                {
                    path.push(el);

                    el = el.parentNode;
                }

                return path;
            },
        },
    });
}

if(typeof Promise != 'undefined')
{
    Object.defineProperties(Promise.prototype, {
        stage: {
            value(cb)
            {
                return this.then(data => {
                    let res = cb(data);

                    if((res instanceof Promise) === false)
                    {
                        res = Promise.resolve(null);
                    }

                    return res.then(() => data);
                });
            },
        },
        chain: {
            value(array, callback, delay = 0)
            {
                return Promise.chain(array, callback, delay);
            },
        },
        log: {
            value(...args)
            {
                // eslint-disable-next-line no-console
                return this.stage((...a) => console.log(...a, ...args));
            },
        },
        delay: {
            value(d)
            {
                return this.then(data => new Promise(r => setTimeout(() => r(data), d)));
            },
        },
    });
    Object.defineProperties(Promise, {
        chain: {
            value(array, callback, delay = 0)
            {
                const options = { delay };

                try
                {
                    return array
                        .map(i => () => Promise.delay(options.delay).then(callback.bind(i, i, options)))
                        .reduce((p, p2) => p.then(p2), Promise.resolve(null));
                }
                catch(e)
                {
                    return Promise.resolve(null);
                }
            },
        },
        delay: {
            value(d)
            {
                return Promise.resolve(null).delay(d);
            },
        },
    });
}

if(typeof CSSStyleDeclaration != 'undefined')
{
    Object.defineProperties(CSSStyleDeclaration.prototype, {
        toggle: {
            value(name, a, b)
            {
                this[name] = this[name] === a ? b : a;
            },
        },
    });
}

if(typeof JSON != 'undefined')
{
    Object.defineProperties(JSON, {
        tryParse: {
            value(str, ret = false)
            {
                try
                {
                    str = JSON.parse(str);
                }
                catch(e)
                {
                    if(ret === true)
                    {
                        return null;
                    }
                }

                return str;
            },
        },
    });
}

if(typeof DocumentFragment != 'undefined')
{
    Object.defineProperties(DocumentFragment, {
        fromString: {
            value(str)
            {
                const temp = document.createElement('template');
                temp.innerHTML = str;

                return temp.content;
            },
        },
    });
    Object.defineProperties(DocumentFragment.prototype, {
        innerHTML: {
            get()
            {
                const div = document.createElement('div');
                div.appendChild(this.cloneNode(true));

                return div.innerHTML;
            }
        },
    });
}

if(typeof DOMRect != 'undefined')
{
    Object.defineProperties(DOMRect.prototype, {
        contains: {
            value(x, y)
            {
                return (x > this.left && x < this.right) && (y > this.top && y < this.bottom);
            },
        },
    });
}

export function clone(obj, root = null)
{
    if(obj === null || typeof obj !== 'object')
    {
        return obj;
    }

    // Handle Date
    if(obj instanceof Date)
    {
        let copy = new Date();
        copy.setTime(obj.getTime());

        return copy;
    }

    if(root === null)
    {
        root = obj;
    }

    // Handle Array
    if(obj instanceof Array)
    {
        return obj.reduce((t, i) => {
            if(!Object.is(i, root))
            {
                t.push(clone(i));
            }

            return t;
        }, []);
    }

    // Handle Set
    if(obj instanceof Set)
    {
        return new Set(Array.from(obj).map(v => clone(v)));
    }

    // Handle Object
    if(obj instanceof Object)
    {
        return Object.entries(obj).reduce((t, [ k, v ]) =>
        {
            if(!Object.is(v, root) && !k.startsWith('__'))
            {
                t[k] = clone(v, root);
            }

            return t;
        }, {});
    }

    throw new Error('Unable to copy obj! Its type isn\'t supported.');
}

export function equals(a, b, references = new WeakSet())
{
    // NOTE(Chris Kruining) This is an attempt to catch cyclic references
    if(typeof a === 'object' && a !== undefined && a !== null)
    {
        if (references.has(a))
        {
            return true;
        }

        references.add(a);
    }

    if(typeof a !== typeof b)
    {
        return false;
    }

    if(a === null || typeof a !== 'object' || b === null || typeof b !== 'object')
    {
        return a === b;
    }

    // Handle Array
    if(a instanceof Array && b instanceof Array)
    {
        return Array.compare(a, b);
    }

    // Handle Object
    if(a instanceof Object && b instanceof Object)
    {
        if(a.constructor.name !== b.constructor.name)
        {
            return false;
        }

        if(Object.getOwnPropertyNames(a).compare(Object.getOwnPropertyNames(b)) === false)
        {
            return false;
        }

        for(const p of Object.getOwnPropertyNames(a))
        {
            if(equals(a[p], b[p], references) !== true)
            {
                return false;
            }
        }

        return true;
    }

    return a === b;
}

export function objectFromEntries(arr)
{
    return arr.reduce((t, [ n, v ]) =>
    {
        t[n] = v;

        return t;
    }, {});
}
