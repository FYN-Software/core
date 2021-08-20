import Event from './event.js';
import * as Functions from './functions.js';
export * from './functions.js';

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
    filterAsync: {
        enumerable: false,
        async value<T>(predicate: (toTest: T) => Promise<Boolean>): Promise<Array<T>>
        {
            return this.reduce(async (memo: Promise<T[]>, e: T) => await predicate(e) ? [...await memo, e] : memo, []);
        },
    },
    findAsync: {
        enumerable: false,
        async value<T>(predicate: (toTest: T) => Promise<Boolean>): Promise<T|undefined>
        {
            for(const item of this)
            {
                if(await predicate(item) === true)
                {
                    return item;
                }
            }
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
        value: Functions.arrayFromAsync,
        enumerable: false,
    },
});

if(typeof DOMRect !== 'undefined')
{
    Object.defineProperties(DOMRect.prototype, {
        contains: {
            value(x: number, y: number): boolean
            {
                return (x > this.left && x < this.right) && (y > this.top && y < this.bottom);
            },
        },
    });
}

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
            return Functions.clamp(this, lowerBound, upperBound);
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
    toPascalCase: {
        value(this: string): string
        {
            return this[0].toUpperCase() + this.slice(1).toCamelCase();
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
    replaceAllAsync: {
        async value(this: string, regex: RegExp, predicate: (...matches: Array<string>) => Promise<string>): Promise<string>
        {
            return Functions.replaceAllAsync(this, regex, predicate);
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

if(typeof DocumentFragment !== 'undefined')
{
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
}

if(typeof HTMLTemplateElement !== 'undefined')
{
    Object.defineProperties(HTMLTemplateElement.prototype, {
        innerHTML: {
            get()
            {
                const div = document.createElement('div');
                div.appendChild(this.content.cloneNode(true));

                return div.innerHTML;
            }
        },
    });
}

if(typeof Node !== 'undefined')
{
    const originalRemove = Node.prototype.remove;
    Object.defineProperties(Node.prototype, {
        childOf: {
            value(parent: Node)
            {
                let el = this.ownerElement ?? this.parentNode;

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
        remove: {
            value(): void
            {
                Event.dispose(this);

                originalRemove.call(this);
            }
        },
    });
}

if(typeof DOMRect !== 'undefined')
{
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
}

if(typeof DOMRect !== 'undefined')
{
    Object.defineProperties(Element.prototype, {
        pathToRoot: {
            get()
            {
                const stack = [ this ];
                let entry = this;

                while(entry.localName !== 'html')
                {
                    entry = entry.parentElement;

                    stack.push(entry);
                }

                return stack;
            }
        },
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
}

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

if(typeof DOMRect !== 'undefined')
{
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
}

if(typeof DOMRect !== 'undefined')
{
    Object.defineProperties(window, {
        AsyncFunction: {
            value: Object.getPrototypeOf(async function(){}).constructor,
        },
        range: {
            value: (s: number, e: number) => Array(e - s).fill(1).map((_, i: number) => s + i),
        },
    });
}