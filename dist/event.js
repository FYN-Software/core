export default class Event {
    static listeners = new WeakMap();
    static defaultOptions = { capture: false, once: false, passive: true, signal: undefined, details: true, selector: null };
    static debounce(delay, callback) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = undefined;
                callback.apply(this, args);
            }, delay);
        };
    }
    static throttle(delay, callback) {
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
    static delay(delay, callback) {
        return function (...args) {
            setTimeout(() => callback.apply(this, args), delay);
        };
    }
    static on(target, settings) {
        let { options = {}, ...events } = settings;
        options = {
            ...Event.defaultOptions,
            ...options,
        };
        const once = options.once;
        delete options.once;
        const hash = JSON.stringify(options);
        if (this.listeners.has(target) === false) {
            this.listeners.set(target, new Map);
        }
        if (this.listeners.get(target).has(hash) === false) {
            this.listeners.get(target).set(hash, new Map);
        }
        const listeners = this.listeners.get(target).get(hash);
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
                        const listeners = this.listeners.get(target).get(hash).get(event);
                        for (const callback of listeners) {
                            if (once) {
                                listeners.delete(callback);
                            }
                            callback(value, element, e);
                        }
                    };
                    target.addEventListener(event, listener, options);
                }
                this.listeners.get(target).get(hash).get(event).add(callback);
            }
        }
    }
    static trigger(target, name) {
        let event = document.createEvent('HTMLEvents');
        event.initEvent(name, false, true);
        target.dispatchEvent(event);
    }
    static dispose(target) {
        const events = this.listeners.get(target) ?? new Map();
        for (const [event, listeners] of events) {
            for (const listener of listeners) {
                target.removeEventListener(event, listener);
                listeners.delete(listener);
            }
            events.delete(event);
        }
        for (const child of target.children) {
            this.dispose(child);
        }
    }
    static async await(target, event) {
        return Promise.race(event.split('|').map((e) => new Promise(r => {
            target.on({
                options: {
                    once: true,
                    details: true,
                },
                [e]: (d) => r(d),
            });
        })));
    }
}
//# sourceMappingURL=event.js.map