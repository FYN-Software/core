export enum Preference
{
    reducedData = 'prefers-reduced-data',
    reducedMotion = 'prefers-reduced-motion',
    reducedTransparency = 'prefers-reduced-transparency',
    colorScheme = 'prefers-color-scheme',
    contrast = 'prefers-contrast',
}

const defaultsMap = new Map([
    [ Preference.reducedData, 'reduce' ],
    [ Preference.reducedMotion, 'reduce' ],
    [ Preference.reducedTransparency, 'reduce' ],
    [ Preference.colorScheme, 'light' ],
    [ Preference.contrast, 'more' ],
]);

export function prefers(preference: Preference, value?: string): boolean
{
    return globalThis.matchMedia(`(${preference}: ${value ?? defaultsMap.get(preference)})`).matches;
}