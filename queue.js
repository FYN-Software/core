const store = Symbol('store');

export default class Queue extends EventTarget
{
    #store = [];

    constructor()
    {
        super();
    }

    enqueue(...items)
    {
        this.#store.push(...items);

        this.emit('enqueued', items);
    }

    dequeue()
    {
        const item = this.#store.shift();

        this.emit('dequeued', item);

        return item;
    }

    clear()
    {
        this.#store.clear();

        this.emit('cleared');
    }

    get [Symbol.toStringTag]()
    {
        return `[\n\t${this.#store.map((i, k) => `${k} :: ${JSON.stringify(i)}`).join('\n\t')}\n]`;
    }

    *[Symbol.iterator]()
    {
        while(this.length > 0)
        {
            yield this.dequeue();
        }
    }

    get first()
    {
        return this.#store.first;
    }

    get last()
    {
        return this.#store.last;
    }

    get length()
    {
        return this.#store.length;
    }
}