export declare enum Preference {
    reducedData = "prefers-reduced-data",
    reducedMotion = "prefers-reduced-motion",
    reducedTransparency = "prefers-reduced-transparency",
    colorScheme = "prefers-color-scheme",
    contrast = "prefers-contrast"
}
export default class Media {
    private static defaultsMap;
    static prefers(preference: Preference, value?: string): boolean;
}
//# sourceMappingURL=media.d.ts.map