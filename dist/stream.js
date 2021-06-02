export default class Stream {
    constructor(source) {
        this._transformers = [];
        this._source = source;
    }
    pipe(transformer, ...args) {
        this._transformers.push({ transformer, args });
        return this;
    }
    async *[Symbol.asyncIterator]() {
        yield* this._transformers.reduce((stream, { transformer, args }) => transformer(stream, ...args), this._source);
    }
    static from(source) {
        if ((Symbol.asyncIterator in source) === false) {
            source = (async function* () { yield await source; })();
        }
        return new this(source);
    }
}
//# sourceMappingURL=stream.js.map