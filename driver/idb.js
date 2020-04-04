import * as Comlink from 'https://unpkg.com/comlink/dist/esm/comlink.mjs';

export default class Idb
{
    #driver = indexedDB;
    #name = name;
    #connection = null;
    #context = null;
    #stores = {};

    constructor(name)
    {
        this.#name = name;
    }

    async open(stores, version = undefined)
    {
        return new Promise((resolve, revoke) =>
        {
            this.#connection = this.#driver.open(this.#name, version);

            this.#connection.onerror = e => revoke(e);

            this.#connection.onupgradeneeded = () => {
                this.#context = this.#connection.result;

                for(const [ name, keyPath ] of Object.entries(stores))
                {
                    this.#context.createObjectStore(name, { keyPath });
                }
            };

            this.#connection.onsuccess = () => {
                this.#context = this.#connection.result;

                resolve(this);
            };
        });
    }

    async transaction(store, mode = 'readwrite')
    {
        return this.#context.transaction(store, mode).objectStore(store);
    }

    async get(name, query)
    {
        const table = await this.transaction(name, 'readonly');

        return new Promise((resolve, revoke) => {
            const key = table.getAll(query);

            key.onsuccess = () => {
                key.result
                    ? resolve(key.result)
                    : revoke({ message: 'row not found', key, query });
            };
            key.onerror = e => {
                revoke(e);
            };
        });
    }

    static async get(name)
    {
        const parts = name.split('.');
        const db = new Idb(parts.shift());

        await db.open();
        return await db.get(...parts);
    }

    async put(name, ...rows)
    {
        const table = await this.transaction(name);

        for(const row of rows)
        {
            table.put(row);
        }
    }

    static async put(name, ...rows)
    {
        const parts = name.split('.');
        const db = new Idb(parts[0]);

        await db.open();
        await db.put(parts[1], ...rows);

        return rows;
    }

    get context()
    {
        return this.#context;
    }
}

// Comlink.expose(Idb);
