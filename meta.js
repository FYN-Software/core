export default class Meta
{
    #document;

    constructor(document)
    {
        this.#document = document;

        return new Proxy({}, {
            get: (_, name) => this.#document.querySelector(`meta[name="${name}"]`)?.getAttribute('content'),
            set: (_, name, value) => {
                const el = this.#document.querySelector(`meta[name="${name}"]`);

                if(el !== null)
                {
                    el.setAttribute('content', value);
                    return true;
                }

                const meta = this.#document.createElement('meta');
                meta.setAttribute('name', name);
                meta.setAttribute('content', value);

                this.#document.head.appendChild(meta);

                return true;
            },
        });
    }
}