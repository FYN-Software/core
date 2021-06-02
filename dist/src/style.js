export default class Style {
    static get(...keys) {
        return keys.map(key => {
            if (this.map.has(key) === false) {
                this.map.set(key, new CSSStyleSheet());
            }
            return this.map.get(key);
        });
    }
    static async set(key, url, options = {}) {
        if (this.urls.get(key) === url) {
            return;
        }
        if (url.includes('generic')) {
            console.trace(key, url);
        }
        this.urls.set(key, url);
        const [sheet] = this.get(key);
        const css = await fetch(`${url}?fyn.core.style`, options).then(r => r.text());
        await sheet.replace(css);
    }
    static async fromString(key, content) {
        if (this.map.has(key) === false) {
            this.map.set(key, new CSSStyleSheet({ crossOrigin: 'anonymous' }));
        }
        return this.map.get(key).replace(content);
    }
}
Style.map = new Map();
Style.urls = new Map();
