export default class Exception extends Error implements IException {
    private readonly _inner;
    private readonly _owner;
    constructor(message: string, inner: Exception, owner: any);
}
//# sourceMappingURL=exception.d.ts.map