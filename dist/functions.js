export async function arrayFromAsync(iterable, map = i => i) {
    const result = [];
    for await (const item of iterable) {
        result.push(await map(item));
    }
    return result;
}
export async function replaceAllAsync(subject, regex, predicate) {
    const data = await Promise.all([...subject.matchAll(regex)].map(matches => predicate(...matches)));
    return subject.replaceAll(regex, () => data.shift());
}
export function clone(obj, root = null) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (root === null) {
        root = obj;
    }
    if (obj instanceof Array) {
        return obj.reduce((t, i) => {
            if (Object.is(i, root) === false) {
                t.push(clone(i));
            }
            return t;
        }, []);
    }
    if (obj instanceof Set) {
        return new Set(Array.from(obj).map(v => clone(v)));
    }
    return Object.entries(obj).reduce((t, [k, v]) => {
        if (!Object.is(v, root) && !k.startsWith('__')) {
            t[k] = clone(v, root);
        }
        return t;
    }, {});
}
export function equals(a, b, references = new WeakSet()) {
    if (typeof a === 'object' && a !== undefined && a !== null) {
        if (references.has(a)) {
            return true;
        }
        references.add(a);
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
        return a === b;
    }
    if (a instanceof Array && b instanceof Array) {
        return Array.compare(a, b);
    }
    if (a instanceof Object && b instanceof Object) {
        if (a.constructor.name !== b.constructor.name) {
            return false;
        }
        if (Object.getOwnPropertyNames(a).compare(Object.getOwnPropertyNames(b)) === false) {
            return false;
        }
        for (const p of Object.getOwnPropertyNames(a)) {
            if (equals(a[p], b[p], references) !== true) {
                return false;
            }
        }
        return true;
    }
    return a === b;
}
//# sourceMappingURL=functions.js.map