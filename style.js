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

    static async set(key, url, options = {})
    {
        const [ sheet ] = this.get(key);
        const css = await fetch(`${url}?fyn.core.style`, options).then(r => r.text());

        try
        {
            await sheet.replace(css);
        }
        catch (e)
        {
            console.error(sheet, css);

            throw e;
        }
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