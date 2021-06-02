export default class QueuedPromise implements IQueuedPromise
{
    private readonly promise: Promise<any>;
    private readonly queue: QueueItem[] = [];
    private readonly proxy: any;

    public constructor(promise: Promise<any>)
    {
        this.promise = promise;

        this.proxy = new Proxy(() => {}, {
            get: (c: () => void, p: string) => {
                if(p === 'then')
                {
                    const p = this.promise.then(v => this.settle(v));

                    return p.then.bind(p);
                }

                if(p in this.promise)
                {
                    return this.promise[p as keyof Promise<any>].bind(this.promise);
                }

                this.queue.push({ property: p, args: [] });

                return this.proxy;
            },
            apply: (t: () => void, c: () => void, a: any[]) => {
                this.queue.last!.args = a;

                return this.proxy;
            },
            getPrototypeOf: () => QueuedPromise.prototype,
        });

        return this.proxy;
    }

    public async settle(value: any): Promise<any>
    {
        return this.queue.reduce(
            async (t: Promise<any>, q: QueueItem) => {
                if(t === null || t === undefined)
                {
                    return undefined;
                }

                return this.resolve(await t, q);
            },
            value
        );
    }

    public async resolve(item: any, { property, args }: QueueItem): Promise<any>
    {
        let r: any = await item[property];

        if(typeof r === 'function')
        {
            r = await r.apply(item, args);
        }

        return r;
    }
}