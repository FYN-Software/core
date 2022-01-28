export default class Queue extends EventTarget {
    #store = [];
    enqueue(...items) {
        this.#store.push(...items);
        this.emit('enqueued', items);
    }
    dequeue() {
        const item = this.#store.shift();
        this.emit('dequeued', item);
        return item;
    }
    clear() {
        this.#store = [];
        this.emit('cleared');
    }
    get [Symbol.toStringTag]() {
        return `[\n\t${this.#store.map((i, k) => `${k} :: ${JSON.stringify(i)}`).join('\n\t')}\n]`;
    }
    *[Symbol.iterator]() {
        yield* this.#store;
        this.#store = [];
    }
    get first() {
        return this.#store[0];
    }
    get last() {
        return this.#store[this.#store.length - 1];
    }
    get length() {
        return this.#store.length;
    }
}
//# sourceMappingURL=queue.js.map