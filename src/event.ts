
const listenerStore: WeakMap<Element, Map<string, Map<string, Set<(...args: Array<any>) => any>>>> = new WeakMap();
const defaultOptions: Options = { capture: false, once: false, passive: true, signal: undefined, details: true, selector: null };

export function dispatch<T>(target: EventTarget, name: string, init: CustomEventInit<T>, refs: WeakSet<EventTarget> = new WeakSet()): CustomEvent<T>
{
    const event = new CustomEvent(name, init);

    if(refs.has(target) === false)
    {
        target.dispatchEvent(event);

        refs.add(target);

        if(event.defaultPrevented === false && event.bubbles === true)
        {
            for(const parentRef of target.parents ?? [])
            {
                const parent = parentRef.deref();

                if(parent === undefined)
                {
                    target.parents!.delete(parentRef);

                    continue;
                }

                dispatch(parent, name, init, refs);
            }
        }
    }

    return event;
}

type Callback = (...args: Array<any>) => any;

export function debounce<T extends Callback>(delay: number, callback: T): T
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
    } as T;
}

export function throttle<T extends Callback>(delay: number, callback: T): T
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
    } as T;
}

export function delay<T extends Callback>(delay: number, callback: T): T
{
    return function(this: any, ...args: Array<any>)
    {
        setTimeout(() => callback.apply(this, args), delay);
    } as T;
}

export function on<T extends Element, TEvents extends object>(target: T, settings: EventListenerConfig<T, TEvents>)
{
    let { options = {}, ...events } = settings;

    options = {
        ...defaultOptions,
        ...options,
    };

    const once = options.once;
    delete options.once;

    const hash = JSON.stringify(options);

    if(listenerStore.has(target) === false)
    {
        listenerStore.set(target, new Map);
    }

    if(listenerStore.get(target)!.has(hash) === false)
    {
        listenerStore.get(target)!.set(hash, new Map);
    }

    const listeners = listenerStore.get(target)!.get(hash)!;

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

                    const listeners = listenerStore.get(target)!.get(hash)!.get(event)!;

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

            listenerStore.get(target)!.get(hash)!.get(event)!.add(callback);
        }
    }
}

export function trigger(target: Element, name: string): void
{
    let event = document.createEvent('HTMLEvents');
    event.initEvent(name, false, true);

    target.dispatchEvent(event);
}

export function dispose(target: Element): void
{
    const events: Map<string, Set<Listener<Element>>> = listenerStore.get(target) ?? new Map();

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
        dispose(child);
    }
}

export async function waitFor<TReturn = any>(target: Element, event: string): Promise<TReturn>
{
    return Promise.race(
        event.split('|').map((e: string) => new Promise<TReturn>(r => {
            on(target, {
                options: {
                    once: true,
                    details: true,
                },
                [e]: (d: TReturn) => r(d),
            })
        }))
    );
}

export async function *asAsyncIterable<TReturn = any>(target: Element, event: string, signal: AbortSignal): AsyncGenerator<TReturn, void, void>
{
    let resolve: (d: TReturn) => void;

    on(target, {
        options: {
            details: true,
        },
        [event]: (d: TReturn) => resolve(d),
    })

    do
    {
        yield await new Promise((res, rej) => {
            waitFor(signal as any, 'abort').then(() => rej('aborted'))

            resolve = res;
        });
    }
    while (signal.aborted === false);
}