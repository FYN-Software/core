const locks = new WeakMap;

export default async function lock(subject, callback)
{
    if(locks.has(subject))
    {
        await locks.get(subject);
    }

    locks.set(subject, (async () => {
        await callback();
    })());
}