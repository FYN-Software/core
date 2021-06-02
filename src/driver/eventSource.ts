type Message = {
    id?: number,
    event?: string,
    data?: object,
};

export default class EventSource extends EventTarget
{
    private static init: RequestInit = {
        credentials: 'omit',
        mode: 'cors',
        headers: {
            'Accept': 'text/event-stream',
        },
    };

    private controller: AbortController = new AbortController();
    private readonly request: Promise<Response>;
    #lastId: number = -1;

    constructor(url: string, init: RequestInit = {})
    {
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

    async *listenFor(event: string = 'message'): AsyncIterable<object>
    {
        for await (const { id = null, event: e, data } of EventSource.parse(this.read(this.request)))
        {
            if(e === 'keepAlive')
            {
                continue;
            }

            if(e === 'close')
            {
                break;
            }

            if(e === event && data !== undefined)
            {
                yield data;
            }

            if(id !== null)
            {
                this.#lastId = id;
            }
        }
    }

    get lastId(): number
    {
        return this.#lastId;
    }

    private async close(): Promise<void>
    {
        this.emit('done');

        this.controller.abort();
    }

    private async *read(request: Promise<Response>): AsyncIterable<string>
    {
        const response = (await request) as Response;

        if(response.body === null)
        {
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try
        {
            while(true)
            {
                const { done, value } = await reader.read();

                if(done)
                {
                    break;
                }

                yield* decoder
                    .decode(value, {stream: true})
                    // these 2 functions are synchronous,
                    // I believe I could still squeeze a
                    // bit more performance here, if needed
                    .split('\n\n')
                    .filter(m => m.length > 0);
            }
        }
        finally
        {
            reader.releaseLock();

            await this.close()
        }
    }

    private static async *parse(iterator: AsyncIterable<string>): AsyncIterable<Message>
    {
        for await (const chunk of iterator)
        {
            const message: Message = {};

            for (const line of chunk.split('\n'))
            {
                const [ , key, value = '' ] = line.match(/^(\w+):\s*(.*)$/) ?? [ , '', '' ];

                switch (key)
                {
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

            if(message.event === undefined)
            {
                console.error(message);
                throw new Error(`encountered an invalid message, no event given`);
            }

            yield message;
        }
    }
}