export default class EventSource extends EventTarget {
    #private;
    constructor(url: string, init?: RequestInit);
    listenFor(event?: string): AsyncIterable<object>;
    get lastId(): number;
    private close;
}
//# sourceMappingURL=eventSource.d.ts.map