export default abstract class Style {
    private static map;
    private static urls;
    private static defined;
    static get(...keys: string[]): CSSStyleSheet[];
    static set(key: string, url: string, options?: {}): Promise<void>;
    static define(key: string, url: string, options?: {}): void;
    static fromString(key: string, content: string): Promise<void>;
}
//# sourceMappingURL=style.d.ts.map