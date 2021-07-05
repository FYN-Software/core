export var Preference;
(function (Preference) {
    Preference["reducedData"] = "prefers-reduced-data";
    Preference["reducedMotion"] = "prefers-reduced-motion";
    Preference["reducedTransparency"] = "prefers-reduced-transparency";
    Preference["colorScheme"] = "prefers-color-scheme";
    Preference["contrast"] = "prefers-contrast";
})(Preference || (Preference = {}));
export default class Media {
    static defaultsMap = new Map([
        [Preference.reducedData, 'reduce'],
        [Preference.reducedMotion, 'reduce'],
        [Preference.reducedTransparency, 'reduce'],
        [Preference.colorScheme, 'light'],
        [Preference.contrast, 'more'],
    ]);
    static prefers(preference, value) {
        return globalThis.matchMedia(`(${preference}: ${value ?? this.defaultsMap.get(preference)})`).matches;
    }
}
//# sourceMappingURL=media.js.map