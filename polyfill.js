export async function stringToScript(src)
{
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.defer = 'defer';
        script.type = 'module';
        script.src = URL.createObjectURL(new Blob([ src ], { type: 'text/javascript' }));
        script.onload = () => resolve(script);
        script.onerror = () => reject(script);

        document.head.appendChild(script);
    });
}

export function toAbsoluteURL(url)
{
    const a = document.createElement('a');
    a.setAttribute('href', url);
    return a.cloneNode(false).href;
}

export const needImportPolyfill = (() => {
    try
    {
        new Function('import("")');

        return false;
    }
    catch (err)
    {
        return true;
    }
})();
export async function importPolyfill(url)
{
    const vector = `__importPolyfill__${Math.random().toString(32).slice(2)}`;

    let script;
    let module = null;

    try
    {
        script = await stringToScript(`import * as m from '${toAbsoluteURL(url)}'; window.${vector} = m;`);

        module = window[vector];
    }
    catch (s)
    {
        console.error(e);

        script = s;

        throw new Error(`failed to be import script '${url}'`);
    }
    finally
    {
        script.onerror = null;
        script.onload = null;
        URL.revokeObjectURL(script.src);
        script.src = null;
        script.remove();

        delete window[vector];
    }

    return module;
}

export async function load(url)
{
    if(needImportPolyfill === true)
    {
        return importPolyfill(url);
    }

    return Function(`return import('${url}')`)();
}