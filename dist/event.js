const listenerStore = new WeakMap();
const defaultOptions = { capture: false, once: false, passive: true, signal: undefined, details: true, selector: null };
export function dispatch(target, name, init, refs = new WeakSet()) {
    const event = new CustomEvent(name, init);
    if (refs.has(target) === false) {
        target.dispatchEvent(event);
        refs.add(target);
        if (event.defaultPrevented === false && event.bubbles === true) {
            for (const parentRef of target.parents ?? []) {
                const parent = parentRef.deref();
                if (parent === undefined) {
                    target.parents.delete(parentRef);
                    continue;
                }
                dispatch(parent, name, init, refs);
            }
        }
    }
    return event;
}
export function debounce(delay, callback) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = undefined;
            callback.apply(this, args);
        }, delay);
    };
}
export function throttle(delay, callback) {
    let timeout;
    return function (...args) {
        if (timeout === null) {
            callback.apply(this, args);
            timeout = setTimeout(() => {
                timeout = undefined;
            }, delay);
        }
    };
}
export function delay(delay, callback) {
    return function (...args) {
        setTimeout(() => callback.apply(this, args), delay);
    };
}
export function on(target, settings) {
    let { options = {}, ...events } = settings;
    options = {
        ...defaultOptions,
        ...options,
    };
    const once = options.once;
    delete options.once;
    const hash = JSON.stringify(options);
    if (listenerStore.has(target) === false) {
        listenerStore.set(target, new Map);
    }
    if (listenerStore.get(target).has(hash) === false) {
        listenerStore.get(target).set(hash, new Map);
    }
    const listeners = listenerStore.get(target).get(hash);
    for (const [keys, callback] of Object.entries(events)) {
        for (const event of keys.split(/\|/g)) {
            if (listeners.has(event) === false) {
                listeners.set(event, new Set);
                const listener = (e) => {
                    const element = options.selector === null
                        ? target
                        : Array.from(target.querySelectorAll(options.selector))
                            .find(el => e.composedPath().includes(el));
                    if (element === undefined) {
                        return;
                    }
                    const value = options.details === true && e instanceof CustomEvent
                        ? e.detail
                        : e;
                    const listeners = listenerStore.get(target).get(hash).get(event);
                    for (const callback of listeners) {
                        if (once) {
                            listeners.delete(callback);
                        }
                        callback(value, element, e);
                    }
                };
                target.addEventListener(event, listener, options);
            }
            listenerStore.get(target).get(hash).get(event).add(callback);
        }
    }
}
export function trigger(target, name) {
    let event = document.createEvent('HTMLEvents');
    event.initEvent(name, false, true);
    target.dispatchEvent(event);
}
export function dispose(target) {
    const events = listenerStore.get(target) ?? new Map();
    for (const [event, listeners] of events) {
        for (const listener of listeners) {
            target.removeEventListener(event, listener);
            listeners.delete(listener);
        }
        events.delete(event);
    }
    for (const child of target.children) {
        dispose(child);
    }
}
export async function waitFor(target, event) {
    return Promise.race(event.split('|').map((e) => new Promise(r => {
        on(target, {
            options: {
                once: true,
                details: true,
            },
            [e]: (d) => r(d),
        });
    })));
}
export async function* asAsyncIterable(target, event, signal) {
    let resolve;
    on(target, {
        options: {
            details: true,
        },
        [event]: (d) => resolve(d),
    });
    do {
        yield await new Promise((res, rej) => {
            waitFor(signal, 'abort').then(() => rej('aborted'));
            resolve = res;
        });
    } while (signal.aborted === false);
}
//# sourceMappingURL=event.js.map