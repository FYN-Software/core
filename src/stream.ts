type Transformer<TIn, TOut> = (stream: AsyncGenerator<TIn, void, void>, ...args: Array<any>) => AsyncGenerator<TOut, void, void>;

export default class Stream<TIn> implements AsyncIterable<TIn>
{
    private readonly _source: AsyncGenerator<TIn, void, void>
    private readonly _transformers: Array<{ transformer: Transformer<any, any>, args: Array<any> }> = [];

    private constructor(source: AsyncGenerator<TIn, void, void>)
    {
        this._source = source;
    }

    public pipe<TOut>(transformer: Transformer<TIn, TOut>, ...args: Array<any>): Stream<TOut>
    {
        this._transformers.push({ transformer, args });

        return this as unknown as Stream<TOut>;
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<TIn, void, void>
    {
        yield* this._transformers.reduce(
            (stream: AsyncGenerator<any, void, void>, { transformer, args }) => transformer(stream, ...args),
            this._source
        );
    }

    public static from<TIn>(source: AsyncGenerator<TIn, void, void>|TIn): Stream<TIn>
    {
        if((Symbol.asyncIterator in source) === false)
        {
            source = (async function*() { yield await source as TIn; })();
        }

        return new this(source as AsyncGenerator<TIn, void, void>);
    }
}