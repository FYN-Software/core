export declare function arrayFromAsync<TIn, TOut>(iterable: AsyncIterable<TIn> | Iterable<TIn>, map?: (i: TIn) => TOut): Promise<Array<TOut>>;
export declare function replaceAllAsync(subject: string, regex: RegExp, predicate: (...matches: Array<string>) => Promise<string>): Promise<string>;
export declare function clone<T extends object>(obj: T, root?: T | null): T;
export declare function equals<T>(a: T, b: T, references?: WeakSet<any>): boolean;
export declare function clamp(subject: number, lowerBound: number, upperBound: number): number;
//# sourceMappingURL=functions.d.ts.map