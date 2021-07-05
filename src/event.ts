export default class Event
{
    private static listeners: WeakMap<Element, Map<string, Map<string, Set<(...args: Array<any>) => any>>>> = new WeakMap();
    private static readonly defaultOptions: Options = { capture: false, once: false, passive: true, signal: undefined, details: true, selector: null };

    public static debounce(delay: number, callback: (...args: Array<any>) => void)
    {
        let timeout: any;

        return function(this: any, ...args: Array<any>)
        {
            clearTimeout(timeout);
            timeout = setTimeout(() =>
            {
                timeout = undefined;

                callback.apply(this, args);
            }, delay);
        };
    }

    public static throttle(delay: number, callback: (...args: Array<any>) => void)
    {
        let timeout: any;

        return function(this: any, ...args: Array<any>)
        {
            if(timeout === null)
            {
                callback.apply(this, args);

                timeout = setTimeout(() =>
                {
                    timeout = undefined;
                }, delay);
            }
        };
    }

    public static delay(delay: number, callback: (...args: Array<any>) => void)
    {
        return function(this: any, ...args: Array<any>)
        {
            setTimeout(() => callback.apply(this, args), delay);
        };
    }

    public static on<T extends Element, TEvents extends object>(target: T, settings: EventListenerConfig<T, TEvents>)
    {
        let { options = {}, ...events } = settings;

        options = {
            ...Event.defaultOptions,
            ...options,
        };

        const once = options.once;
        delete options.once;

        const hash = JSON.stringify(options);

        if(this.listeners.has(target) === false)
        {
            this.listeners.set(target, new Map);
        }

        if(this.listeners.get(target)!.has(hash) === false)
        {
            this.listeners.get(target)!.set(hash, new Map);
        }

        const listeners = this.listeners.get(target)!.get(hash)!;

        for(const [keys, callback] of Object.entries(events))
        {
            for(const event of keys.split(/\|/g))
            {
                if(listeners.has(event) === false)
                {
                    listeners.set(event, new Set);

                    const listener = (e: any) => {
                            const element = options.selector === null
                                ? target
                                : Array.from(target.querySelectorAll(options.selector!))
                                    .find(el => e.composedPath().includes(el));

                            if(element === undefined)
                            {
                                return;
                            }

                            const value: any = options.details === true && e instanceof CustomEvent
                                ? e.detail
                                : e;

                            const listeners = this.listeners.get(target)!.get(hash)!.get(event)!;

                            for(const callback of listeners)
                            {
                                if(once)
                                {
                                    listeners.delete(callback);
                                }

                                callback(value, element, e);
                            }
                        };

                    target.addEventListener(event, listener, options);
                }

                this.listeners.get(target)!.get(hash)!.get(event)!.add(callback);
            }
        }
    }

    public static trigger(target: Element, name: string): void
    {
        let event = document.createEvent('HTMLEvents');
        event.initEvent(name, false, true);

        target.dispatchEvent(event);
    }

    public static dispose(target: Element): void
    {
        const events: Map<string, Set<Listener<Element>>> = this.listeners.get(target) ?? new Map();

        for(const [ event, listeners ] of events)
        {
            for(const listener of listeners)
            {
                target.removeEventListener(event, listener as any);

                listeners.delete(listener);
            }

            events.delete(event);
        }

        for(const child of target.children)
        {
            this.dispose(child);
        }
    }

    public static async await<TReturn = any>(target: Element, event: string): Promise<TReturn>
    {
        return Promise.race(
            event.split('|').map((e: string) => new Promise<TReturn>(r => {
                target.on({
                    options: {
                        once: true,
                        details: true,
                    },
                    [e]: (d: TReturn) => r(d),
                })
            }))
        );
    }
}
