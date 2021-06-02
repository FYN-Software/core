export default class QueuedPromise implements IQueuedPromise {
    private readonly promise;
    private readonly queue;
    private readonly proxy;
    constructor(promise: Promise<any>);
    settle(value: any): Promise<any>;
    resolve(item: any, { property, args }: QueueItem): Promise<any>;
}
//# sourceMappingURL=queuedPromise.d.ts.map