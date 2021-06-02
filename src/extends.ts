import Event from './event.js';

Object.defineProperties(Array.prototype, {
    compare: {
        value<T>(arr2: Array<T>): boolean
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
        value(): Array<any>
        {
            return this.filter((v: any, i: any, a: any) => a.indexOf(v) === i);
        },
        enumerable: false
    },
    first: {
        enumerable: false,
        get<T>(this: Array<T>): T|undefined
        {
            return this[0];
        },
    },
    last: {
        enumerable: false,
        get<T>(this: Array<T>): T|undefined
        {
            return this[this.length - 1];
        },
    },
    sum: {
        enumerable: false,
        get<T extends number>(this: Array<T>): number
        {
            return this.reduce((t: number, v: number) => t + v, 0);
        },
    },
    indexOfMinValue: {
        enumerable: false,
        get<T extends number>(this: Array<T>): number
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
        get<T extends number>(this: Array<T>): number
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
        value<T>(size: number): Array<Array<T>>
        {
            let out: Array<Array<T>> = [];
            const chunks = Math.ceil(this.length / size);

            for(let c = 0; c < chunks; c++)
            {
                out.push(this.slice(c * size, Math.min(this.length, (c + 1) * size)));
            }

            return out;
        },
    },
    filterAsync: {
        enumerable: false,
        async value<T>(predicate: (toTest: T) => Promise<Boolean>): Promise<Array<T>>
        {
            return this.reduce(async (memo: Promise<T[]>, e: T) => await predicate(e) ? [...await memo, e] : memo, []);
        },
    },
    shuffle: {
        enumerable: false,
        value<T>(): Array<T>
        {
            return this.map((i: T) => [Math.random(), i])
                .sort((a: [number, T], b: [number, T]) => a[0] - b[0])
                .map((i: [number, T]) => i[1]);
        },
    },
});
Object.defineProperties(Array, {
    compare: {
        value<T>(a: Array<T>, b: Array<T>)
        {
            return a.compare(b);
        },
        enumerable: false,
    },
    fromAsync: {
        async value<TIn, TOut>(iterable: AsyncIterable<TIn>|Iterable<TIn>, map: (i: TIn) => TOut = i => i as any): Promise<Array<TOut>>
        {
            const result = [];

            for await (const item of iterable)
            {
                result.push(await map(item));
            }

            return result;
        },
        enumerable: false,
    },
});

Object.defineProperties(Math, {
    clamp: {
        value(lowerBound: number, upperBound: number, value: number): number
        {
            return value.clamp(lowerBound, upperBound);
        },
        enumerable: false,
    },
    mod: {
        value(value: number, radix: number): number
        {
            return value.mod(radix);
        },
        enumerable: false,
    },
});

Object.defineProperties(DOMRect.prototype, {
    contains: {
        value(x: number, y: number): boolean
        {
            return (x > this.left && x < this.right) && (y > this.top && y < this.bottom);
        },
    },
});

Object.defineProperties(Number.prototype, {
    map: {
        value(this: number, lowerBoundIn: number, upperBoundIn: number, lowerBoundOut: number, upperBoundOut: number): number
        {
            return (this - lowerBoundIn) * (upperBoundOut - lowerBoundOut) / (upperBoundIn - lowerBoundIn) + lowerBoundOut;
        },
        enumerable: false,
    },
    clamp: {
        value(this: number, lowerBound: number, upperBound: number): number
        {
            return Math.min(Math.max(this, lowerBound), upperBound);
        },
        enumerable: false,
    },
    mod: {
        value(this: number, radix: number): number
        {
            return ((this % radix) + radix) % radix;
        },
        enumerable: false,
    },
});

Object.defineProperties(String.prototype, {
    toDashCase: {
        value(this: string): string
        {
            return this.replace(/([A-Z])/g, (w: string, u: string) => `-${ u.toLowerCase() }`).replace(/^-+|-+$/g, '');
        },
        enumerable: false,
    },
    toSnakeCase: {
        value(this: string): string
        {
            return this.replace(/([A-Z])/g, (w: string, u: string) => `_${ u.toLowerCase() }`).replace(/^_+|_+$/g, '');
        },
        enumerable: false,
    },
    toCamelCase: {
        value(this: string): string
        {
            return this.replace(/[\-_]([a-z])/g, (w: string, m: string) => m.toUpperCase());
        },
        enumerable: false,
    },
    capitalize: {
        value(this: string): string
        {
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        enumerable: false,
    },
    [Symbol.asyncIterator]: {
        async *value(): AsyncGenerator<string, void, void>
        {
            const c = this.length;
            for(let i = 0; i < c; i++)
            {
                yield this[i];
            }
        },
        enumerable: false,
    },
    toAsyncIterable: {
        async *value(): AsyncGenerator<string, void, void>
        {
            yield* this;
        },
        enumerable: false,
    },
});

Object.defineProperties(EventTarget.prototype, {
    trigger: {
        value(name: string): EventTarget
        {
            Event.trigger(this, name);

            return this;
        }
    },
    on: {
        value<T extends Element = Element, TEvents extends object = {}>(
            this: T,
            selector: string|EventListenerConfig<T, TEvents>,
            settings?: EventListenerConfig<T, TEvents>
        ): EventTarget
        {
            if(settings !== undefined && typeof selector === 'string')
            {
                if(settings.hasOwnProperty('options') === false)
                {
                    settings.options = {};
                }

                settings.options!.selector = selector;
            }

            Event.on(this, settings ?? (selector as EventListenerConfig<T, TEvents>));

            return this;
        }
    },
    emit: {
        value(name: string, detail: any = {}, composed: boolean = false): CustomEvent
        {
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
        async value(event: string): Promise<any>
        {
            return Event.await(this, event);
        },
    },
});

Object.defineProperties(JSON, {
    tryParse: {
        value(str: string, ret: boolean = false): any|string
        {
            let out: any = str;

            try
            {
                out = JSON.parse(str);
            }
            catch(e)
            {
                if(ret === true)
                {
                    return null;
                }
            }

            return out;
        },
    },
});

Object.defineProperties(DocumentFragment, {
    fromString: {
        value(str: string)
        {
            return document.createRange().createContextualFragment(str);
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

const originalRemove = Node.prototype.remove;
Object.defineProperties(Node.prototype, {
    remove: {
        value(): void
        {
            Event.dispose(this);

            originalRemove.call(this);
        }
    },
});

Object.defineProperties(NodeList.prototype, {
    clear: {
        value<T extends NodeList>(this: T): T
        {
            for(const node of this)
            {
                node.remove();
            }

            return this;
        }
    },
});

Object.defineProperties(Element.prototype, {
    __index: {
        get(): number
        {
            return Number.parseInt(
                this.getAttribute('index')
                // ?? For.indices.get(this) // TODO(Chris Kruining) Find a better method of accessing the indices, core package should not access component package...
                ?? Array.from(this.parentNode.children).indexOf(this)
            );
        },
    },
});

Object.defineProperties(Promise.prototype, {
    stage: {
        async value<T>(this: Promise<T>, callback: (data: T) => any): Promise<T>
        {
            const data = await this;

            await callback(data);

            return data;
        },
    },
    delay: {
        value<T>(this: Promise<T>, milliseconds: number): Promise<T>
        {
            return this.then(data => new Promise(r => setTimeout(() => r(data), milliseconds)));
        },
    },
});
Object.defineProperties(Promise, {
    delay: {
        value(milliseconds: number): Promise<void>
        {
            return Promise.resolve().delay(milliseconds);
        },
    },
});

Object.defineProperties(NamedNodeMap.prototype, {
    toggle: {
        value(key: string): void
        {
            if(Array.from<Attr>(this).some(i => i.name === key))
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
        value(condition: boolean, name: string, value: any = ''): NamedNodeMap
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
});

Object.defineProperties(window, {
    AsyncFunction: {
        value: Object.getPrototypeOf(async function(){}).constructor,
    },
    range: {
        value: (s: number, e: number) => Array(e - s).fill(1).map((_, i: number) => s + i),
    },
});

export function clone<T extends object>(obj: T, root: T|null = null): T
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

        return copy as T;
    }

    if(root === null)
    {
        root = obj;
    }

    // Handle Array
    if(obj instanceof Array)
    {
        return obj.reduce((t, i) => {
            if(Object.is(i, root) === false)
            {
                t.push(clone(i));
            }

            return t;
        }, []);
    }

    // Handle Set
    if(obj instanceof Set)
    {
        return new Set(Array.from(obj).map(v => clone(v))) as T;
    }

    // Handle Object
    return Object.entries(obj).reduce((t: any, [ k, v ]) =>
    {
        if(!Object.is(v, root) && !k.startsWith('__'))
        {
            t[k] = clone(v, root);
        }

        return t;
    }, {});
}

export function equals<T>(a: T, b: T, references: WeakSet<any> = new WeakSet()): boolean
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
        if((a as Object).constructor.name !== (b as Object).constructor.name)
        {
            return false;
        }

        if(Object.getOwnPropertyNames(a).compare(Object.getOwnPropertyNames(b)) === false)
        {
            return false;
        }

        for(const p of Object.getOwnPropertyNames(a))
        {
            if(equals((a as any)[p], (b as any)[p], references) !== true)
            {
                return false;
            }
        }

        return true;
    }

    return a === b;
}