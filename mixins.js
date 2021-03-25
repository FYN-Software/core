import { objectFromEntries } from '@fyn-software/core/extends.js';

const constructors = Symbol('constructors');

export const mix = (...classes) => {
    let wrapped;

    return class
    {
        constructor(...args)
        {
            this[constructors] = Array.from(this.constructor.classes.values())
                .map(c => new c(...args));

            return new Proxy(this, {
                get: (c, p) => {
                    const constructor = this[constructors].find(c => p in c);

                    if(constructor === undefined)
                    {
                        return;
                    }

                    let prop = constructor[p];

                    if(typeof prop === 'function')
                    {
                        prop = prop.bind(constructor);
                    }

                    return prop;
                },
                set: (c, p, v) => {
                    this[constructors].find(c => p in c)[p] = v;

                    return true;
                },
                has: (c, p) => this[constructors].some(c => p in c),
            });
        }

        static _(c)
        {
            return this.classes.get(c.name);
        }

        static get classes()
        {
            if(wrapped === undefined)
            {
                wrapped = new Map(classes.map(c => [
                    c.name,
                    Object.defineProperties(
                        class extends c
                        {
                            static get [Symbol.species]()
                            {
                                console.log(this);

                                return this;
                            }

                            static [Symbol.toStringTag]()
                            {
                                console.log(this);

                                return this;
                            }

                            [Symbol.toStringTag]()
                            {
                                console.log(this);

                                return this;
                            }

                            [Symbol.toPrimitive]()
                            {
                                console.log(this);

                                return this;
                            }
                        },
                        objectFromEntries(
                            Object.entries(Object.getOwnPropertyDescriptors(this))
                                .filter(([k, v]) => v.configurable)
                        )
                    )
                ]));
            }

            return wrapped;
        }

        static get [Symbol.species]()
        {
            console.log(this);

            return this;
        }

        static [Symbol.toStringTag]()
        {
            console.log(this);

            return this;
        }
    }
};

export const abstract = C => class extends C
{
    constructor()
    {
        if(new.target === C)
        {
            throw new Error(`'${C.name}' is abstract, needs an concrete implementation to function properly`);
        }

        super();
    }
};