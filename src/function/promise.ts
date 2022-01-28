export function delay(milliseconds: number): Promise<void>
{
    return new Promise(r => setTimeout(() => r(), milliseconds));
}

export async function stage<T>(promise: Promise<T>, callback: (data: T) => any): Promise<T>
{
    const data = await promise;

    await callback(data);

    return data;
}

export async function doUntil(callback: () => Promise<any>, predicate: () => boolean, loopCallback?: () => any): Promise<void>
{
    do
    {
        await callback();

        if(predicate() === true)
        {
            return;
        }

        loopCallback?.()
    }
    while(true)
}