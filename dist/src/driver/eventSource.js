var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _lastId;
export default class EventSource extends EventTarget {
    constructor(url, init = {}) {
        super();
        this.controller = new AbortController();
        _lastId.set(this, -1);
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
                __classPrivateFieldSet(this, _lastId, id);
            }
        }
    }
    get lastId() {
        return __classPrivateFieldGet(this, _lastId);
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
                    // these 2 functions are synchronous,
                    // I believe I could still squeeze a
                    // bit more performance here, if needed
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
_lastId = new WeakMap();
EventSource.init = {
    credentials: 'omit',
    mode: 'cors',
    headers: {
        'Accept': 'text/event-stream',
    },
};
