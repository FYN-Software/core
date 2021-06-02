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
var _driver, _name, _connection, _context;
export default class Idb {
    constructor(name) {
        _driver.set(this, indexedDB);
        _name.set(this, void 0);
        _connection.set(this, void 0);
        _context.set(this, void 0);
        __classPrivateFieldSet(this, _name, name);
    }
    async open(stores, version) {
        return new Promise((resolve, revoke) => {
            const connection = __classPrivateFieldGet(this, _driver).open(__classPrivateFieldGet(this, _name), version);
            connection.onerror = e => revoke(e);
            connection.onupgradeneeded = () => {
                __classPrivateFieldSet(this, _context, connection.result);
                if (stores === undefined) {
                    return;
                }
                for (const [name, keyPath] of Object.entries(stores)) {
                    __classPrivateFieldGet(this, _context).createObjectStore(name, { keyPath });
                }
            };
            connection.onsuccess = () => {
                __classPrivateFieldSet(this, _context, connection.result);
                resolve(this);
            };
            __classPrivateFieldSet(this, _connection, connection);
        });
    }
    async transaction(store, mode = 'readwrite') {
        return __classPrivateFieldGet(this, _context)?.transaction(store, mode).objectStore(store);
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
        return __classPrivateFieldGet(this, _context);
    }
}
_driver = new WeakMap(), _name = new WeakMap(), _connection = new WeakMap(), _context = new WeakMap();
// Comlink.expose(Idb);
