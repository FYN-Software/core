const map: Map<string, CSSStyleSheet> = new Map();
const urls: Map<string, string> = new Map();
const defined: Map<string, [ string, object ]> = new Map();

export function get(...keys: string[]): CSSStyleSheet[]
{
    return keys.map(key => {
        if(map.has(key) === false)
        {
            map.set(key, new CSSStyleSheet());

            if(defined.has(key))
            {
                void set(key, ...defined.get(key)!);
            }
        }

        return map.get(key)!;
    });
}

export async function set(key: string, url: string, options = {}): Promise<void>
{
    if(urls.get(key) === url)
    {
        return;
    }

    urls.set(key, url);

    const [ sheet ] = get(key);
    const css = await fetch(`${url}?fyn.core.style`, options).then(r => r.text());

    await sheet.replace(css);
}

export function define(key: string, url: string, options = {}): void
{
    defined.set(key, [ url, options ]);
}

export async function fromString(key: string, content: string): Promise<void>
{
    if(map.has(key) === false)
    {
        // this.map.set(key, new CSSStyleSheet({ crossOrigin: 'anonymous' }));
        map.set(key, new CSSStyleSheet());
    }

    return map.get(key)!.replace(content);
}