export function unique<T>(array: Array<T>): Array<T>
{
    return [ ...(new Set<T>(array)) ];
}

type sumPredicate<T> = (i: T) => number;
const defaultSumPredicate = <T>(i: T) => (i as unknown as number);
export function sum<T = number>(array: Array<T>, predicate: sumPredicate<T> = defaultSumPredicate): number
{
    return array.reduce<number>((t: number, i: T) => t + predicate(i), 0);
}

export function shuffle<T>(array: Array<T>): Array<T>
{
    return array.filter((v: T, i: number, a: Array<T>) => a.indexOf(v) === i);
}

export async function mapAsync<TIn, TOut>(array: Array<TIn>, callback: (item: TIn) => Promise<TOut>): Promise<Array<TOut>>
{
    return Promise.all(array.map(a => callback(a)));
}

export async function filterAsync<T>(array: Array<T>, predicate: (toTest: T) => Promise<Boolean>): Promise<Array<T>>
{
    return array.reduce<Promise<Array<T>>>(
        async (memo: Promise<Array<T>>, e: T) => await predicate(e) ? [...(await memo), e] : memo,
        Promise.resolve([])
    );
}

export async function findAsync<T>(array: Array<T>, predicate: (toTest: T) => Promise<Boolean>): Promise<T|undefined>
{
    for(const item of array)
    {
        if(await predicate(item) === true)
        {
            return item;
        }
    }

    return;
}

export async function fromAsync<TIn, TOut = TIn>(iterable: AsyncIterable<TIn>|Iterable<TIn>, map: (i: TIn) => TOut = i => i as any): Promise<Array<TOut>>
{
    const result = [];

    for await (const item of iterable)
    {
        result.push(await map(item));
    }

    return result;
}