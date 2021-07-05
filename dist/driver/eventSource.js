export default class EventSource extends EventTarget {
    static init = {
        credentials: 'omit',
        mode: 'cors',
        headers: {
            'Accept': 'text/event-stream',
        },
    };
    controller = new AbortController();
    request;
    #lastId = -1;
    constructor(url, init = {}) {
        super();
        this.request = fetch(url, {
            ...EventSource.init,
            ...init,
            signal: this.controller.signal,
            headers: {
                ...EventSource.init.headers,
                ...(init?.headers ?? {})
            }
        });
    }
    async *listenFor(event = 'message') {
        for await (const { id = null, event: e, data } of EventSource.parse(this.read(this.request))) {
            if (e === 'keepAlive') {
                continue;
            }
            if (e === 'close') {
                break;
            }
            if (e === event && data !== undefined) {
                yield data;
            }
            if (id !== null) {
                this.#lastId = id;
            }
        }
    }
    get lastId() {
        return this.#lastId;
    }
    async close() {
        this.emit('done');
        this.controller.abort();
    }
    async *read(request) {
        const response = (await request);
        if (response.body === null) {
            return;
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                yield* decoder
                    .decode(value, { stream: true })
                    .split('\n\n')
                    .filter(m => m.length > 0);
            }
        }
        finally {
            reader.releaseLock();
            await this.close();
        }
    }
    static async *parse(iterator) {
        for await (const chunk of iterator) {
            const message = {};
            for (const line of chunk.split('\n')) {
                const [, key, value = ''] = line.match(/^(\w+):\s*(.*)$/) ?? [, '', ''];
                switch (key) {
                    case 'id':
                        {
                            message.id = Number.parseInt(value);
                            break;
                        }
                    case 'data':
                        {
                            message.data = JSON.tryParse(value);
                            break;
                        }
                    case 'event':
                        {
                            message.event = value;
                            break;
                        }
                    default:
                        {
                            throw new Error('invalid property in message');
                        }
                }
            }
            if (message.event === undefined) {
                console.error(message);
                throw new Error(`encountered an invalid message, no event given`);
            }
            yield message;
        }
    }
}
//# sourceMappingURL=eventSource.js.map