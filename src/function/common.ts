export type Properties<T extends Object> = { [K in keyof T]: TypedPropertyDescriptor<T[K]> };

Array.__observerLimit__ = Array;
String.__observerLimit__ = String;
Number.__observerLimit__ = Number;

export function getPropertiesOf<T extends Object>(subject: T): Properties<T>
{
    const limit = subject.constructor.__observerLimit__;
    let props: Partial<Properties<T>> = {};

    do
    {
        props = {
            ...Object.getOwnPropertyDescriptors(subject),
            ...props,
        };
        subject = Object.getPrototypeOf(subject);
    }
    while (subject !== null && subject.constructor !== limit && subject.constructor !== Object);

    return props as Properties<T>;
}

export function clone<T extends object>(obj: T, root: T|null = null): T
{
    if(obj === null || typeof obj !== 'object')
    {
        return obj;
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
    }, Object.create(Object.getPrototypeOf(obj)));
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

    if(typeof b === 'object' && b !== undefined && b !== null)
    {
        if (references.has(b))
        {
            return true;
        }

        references.add(b);
    }

    if(typeof a !== typeof b)
    {
        return false;
    }

    if(a === null || a === undefined|| typeof a !== 'object' || b === null || b === undefined || typeof b !== 'object')
    {
        return a === b;
    }

    // Handle Array
    if(a instanceof Array && b instanceof Array)
    {
        if(a.length !== b.length)
        {
            return false;
        }

        for(let i = 0; i < a.length; i++)
        {
            if(equals(a[i], b[i], references) !== true)
            {
                return false;
            }
        }

        return true;
    }

    // Handle Object
    if(a instanceof Object && b instanceof Object)
    {
        if((a as Object).constructor.name !== (b as Object).constructor.name)
        {
            return false;
        }

        if(equals(Object.getOwnPropertyNames(a), Object.getOwnPropertyNames(b), references) === false)
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

type Pattern<TIn, TResult> = TResult&{ is(value: TIn, resultResolver: () => TResult): Pattern<TIn, TResult>}

export function when<TIn, TResult>(value: TIn): Pattern<TIn, TResult>
{
    const queue: Map<TIn, () => TResult> = new Map;
    const resolve = (): TResult|undefined => {
        for(const [ v, r ] of queue.entries())
        {
            if(v === value)
            {
                return r();
            }
        }

        return undefined
    };
    const unwrap = (c: any, p: string|symbol) => typeof c[p] === 'function' ? c[p].bind(c) : c[p];

    const proxy = new Proxy({}, {
        get: (_: {}, p: string|symbol) => {
            if(p === 'is')
            {
                return (value: TIn, resultResolver: () => TResult) => {
                    queue.set(value, resultResolver);

                    return proxy;
                };
            }

            if(p === 'then')
            {
                for(const [ v, r ] of queue.entries())
                {
                    if(v === value)
                    {
                        const promise = Promise.resolve(r())

                        return promise.then.bind(promise);
                    }
                }
            }

            return unwrap(resolve(), p);
        },
    }) as Pattern<TIn, TResult>;

    return proxy;
}