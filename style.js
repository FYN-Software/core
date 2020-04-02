export default class Style
{
    static #map = new Map();
    static #resolvers = new Map();

    static get(...keys)
    {
        return keys.map(key => {
            if(this.#map.has(key) === false)
            {
                this.#map.set(key, new CSSStyleSheet());
            }

            return this.#map.get(key);
        });
    }

    static set(key, url)
    {
        if(this.#map.has(key) === false)
        {
            this.#map.set(key, new CSSStyleSheet());
        }

        fetch(url).then(r => r.text()).then(r => this.#map.get(key).replace(r));
    }

    static fromString(key, content)
    {
        if(this.#map.has(key) === false)
        {
            this.#map.set(key, new CSSStyleSheet());
        }

        this.#map.get(key).replace(content);
    }
}