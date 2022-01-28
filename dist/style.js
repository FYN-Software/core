const map = new Map();
const urls = new Map();
const defined = new Map();
export function get(...keys) {
    return keys.map(key => {
        if (map.has(key) === false) {
            map.set(key, new CSSStyleSheet());
            if (defined.has(key)) {
                void set(key, ...defined.get(key));
            }
        }
        return map.get(key);
    });
}
export async function set(key, url, options = {}) {
    if (urls.get(key) === url) {
        return;
    }
    urls.set(key, url);
    const [sheet] = get(key);
    const css = await fetch(`${url}?fyn.core.style`, options).then(r => r.text());
    await sheet.replace(css);
}
export function define(key, url, options = {}) {
    defined.set(key, [url, options]);
}
export async function fromString(key, content) {
    if (map.has(key) === false) {
        map.set(key, new CSSStyleSheet());
    }
    return map.get(key).replace(content);
}
//# sourceMappingURL=style.js.map