export async function arrayFromAsync<TIn, TOut>(iterable: AsyncIterable<TIn>|Iterable<TIn>, map: (i: TIn) => TOut = i => i as any): Promise<Array<TOut>>
{
    const result = [];

    for await (const item of iterable)
    {
        result.push(await map(item));
    }

    return result;
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