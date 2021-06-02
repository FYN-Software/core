declare type StoreConfig = {
    [key: string]: string;
};
export default class Idb {
    #private;
    constructor(name: string);
    open(stores?: StoreConfig, version?: number): Promise<Idb>;
    transaction(store: string, mode?: IDBTransactionMode): Promise<IDBObjectStore | undefined>;
    get<T = any>(name: string, query: IDBValidKey | IDBKeyRange | null): Promise<Array<T>>;
    put<T>(name: string, ...rows: Array<T>): Promise<void>;
    static get<T>(name: string): Promise<Array<T>>;
    static put<T>(name: string, ...rows: Array<T>): Promise<Array<T>>;
    get context(): IDBDatabase | undefined;
}
export {};
