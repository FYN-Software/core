type QueueEvents<T> = {
    enqueued: T;
    dequeued: T;
    cleared: never;
};

export default class Queue<T> extends EventTarget implements CustomTarget<Queue<T>, QueueEvents<T>>, Iterable<T>
{
    #store: Array<T> = [];

    public enqueue(...items: Array<T>)
    {
        this.#store.push(...items);

        this.emit('enqueued', items);
    }

    public dequeue(): T|undefined
    {
        const item = this.#store.shift();

        this.emit('dequeued', item);

        return item;
    }

    public clear(): void
    {
        this.#store = [];

        this.emit('cleared');
    }

    public get [Symbol.toStringTag](): string
    {
        return `[\n\t${this.#store.map((i: T, k: number) => `${k} :: ${JSON.stringify(i)}`).join('\n\t')}\n]`;
    }

    public *[Symbol.iterator](): Generator<T, void, undefined>
    {
        yield* this.#store;
        this.#store = [];
    }

    public get first(): T|undefined
    {
        return this.#store[0];
    }

    public get last(): T|undefined
    {
        return this.#store[this.#store.length - 1];
    }

    public get length(): number
    {
        return this.#store.length;
    }
}