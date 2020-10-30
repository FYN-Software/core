export default class EventSource extends EventTarget
{
    static #init = {
        credentials: 'omit',
        mode: 'cors',
        headers: {
            'Accept': 'text/event-stream',
        },
    };

    #controller = new AbortController();
    #request;
    #lastId = null;

    constructor(url, init = {})
    {
        super();

        this.#request = fetch(url, { ...EventSource.#init, ...init, signal: this.#controller.signal, headers: { ...EventSource.#init.headers, ...(init?.headers ?? {}) } }).catch(console.error);
    }

    async *listenFor(event = 'message')
    {
        for await (const { id = null, event: e, data } of this.#parse(this.#read()))
        {
            if(e === 'keepAlive')
            {
                continue;
            }

            if(e === 'close')
            {
                await this.#close();

                return;
            }

            if(e === event)
            {
                yield data;
            }

            if(id !== null)
            {
                this.#lastId = id;
            }
        }
    }

    get lastId()
    {
        return this.#lastId;
    }

    async #close()
    {
        this.emit('done');

        this.#controller.abort();
    }

    async *#read()
    {
        const response = await this.#request;
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while(true)
        {
            const { done, value } = await reader.read();

            if(done)
            {
                await this.#close()

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

        reader.releaseLock();
    }

    async *#parse(iterator)
    {
        for await (const chunk of iterator)
        {
            const message = {};

            for (const line of chunk.split('\n'))
            {
                try
                {
                    const [ , key, value = '' ] = line.match(/^(\w+):\s*(.*)$/);

                    message[key] = (message[key] ?? '') + value;
                }
                catch (e)
                {
                    console.error(line, e);
                }
            }

            if(message.hasOwnProperty('event') === false)
            {
                console.error(message);
                throw new Error(`encountered an invalid message, no event given`);
            }

            if(message.hasOwnProperty('id'))
            {
                message.id = Number.parseInt(message.id) ?? -1;
            }

            if(message.hasOwnProperty('data'))
            {
                message.data = JSON.tryParse(message.data);
            }

            yield message;
        }
    }
}