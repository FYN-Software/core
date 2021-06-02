export default class Font {
    static fetch(font: FontDeclaration, selector?: string, variants?: Array<string>): Promise<void>;
    static preview(font: FontDeclaration, selector?: string, variants?: Array<string>): Promise<void>;
    static list(key: string): Promise<object>;
}
//# sourceMappingURL=font.d.ts.map