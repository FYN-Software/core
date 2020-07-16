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

    static async set(key, url, options = {})
    {
        if(this.#map.has(key) === false)
        {
            this.#map.set(key, new CSSStyleSheet({ crossOrigin: 'anonymous' }));
        }

        let css = await fetch(`${url}?fyn.core.style`, options).then(r => r.text());

        // NOTE(Chris Kruining) Recursivly replace @import with the content. This has a 10 second timeout as backup exit condition for the while loop
        let timedOut = false;
        Promise.delay(10000).then(() => timedOut = true);

        while(css.includes('@import') || timedOut)
        {
            css = await css.replaceAllAsync(
                /@import url\('(https:\/\/[a-zA-Z0-9/:?#-_=~@%.|]+)'\)/gm,
                (_, url) => fetch(`${url}?fyn.core.style`, options).then(r => r.text())
            );
        }

        await this.#map.get(key).replace(css);
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