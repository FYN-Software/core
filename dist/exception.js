export default class Exception extends Error {
    _inner;
    _owner;
    constructor(message, inner, owner) {
        super(message);
        this._inner = inner;
        this._owner = owner;
    }
}
//# sourceMappingURL=exception.js.map