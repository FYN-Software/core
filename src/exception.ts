

export default class Exception extends Error implements IException
{
    private readonly _inner;
    private readonly _owner;

    constructor(message: string, inner: Exception, owner: any)
    {
        super(message);

        this._inner = inner;
        this._owner = owner;
    }
}