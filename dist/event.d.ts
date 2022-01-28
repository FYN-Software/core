export declare function dispatch<T>(target: EventTarget, name: string, init: CustomEventInit<T>, refs?: WeakSet<EventTarget>): CustomEvent<T>;
declare type Callback = (...args: Array<any>) => any;
export declare function debounce<T extends Callback>(delay: number, callback: T): T;
export declare function throttle<T extends Callback>(delay: number, callback: T): T;
export declare function delay<T extends Callback>(delay: number, callback: T): T;
export declare function on<T extends Element, TEvents extends object>(target: T, settings: EventListenerConfig<T, TEvents>): void;
export declare function trigger(target: Element, name: string): void;
export declare function dispose(target: Element): void;
export declare function waitFor<TReturn = any>(target: Element, event: string): Promise<TReturn>;
export declare function asAsyncIterable<TReturn = any>(target: Element, event: string, signal: AbortSignal): AsyncGenerator<TReturn, void, void>;
export {};
//# sourceMappingURL=event.d.ts.map