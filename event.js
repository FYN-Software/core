const eventMap = new WeakMap();

export default class Event
{
    static #listeners = new WeakMap();

    static debounce(delay, callback)
    {
        let timeout;

        return function(...args)
        {
            clearTimeout(timeout);
            timeout = setTimeout(() =>
            {
                timeout = null;

                callback.apply(this, args);
            }, delay);
        };
    }

    static throttle(delay, callback)
    {
        let timeout = null;

        return function(...args)
        {
            if(timeout === null)
            {
                callback.apply(this, args);

                timeout = setTimeout(() =>
                {
                    timeout = null;
                }, delay);
            }
        };
    }

    static delay(delay, callback)
    {
        return function(...args)
        {
            setTimeout(() => callback.apply(this, args), delay);
        };
    }

    static on(target, settings)
    {
        let { options = {}, ...events } = settings;

        options = {
            ...{ capture: false, passive: true, details: true, selector: null, once: false, useCapture: false },
            ...options,
        };
        const once = options.once;
        delete options.once;

        const useCapture = options.useCapture;
        delete options.useCapture;

        const hash = JSON.stringify(options);

        if(this.#listeners.has(target) === false)
        {
            this.#listeners.set(target, new Map());
        }

        if(this.#listeners.get(target).has(hash) === false)
        {
            this.#listeners.get(target).set(hash, new Map());
        }

        const listeners = this.#listeners.get(target).get(hash);

        for(const [keys, callback] of Object.entries(events))
        {
            for(const event of keys.split(/\|/g))
            {
                if(listeners.has(event) === false)
                {
                    listeners.set(event, new Set());

                    target.addEventListener(
                        event,
                        e => {
                            const element = options.selector === null
                                ? target
                                : Array.from(target.querySelectorAll(options.selector))
                                    .find(el => e.composedPath().includes(el));

                            if(element === undefined)
                            {
                                return;
                            }

                            const value = options.details === true && e instanceof CustomEvent
                                ? e.detail
                                : e;

                            for(const callback of this.#listeners.get(target).get(hash).get(e.type))
                            {
                                if(once)
                                {
                                    this.#listeners.get(target).get(hash).get(e.type).delete(callback);
                                }

                                callback(value, element, e);
                            }
                        },
                        options,
                        useCapture
                    );
                }

                this.#listeners.get(target).get(hash).get(event).add(callback);
            }
        }
    }

    static trigger(target, name)
    {
        let event = document.createEvent('HTMLEvents');
        event.initEvent(name, false, true);

        target.dispatchEvent(event);
    }

    static dispose(target)
    {
        const events = eventMap.get(target) || new Map();

        for(const [ event, listeners ] of events)
        {
            for(const listener of listeners)
            {
                target.removeEventListener(event, listener);

                listeners.delete(listener);
            }

            events.delete(event);
        }

        for(const child of target.children)
        {
            this.dispose(child);
        }
    }

    static async await(target, event)
    {
        return Promise.race(event.split('|').map(e => new Promise(r => {
            target.on({
                options: {
                    once: true,
                    details: true,
                },
                [e]: d => r(d),
            })
        })));
    }
}
