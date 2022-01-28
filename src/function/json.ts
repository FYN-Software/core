export function tryParse<T>(subject: string): T|undefined
{
    let out: T;

    try
    {
        out = JSON.parse(subject);

        return out;
    }
    catch(e)
    {
        return undefined;
    }
}