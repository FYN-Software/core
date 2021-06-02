export default class Event {
    private static listeners;
    private static readonly defaultOptions;
    static debounce(delay: number, callback: (...args: Array<any>) => void): (this: any, ...args: Array<any>) => void;
    static throttle(delay: number, callback: (...args: Array<any>) => void): (this: any, ...args: Array<any>) => void;
    static delay(delay: number, callback: (...args: Array<any>) => void): (this: any, ...args: Array<any>) => void;
    static on<T extends Element, TEvents extends object>(target: T, settings: EventListenerConfig<T, TEvents>): void;
    static trigger(target: Element, name: string): void;
    static dispose(target: Element): void;
    static await<TReturn = any>(target: Element, event: string): Promise<TReturn>;
}
//# sourceMappingURL=event.d.ts.map