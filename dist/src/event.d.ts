export default class Event {
    private static listeners;
    static debounce(delay: number, callback: (...args: Array<any>) => void): (this: any, ...args: Array<any>) => void;
    static throttle(delay: number, callback: (...args: Array<any>) => void): (this: any, ...args: Array<any>) => void;
    static delay(delay: number, callback: (...args: Array<any>) => void): (this: any, ...args: Array<any>) => void;
    static on(target: Element, settings: EventListenerConfig): void;
    static trigger(target: Element, name: string): void;
    static dispose(target: Element): void;
    static await(target: Element, event: string): Promise<any>;
}
