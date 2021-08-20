declare type QueueEvents<T> = {
    enqueued: T;
    dequeued: T;
    cleared: never;
};
export default class Queue<T> extends EventTarget implements CustomTarget<Queue<T>, QueueEvents<T>>, Iterable<T> {
    events: QueueEvents<T>;
    private _store;
    enqueue(...items: Array<T>): void;
    dequeue(): T | undefined;
    clear(): void;
    get [Symbol.toStringTag](): string;
    [Symbol.iterator](): Generator<T, void, undefined>;
    get first(): T | undefined;
    get last(): T | undefined;
    get length(): number;
}
export {};
//# sourceMappingURL=queue.d.ts.map