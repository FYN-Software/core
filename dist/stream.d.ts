declare type Transformer<TIn, TOut> = (stream: AsyncGenerator<TIn, void, void>, ...args: Array<any>) => AsyncGenerator<TOut, void, void>;
export default class Stream<TIn> implements AsyncIterable<TIn> {
    private readonly _source;
    private readonly _transformers;
    private constructor();
    pipe<TOut>(transformer: Transformer<TIn, TOut>, ...args: Array<any>): Stream<TOut>;
    [Symbol.asyncIterator](): AsyncGenerator<TIn, void, void>;
    static from<TIn>(source: AsyncGenerator<TIn, void, void> | TIn): Stream<TIn>;
}
export {};
//# sourceMappingURL=stream.d.ts.map