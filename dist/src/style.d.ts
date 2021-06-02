export default abstract class Style {
    private static map;
    private static urls;
    static get(...keys: string[]): CSSStyleSheet[];
    static set(key: string, url: string, options?: {}): Promise<void>;
    static fromString(key: string, content: string): Promise<void>;
}
