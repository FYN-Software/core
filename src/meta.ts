export default class Meta
{
    public static for(document: Document)
    {
        return new Proxy({}, {
            get: (_: {}, name: string) => document.querySelector(`meta[name="${name}"]`)?.getAttribute('content'),
            set: (_: {}, name: string, value) => {
                const el = document.querySelector(`meta[name="${name}"]`);

                if(el !== null)
                {
                    el.setAttribute('content', value);
                    return true;
                }

                const meta = document.createElement('meta');
                meta.setAttribute('name', name);
                meta.setAttribute('content', value);

                document.head.appendChild(meta);

                return true;
            },
        });
    }
}