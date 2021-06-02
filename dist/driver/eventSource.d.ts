export default class EventSource extends EventTarget {
    #private;
    private static init;
    private controller;
    private readonly request;
    constructor(url: string, init?: RequestInit);
    listenFor(event?: string): AsyncIterable<object>;
    get lastId(): number;
    private close;
    private read;
    private static parse;
}
//# sourceMappingURL=eventSource.d.ts.map