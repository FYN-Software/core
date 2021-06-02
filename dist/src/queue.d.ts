export default class Queue<T> extends EventTarget implements Iterable<T> {
    #private;
    constructor();
    enqueue(...items: Array<T>): void;
    dequeue(): T | undefined;
    clear(): void;
    get [Symbol.toStringTag](): string;
    [Symbol.iterator](): Generator<T, void, undefined>;
    get first(): T | undefined;
    get last(): T | undefined;
    get length(): number;
}
