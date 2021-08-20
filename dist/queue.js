export default class Queue extends EventTarget {
    events = {};
    _store = [];
    enqueue(...items) {
        this._store.push(...items);
        this.emit('enqueued', items);
    }
    dequeue() {
        const item = this._store.shift();
        this.emit('dequeued', item);
        return item;
    }
    clear() {
        this._store.splice(0, this._store.length);
        this.emit('cleared');
    }
    get [Symbol.toStringTag]() {
        return `[\n\t${this._store.map((i, k) => `${k} :: ${JSON.stringify(i)}`).join('\n\t')}\n]`;
    }
    *[Symbol.iterator]() {
        yield* this._store;
        this._store = [];
    }
    get first() {
        return this._store.first;
    }
    get last() {
        return this._store.last;
    }
    get length() {
        return this._store.length;
    }
}
//# sourceMappingURL=queue.js.map