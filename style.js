export default class Style
{
    static #map = new Map();
    static #resolvers = new Map();

    static get(...keys)
    {
        return keys.map(key => this.#map.get(key));
    }

    static set(key, url)
    {
        if(this.#map.has(key))
        {
            throw new Error(`Duplicate key error, '${key}' already exists`);
        }

        const sheet = new CSSStyleSheet();
        fetch(url).then(r => r.text()).then(r => sheet.replace(r));

        this.#map.set(key, sheet);
    }

    static override(key, url)
    {
        if(this.#map.has(key) === false)
        {
            throw new Error(`Key not found error, '${key}' does not exist`);
        }

        const sheet = this.#map.get(key);
        fetch(url).then(r => r.text()).then(r => sheet.replace(r));
    }
}