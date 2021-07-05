export default class Style {
    static map = new Map();
    static urls = new Map();
    static defined = new Map();
    static get(...keys) {
        return keys.map(key => {
            if (this.map.has(key) === false) {
                this.map.set(key, new CSSStyleSheet());
                if (this.defined.has(key)) {
                    void this.set(key, ...this.defined.get(key));
                }
            }
            return this.map.get(key);
        });
    }
    static async set(key, url, options = {}) {
        if (this.urls.get(key) === url) {
            return;
        }
        this.urls.set(key, url);
        const [sheet] = this.get(key);
        const css = await fetch(`${url}?fyn.core.style`, options).then(r => r.text());
        await sheet.replace(css);
    }
    static define(key, url, options = {}) {
        this.defined.set(key, [url, options]);
    }
    static async fromString(key, content) {
        if (this.map.has(key) === false) {
            this.map.set(key, new CSSStyleSheet());
        }
        return this.map.get(key).replace(content);
    }
}
//# sourceMappingURL=style.js.map