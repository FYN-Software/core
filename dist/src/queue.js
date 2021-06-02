var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _store;
export default class Queue extends EventTarget {
    constructor() {
        super();
        _store.set(this, []);
    }
    enqueue(...items) {
        __classPrivateFieldGet(this, _store).push(...items);
        this.emit('enqueued', items);
    }
    dequeue() {
        const item = __classPrivateFieldGet(this, _store).shift();
        this.emit('dequeued', item);
        return item;
    }
    clear() {
        __classPrivateFieldGet(this, _store).splice(0, __classPrivateFieldGet(this, _store).length);
        this.emit('cleared');
    }
    get [(_store = new WeakMap(), Symbol.toStringTag)]() {
        return `[\n\t${__classPrivateFieldGet(this, _store).map((i, k) => `${k} :: ${JSON.stringify(i)}`).join('\n\t')}\n]`;
    }
    *[Symbol.iterator]() {
        yield* __classPrivateFieldGet(this, _store);
        __classPrivateFieldSet(this, _store, []);
    }
    get first() {
        return __classPrivateFieldGet(this, _store).first;
    }
    get last() {
        return __classPrivateFieldGet(this, _store).last;
    }
    get length() {
        return __classPrivateFieldGet(this, _store).length;
    }
}
