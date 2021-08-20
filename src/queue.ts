type QueueEvents<T> = {
    enqueued: T;
    dequeued: T;
    cleared: never;
};

export default class Queue<T> extends EventTarget implements CustomTarget<Queue<T>, QueueEvents<T>>, Iterable<T>
{
    events: QueueEvents<T> = {} as unknown as QueueEvents<T>;

    private _store: Array<T> = [];

    public enqueue(...items: Array<T>)
    {
        this._store.push(...items);

        this.emit('enqueued', items);
    }

    public dequeue(): T|undefined
    {
        const item = this._store.shift();

        this.emit('dequeued', item);

        return item;
    }

    public clear(): void
    {
        this._store.splice(0, this._store.length);

        this.emit('cleared');
    }

    public get [Symbol.toStringTag](): string
    {
        return `[\n\t${this._store.map((i: T, k: number) => `${k} :: ${JSON.stringify(i)}`).join('\n\t')}\n]`;
    }

    public *[Symbol.iterator](): Generator<T, void, undefined>
    {
        yield* this._store;
        this._store = [];
    }

    public get first(): T|undefined
    {
        return this._store.first;
    }

    public get last(): T|undefined
    {
        return this._store.last;
    }

    public get length(): number
    {
        return this._store.length;
    }
}