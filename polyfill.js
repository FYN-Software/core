export async function stringToScript(src, type = 'text/javascript')
{
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = URL.createObjectURL(new Blob([ src ], { type }));
        script.onload = resolve.bind(null, script);
        script.onerror = reject.bind(null, script);

        document.head.appendChild(script);
    });
}

export function toAbsoluteURL(url)
{
    const a = document.createElement('a');
    a.setAttribute('href', url);
    return a.cloneNode(false).href;
}

export const needImportPolyfill = Date.now() % 2 === 0;
export async function importPolyfill(url)
{
    const vector = `__importPolyfill__${Math.random().toString(32).slice(2)}`;

    let script;

    try
    {
        script = await stringToScript(`import * as m from "${toAbsoluteURL(url)}"; window.${vector} = m;`);
    }
    catch (s)
    {
        script = s;

        throw new Error(`failed to be import script '${url}'`);
    }
    finally
    {
        script.onerror = null;
        script.onload = null;
        script.remove();

        delete window[vector];
    }
}

export async function load(url)
{
    return needImportPolyfill
        ? importPolyfill(url)
        : import(url);
}