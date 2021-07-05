export enum Preference
{
    reducedData = 'prefers-reduced-data',
    reducedMotion = 'prefers-reduced-motion',
    reducedTransparency = 'prefers-reduced-transparency',
    colorScheme = 'prefers-color-scheme',
    contrast = 'prefers-contrast',
}

export default class Media
{
    private static defaultsMap = new Map([
        [ Preference.reducedData, 'reduce' ],
        [ Preference.reducedMotion, 'reduce' ],
        [ Preference.reducedTransparency, 'reduce' ],
        [ Preference.colorScheme, 'light' ],
        [ Preference.contrast, 'more' ],
    ]);

    public static prefers(preference: Preference, value?: string): boolean
    {
        return globalThis.matchMedia(`(${preference}: ${value ?? this.defaultsMap.get(preference)})`).matches;
    }
}