export function wrap(document) {
    return new Proxy({}, {
        get: (_, name) => document.querySelector(`meta[name="${name}"]`)?.getAttribute('content'),
        set: (_, name, value) => {
            const el = document.querySelector(`meta[name="${name}"]`);
            if (el !== null) {
                el.setAttribute('content', value);
                return true;
            }
            const meta = document.createElement('meta');
            meta.setAttribute('name', name);
            meta.setAttribute('content', value);
            document.head.appendChild(meta);
            return true;
        },
    });
}
//# sourceMappingURL=meta.js.map