export default class Idb {
    #driver = indexedDB;
    #name;
    #connection;
    #context;
    constructor(name) {
        this.#name = name;
    }
    async open(stores, version) {
        return new Promise((resolve, revoke) => {
            const connection = this.#driver.open(this.#name, version);
            connection.onerror = e => revoke(e);
            connection.onupgradeneeded = () => {
                this.#context = connection.result;
                if (stores === undefined) {
                    return;
                }
                for (const [name, keyPath] of Object.entries(stores)) {
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
    async transaction(store, mode = 'readwrite') {
        return this.#context?.transaction(store, mode).objectStore(store);
    }
    async get(name, query) {
        const table = await this.transaction(name, 'readonly');
        if (table === undefined) {
            return Promise.reject('table not found');
        }
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
    async put(name, ...rows) {
        const table = await this.transaction(name);
        if (table === undefined) {
            return Promise.reject('table not found');
        }
        for (const row of rows) {
            table.put(row);
        }
    }
    static async get(name) {
        const [database, table, query] = name.split('.');
        const db = new Idb(database);
        await db.open();
        return await db.get(table, query);
    }
    static async put(name, ...rows) {
        const [database, table] = name.split('.');
        const db = new Idb(database);
        await db.open();
        await db.put(table, ...rows);
        return rows;
    }
    get context() {
        return this.#context;
    }
}
//# sourceMappingURL=idb.js.map