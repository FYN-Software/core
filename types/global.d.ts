interface Array<T>
{
    compare(arr2: Array<T>): boolean;
    unique(): Array<T>;
    shuffle(): Array<T>;
    chunk(size: number): Array<Array<T>>;
    chunk(size: number): Array<Array<T>>;
    filterAsync(predicate: (toTest: T) => Promise<boolean>): Promise<Array<T>>;
    first: T|undefined;
    last: T|undefined;
    sum: number;
    indexOfMinValue: number;
    indexOfMaxValue: number;
}

interface ArrayConstructor
{
    compare<T>(arr1: Array<T>, arr2: Array<T>): boolean;
    fromAsync<TIn, TOut = TIn>(iterable: AsyncIterable<TIn>|Iterable<TIn>, map?: (i: TIn) => Promise<TOut>): Promise<Array<TOut>>;
}

interface Node
{
    remove(): void;
}

interface NodeList
{
    clear(): NodeList;
}

interface Element
{
    readonly index: number;

    addEventListener<K extends keyof ElementEventMap>(type: K, listener: (this: Element, ev: ElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions, useCapture?: boolean): void;
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

interface NamedNodeMap
{
    toggle(name: string): void;
    setOnAssert(condition: boolean, name: string, value?: any): NamedNodeMap;
}

interface Math
{
    mod(value: number, radix: number): number;
    clamp(lowerBound: number, upperBound: number, value: number): number;
}

interface Number
{
    mod(radix: number): number;
    map(lowerBoundIn: number, upperBoundIn: number, lowerBoundOut: number, upperBoundOut: number): number;
    clamp(lowerBound: number, upperBound: number): number;
}

declare interface String
{
    toDashCase(): string;
    toSnakeCase(): string;
    toCamelCase(): string;
    capitalize(): string;
    toAsyncIterable(): AsyncGenerator<string, void, void>;
    replaceAll(regex: RegExp, callback: (...matches: Array<string>) => string): string
    replaceAllAsync(regex: RegExp, callback: (...matches: Array<string>) => string): Promise<string>
}

interface Promise<T>
{
    delay(milliseconds: number): Promise<T>;
    stage(callback: (data: T) => any): Promise<T>;
}
interface PromiseConstructor
{
    delay(milliseconds: number): Promise<void>;
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
type BuiltInListener<T extends Element, Key extends keyof HTMLElementEventMap> = (event: HTMLElementEventMap[Key], target: T) => any;
type Listener<T extends Element, TDetails = any> = (details: TDetails, target: T, event: CustomEvent<TDetails>) => any;

type FilteredEventMap<TEvents> = keyof Omit<HTMLElementEventMap, keyof TEvents|'options'>;

type EventListenerConfig<T extends Element, TEvents extends object> = {
    options?: Options;
    [key: string]: Listener<T>|Options|undefined;
} & {
    [Key in FilteredEventMap<TEvents>]?: BuiltInListener<T, Key>;
} & {
    [Key in keyof Omit<TEvents, 'options'>]?: Listener<T, TEvents[Key]>;
};

interface EventTarget
{
    on<T extends Element = Element>(
        selector: string|EventListenerConfig<T, {}>,
        settings?: EventListenerConfig<T, {}>
    ): EventTarget;

    on<T extends Element, TEvents extends object>(
        selector: string|EventListenerConfig<T, TEvents>,
        settings?: EventListenerConfig<T, TEvents>
    ): EventTarget;

    trigger(event: string): EventTarget;
    emit<TDetail = any>(event: string, detail?: TDetail, composed?: boolean): CustomEvent<TDetail>;
    await<TDetail = any>(event: string): Promise<TDetail>;
}

interface JSON
{
    tryParse(str: string, ret?: boolean): any|string;
}

interface DOMRect
{
    contains(x: number, y: number): boolean;
}

interface DocumentFragment
{
    innerHTML: string;
}
interface DocumentFragmentConstructor
{
    fromString(html: string): DocumentFragment;
    fromElement(html: string): DocumentFragment;
}

type Constructor<T extends object = object> = new (...args: any[]) => T;

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