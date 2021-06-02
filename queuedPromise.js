export default class QueuedPromise
{
    #promise;
    #queue = [];
    #proxy;
    #debug = false;

    constructor(promise)
    {
        this.#promise = promise;

        this.#proxy = new Proxy(() => {}, {
            get: (c, p) => {
                if(p === 'debug')
                {
                    this.#debug = true;

                    return this.#proxy;
                }

                if(p === 'then')
                {
                    const p = this.#promise.then(v => this.settle(v));

                    return p.then.bind(p);
                }

                if(p in this.#promise)
                {
                    return this.#promise[p].bind(this.#promise);
                }

                this.#queue.push({ property: p, args: [] });

                return this.#proxy;
            },
            apply: (t, c, a) => {
                this.#queue.last.args = a;

                return this.#proxy;
            },
            getPrototypeOf: () => QueuedPromise.prototype,
        });

        return this.#proxy;
    }

    async settle(value)
    {
        return this.#queue.reduce(
            async (t, q) => {
                if(t === null || t === undefined)
                {
                    return undefined;
                }

                return await this.resolve(await t, q);
            },
            value
        );
    }

    async resolve(item, { property, args })
    {
        let r = await item[property];

        if(typeof r === 'function')
        {
            r = await r.apply(item, args);
        }

        return r;
    }
}
