type StoreConfig = {
    [key: string]: string
};

export default class Idb
{
    #driver = indexedDB;
    readonly #name: string;
    #connection: IDBOpenDBRequest|undefined;
    #context: IDBDatabase|undefined;

    constructor(name: string)
    {
        this.#name = name;
    }

    async open(stores?: StoreConfig, version?: number): Promise<Idb>
    {
        return new Promise((resolve, revoke) =>
        {
            const connection = this.#driver.open(this.#name, version);

            connection.onerror = e => revoke(e);

            connection.onupgradeneeded = () => {
                this.#context = connection.result;


                if(stores === undefined)
                {
                    return;
                }

                for(const [ name, keyPath ] of Object.entries(stores))
                {
                    this.#context.createObjectStore(name, { keyPath });
                }
            };

            connection.onsuccess = () => {
                this.#context = connection.result;

                resolve(this);
            };

            this.#connection = connection;
        });
    }

    async transaction(store: string, mode: IDBTransactionMode = 'readwrite'): Promise<IDBObjectStore|undefined>
    {
        return this.#context?.transaction(store, mode).objectStore(store);
    }

    async get<T = any>(name: string, query: IDBValidKey|IDBKeyRange|null): Promise<Array<T>>
    {
        const table = await this.transaction(name, 'readonly');

        if(table === undefined)
        {
            return Promise.reject('table not found');
        }

        return new Promise((resolve, revoke) => {
            const key = table.getAll(query);

            key.onsuccess = () => {
                key.result
                    ? resolve(key.result as Array<T>)
                    : revoke({ message: 'row not found', key, query });
            };
            key.onerror = e => {
                revoke(e);
            };
        });
    }

    async put<T>(name: string, ...rows: Array<T>): Promise<void>
    {
        const table = await this.transaction(name);

        if(table === undefined)
        {
            return Promise.reject('table not found');
        }

        for(const row of rows)
        {
            table.put(row);
        }
    }

    static async get<T>(name: string): Promise<Array<T>>
    {
        const [ database, table, query ] = name.split('.');
        const db = new Idb(database);

        await db.open();

        return await db.get<T>(table, query);
    }

    static async put<T>(name: string, ...rows: Array<T>): Promise<Array<T>>
    {
        const [ database, table ] = name.split('.');
        const db = new Idb(database);

        await db.open();
        await db.put<T>(table, ...rows);

        return rows;
    }

    get context(): IDBDatabase|undefined
    {
        return this.#context;
    }
}

// Comlink.expose(Idb);
