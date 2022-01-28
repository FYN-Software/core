

export default class Exception extends Error implements IException
{
    readonly #inner;
    readonly #owner;

    constructor(message: string, inner?: Exception, owner?: any)
    {
        super(message);

        this.#inner = inner;
        this.#owner = owner;
    }
}