export default abstract class Style
{
    private static map : Map<string, CSSStyleSheet> = new Map();
    private static urls : Map<string, string> = new Map();

    public static get(...keys: string[]): CSSStyleSheet[]
    {
        return keys.map(key => {
            if(this.map.has(key) === false)
            {
                this.map.set(key, new CSSStyleSheet());
            }

            return this.map.get(key)!;
        });
    }

    public static async set(key: string, url: string, options = {}): Promise<void>
    {
        if(this.urls.get(key) === url)
        {
            return;
        }

        if(url.includes('generic'))
        {
            console.trace(key, url);
        }

        this.urls.set(key, url);

        const [ sheet ] = this.get(key);
        const css = await fetch(`${url}?fyn.core.style`, options).then(r => r.text());

        await sheet.replace(css);
    }

    public static async fromString(key: string, content: string): Promise<void>
    {
        if(this.map.has(key) === false)
        {
            this.map.set(key, new CSSStyleSheet({ crossOrigin: 'anonymous' }));
        }

        return this.map.get(key)!.replace(content);
    }
}