export var Preference;
(function (Preference) {
    Preference["reducedData"] = "prefers-reduced-data";
    Preference["reducedMotion"] = "prefers-reduced-motion";
    Preference["reducedTransparency"] = "prefers-reduced-transparency";
    Preference["colorScheme"] = "prefers-color-scheme";
    Preference["contrast"] = "prefers-contrast";
})(Preference || (Preference = {}));
const defaultsMap = new Map([
    [Preference.reducedData, 'reduce'],
    [Preference.reducedMotion, 'reduce'],
    [Preference.reducedTransparency, 'reduce'],
    [Preference.colorScheme, 'light'],
    [Preference.contrast, 'more'],
]);
export function prefers(preference, value) {
    return globalThis.matchMedia(`(${preference}: ${value ?? defaultsMap.get(preference)})`).matches;
}
//# sourceMappingURL=media.js.map