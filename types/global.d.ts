// TODO(Chris Kruining) Remove these hacked polyfills when the CSS-OM finally releases
interface CSSStyleValue
{
    readonly value: any;
    readonly unit: any;
}

interface StylePropertyMapReadOnly extends Omit<Map<string, CSSStyleValue>, 'set'>
{
    getAll(): Array<CSSStyleValue>;
}
// TODO(Chris Kruining) ==============================================================

interface Function
{
    __observerLimit__?: Function;
}

interface Document
{
    getElementById<T extends Element>(id: string): T;
}

interface Element
{
    addEventListener<K extends keyof ElementEventMap>(type: K, listener: (this: Element, ev: ElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions, useCapture?: boolean): void;

    computedStyleMap(): StylePropertyMapReadOnly;
}

interface HTMLElement
{
    attachInternals(): ElementInternals;
}

interface DocumentOrShadowRoot
{
    adoptedStyleSheets: Array<CSSStyleSheet>
}

interface CSSStyleSheet
{
    replace(text: string): Promise<void>;
}

declare interface String
{
    replaceAll(regex: RegExp, callback: (...matches: Array<string>) => string): string
    replaceAll(regex: RegExp, replacement: string): string
}

type Options = Partial<{
    capture: boolean,
    passive: boolean,
    details: boolean,
    signal: AbortSignal,
    selector: string|null,
    once: boolean,
    useCapture: boolean
}>;

// NOTE(Chris Kruining) The `any` return type is explicit, do NOT change
type BuiltInListener<T extends EventTarget, Key extends keyof HTMLElementEventMap> = (event: HTMLElementEventMap[Key], target: T) => any;
type Listener<T extends EventTarget, TDetails = any> = (details: TDetails, target: T, event: CustomEvent<TDetails>) => any;

type FilteredEventMap<TEvents extends EventDefinition> = keyof Omit<HTMLElementEventMap, keyof TEvents|'options'>;

type EventListenerConfig<T extends EventTarget, TEvents extends EventDefinition> = {
    options?: Options;
    [key: string]: Listener<T>|Options|undefined;
} & {
    [Key in FilteredEventMap<TEvents>]?: BuiltInListener<T, Key>;
} & {
    [Key in keyof Omit<TEvents, 'options'>]?: Listener<T, TEvents[Key]>;
};

type EventDefinition = {
    [key: string]: any;
}

type EventsType<T> = T extends Target<infer TEvents> ? TEvents : never;
interface Target<TEvents extends EventDefinition = {}> extends HTMLElement
{
}

type CustomEventsType<T extends CustomTarget<T>> = T extends CustomTarget<any, infer TEvents> ? TEvents : never;
interface CustomTarget<T extends CustomTarget<T, TEvents>, TEvents extends EventDefinition = {}> extends EventTarget
{
    // on(
    //     selector: string|EventListenerConfig<T, TEvents>,
    //     settings?: EventListenerConfig<T, TEvents>
    // ): CustomTarget<T>;
    // emit<K extends (keyof TEvents)&string>(event: K, detail?: TEvents[K], init?: Partial<EventInit>): CustomEvent<TEvents[K]>;
    // await<K extends (keyof TEvents)&string>(event: K): Promise<TEvents[K]>;
    //
    // on<Q extends Target>(
    //     selector: string|EventListenerConfig<Q, Q['events']>,
    //     settings?: EventListenerConfig<Q, Q['events']>
    // ): EventTarget;
    //
    // on<Q extends HTMLElement>(
    //     selector: string|EventListenerConfig<Q, {}>,
    //     settings?: EventListenerConfig<Q, {}>
    // ): EventTarget;
    //
    // emit<TDetail = void>(event: string, detail?: TDetail, init?: Partial<EventInit>): CustomEvent<TDetail>;
    // await<TDetail = void>(event: string): Promise<TDetail>;
}

interface EventTarget
{
    readonly parents?: Set<WeakRef<EventTarget>>;

    on(
        selector: string|EventListenerConfig<HTMLElement, {}>,
        settings?: EventListenerConfig<HTMLElement, {}>
    ): EventTarget;

    on<T extends Target>(
        selector: string|EventListenerConfig<T, EventsType<T>>,
        settings?: EventListenerConfig<T, EventsType<T>>
    ): EventTarget;

    on<T extends CustomTarget<T>>(
        selector: string|EventListenerConfig<T, CustomEventsType<T>>,
        settings?: EventListenerConfig<T, CustomEventsType<T>>
    ): CustomTarget<T>;

    on<T extends HTMLElement>(
        selector: string|EventListenerConfig<T, {}>,
        settings?: EventListenerConfig<T, {}>
    ): EventTarget;

    trigger(event: string): EventTarget;
    emit<TDetail = void>(event: string, detail?: TDetail, init?: Partial<EventInit>): CustomEvent<TDetail>;
    await<TDetail = void>(event: string): Promise<TDetail>;
}

type Constructor<T extends object = object> = new (...args: any[]) => T;
type PrototypeOf<T extends Constructor<any>> = T extends Constructor<infer U> ? U : never;

declare type FormValue = string|File|FormData;

interface ElementInternals
{
    readonly shadowRoot?: ShadowRoot;
    readonly form?: HTMLFormElement;

    readonly willValidate: boolean;
    readonly validity: ValidityState;
    readonly validationMessage: string;
    readonly labels: NodeList

    setFormValue(value?: FormValue, state?: FormValue): void;
    setValidity(flags: ValidityState, message: string, anchor?: HTMLElement): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
}

interface AsyncFunction
{
    apply(this: AsyncFunction, thisArg: any, argArray?: any): Promise<any>;
    call(this: AsyncFunction, thisArg: any, ...argArray: any[]): Promise<any>;
    bind(this: AsyncFunction, thisArg: any, ...argArray: any[]): any;
    toString(): string;

    prototype: any;
    readonly length: number;
}

interface AsyncFunctionConstructor extends Constructor<AsyncFunction>
{
    new(...args: string[]): AsyncFunction;
    (...args: string[]): AsyncFunction;
}

declare var AsyncFunction: AsyncFunctionConstructor;

declare interface IException extends Error
{
}

declare interface ExceptionConstructor extends Constructor<IException>
{
    new(message: string, inner: IException, owner: any): IException
}

declare interface QueueItem
{
    property: string;
    args: any[];
}

declare interface IQueuedPromise
{
    settle(value: any): Promise<any>;
    resolve(item: any, { property, args }: QueueItem): Promise<any>;
}

declare interface QueuedPromiseConstructor extends Constructor<IQueuedPromise>
{
    new(promise: Promise<any>): IQueuedPromise;
}

declare type FontDeclaration = {
    kind: string;
    family: string;
    category: string;
    variants: Array<string>;
    subsets: Array<string>;
    version: string;
    lastModified: string;
    files: {
        [key: string]: string,
    };
};

declare type ObservableOptions = {
    parent?: WeakRef<EventTarget>;
};

type ObservableEvents<T> = {
    changed: {
        old: T[keyof T]|T|undefined;
        new: T[keyof T]|T;
        property?: string;
        path?: Array<string>;
        target: IObservable<T>;
    };
};

declare interface IObservable<T> extends CustomTarget<IObservable<T>, ObservableEvents<T>>
{
    readonly options: ObservableOptions;

    get(): T;
    set(value: T): void;
}