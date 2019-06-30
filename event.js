const eventMap = new WeakMap();

export default class Event
{
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
            ...{ capture: false, passive: false, details: false },
            ...options,
        };

        for(const [keys, callback] of Object.entries(events))
        {
            for(const event of keys.split(/\|/g))
            {
                if(eventMap.has(target))
                {
                    const listeners = eventMap.get(target);

                    if(listeners.has(event) === false)
                    {
                        listeners.set(event, new Set());
                    }

                    eventMap.get(target).get(event).add(callback);
                }
                else
                {
                    eventMap.set(target, new Map([ [event, new Set([ callback ])] ]));
                }

                target.addEventListener(
                    event,
                    e => {
                        if(options.details === true)
                        {
                            callback(e.detail, e, target);
                        }
                        else
                        {
                            callback.call(target, e, target)
                        }
                    },
                    options
                );
            }
        }
    }

    static delegate(target, selector, settings)
    {
        for(let [ e, c ] of Object.entries(settings))
        {
            if(e === 'options')
            {
                continue;
            }

            settings[e] = e => {
                const t = Array.from(target.querySelectorAll(selector)).find(el => e.composedPath().includes(el));

                if(t === undefined)
                {
                    return;
                }

                c.call(t, e, t);
            };
        }

        Event.on(document.body, settings);
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
