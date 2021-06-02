const locks: WeakMap<any, Promise<void>> = new WeakMap;

export default async function lock(subject: any, callback: () => Promise<void>): Promise<void>
{
    if(locks.has(subject))
    {
        await locks.get(subject);
    }

    locks.set(subject, callback());
}