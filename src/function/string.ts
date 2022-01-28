export async function replaceAllAsync(subject: string, regex: RegExp, predicate: (...matches: Array<string>) => Promise<string>): Promise<string>
{
    const data: Array<string> = await Promise.all([ ...subject.matchAll(regex) ].map(matches => predicate(...matches)));

    return subject.replaceAll(regex, () => data.shift()!);
}

export function toDashCase(subject: string): string
{
    return subject.replace(/([A-Z])/g, (w: string, u: string) => `-${ u.toLowerCase() }`).replace(/^-+|-+$/g, '');
}

export function toSnakeCase(subject: string): string
{
    return subject.replace(/([A-Z])/g, (w: string, u: string) => `_${ u.toLowerCase() }`).replace(/^_+|_+$/g, '');
}

export function toCamelCase(subject: string): string
{
    return subject.replace(/[\-_]([a-z])/g, (w: string, m: string) => m.toUpperCase());
}

export function toPascalCase(subject: string): string
{
    return subject[0].toUpperCase() + toCamelCase(subject.slice(1));
}

export function capitalize(subject: string): string
{
    return subject.charAt(0).toUpperCase() + subject.slice(1);
}

export function parseJwt(jwt: string): any
{
    return JSON.parse(decodeURIComponent(
        atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    ));
}