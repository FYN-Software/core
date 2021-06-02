export default class Exception extends Error {
    constructor(message, inner, owner) {
        super(message);
        this._inner = inner;
        this._owner = owner;
    }
}
//# sourceMappingURL=exception.js.map