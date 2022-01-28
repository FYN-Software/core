function url(font: FontDeclaration, variants: Array<string>, onlyCharacters: boolean): string
{
    const f = font.family.replace(/ /g, '+');
    const v = variants.join(',');
    let url = `https://fonts.googleapis.com/css?family=${f}:${v}`;

    if(onlyCharacters === true)
    {
        const t = font.family
            .replace(/\s+/g, '')
            .split('')
            .filter((x, n, s) => s.indexOf(x) === n)
            .join('');
        url += `&text=${t}`;
    }

    return url;
}

async function load(font: FontDeclaration, selector?: string, variants: Array<string> = [], preview: boolean = false): Promise<void>
{
    return new Promise((res, rev) => {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = url(font, variants, preview);
        l.id = `font-${preview ? 'preview' : 'full'}-${selector || font.family.replace(/\s+/g, '-').toLowerCase()}`;
        l.onload = () => res();
        l.onerror = () => rev();

        document.head.appendChild(l);
    });
}

export async function fetchFromNetwork(font: FontDeclaration, selector?: string, variants: Array<string> = [])
{
    return load(font, selector, variants, false);
}

export async function preview(font: FontDeclaration, selector?: string, variants: Array<string> = [])
{
    return load(font, selector, variants, true);
}

export async function list(key: string): Promise<object>
{
    const url = `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${key}`;

    return (await fetch(url, { headers: { 'content-type': 'application/json' } })).json();
}
