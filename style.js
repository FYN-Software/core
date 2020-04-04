export default class Style
{
    static #map = new Map();
    static #resolvers = new Map();

    static get(...keys)
    {
        return keys.map(key => {
            if(this.#map.has(key) === false)
            {
                this.#map.set(key, new CSSStyleSheet({ crossOrigin: 'anonymous' }));
            }

            return this.#map.get(key);
        });
    }

    static set(key, url, options = {})
    {
        if(this.#map.has(key) === false)
        {
            this.#map.set(key, new CSSStyleSheet({ crossOrigin: 'anonymous' }));
        }

        fetch(`${url}?fyn.core.style`, options).then(r => r.text()).then(r => this.#map.get(key).replace(r));
    }

    static fromString(key, content)
    {
        if(this.#map.has(key) === false)
        {
            this.#map.set(key, new CSSStyleSheet({ crossOrigin: 'anonymous' }));
        }

        this.#map.get(key).replace(content);
    }
}