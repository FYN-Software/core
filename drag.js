export default class Drag
{
    static #marker = DocumentFragment.fromString('<div style="border: 1px solid var(--info-bg);"></div>').children[0];
    static #allowedToEffect = {
        all: 'copy',
        copy: 'copy',
        move: 'move',
        none: 'none',
    };
    static #placeMarker = (node, x, y) => {
        const offset = 25;
        let reference = node.getRootNode().elementFromPoint(x, y);
        let container;
        const rect = reference.getBoundingClientRect();
        const test = new DOMRect(
            rect.x + offset,
            rect.y + offset,
            rect.width - offset * 2,
            rect.height - offset * 2,
        );

        if(x >= test.left && x <= test.right && y >= test.top && y <= test.bottom)
        {
            container = reference;

            for(const child of reference.children)
            {
                const rect = child.getBoundingClientRect();

                if(x < rect.left + rect.width / 2 || y < rect.top + rect.height / 2)
                {
                    reference = child;

                    break;
                }

                reference = container;
            }
        }
        else
        {
            container = reference.parentElement;
            reference = x < test.left || y < test.top
                ? reference
                : reference.nextElementSibling ?? container;
        }

        if(container === Drag.#marker)
        {
            return;
        }

        if(container === reference)
        {
            container.appendChild(Drag.#marker);
        }
        else
        {
            container.insertBefore(Drag.#marker, reference);
        }
    };

    static draggable(target, scope, config)
    {
        const { query = '*', effect = 'move' } = config;

        target.on(query, {
            options: {
                passive: false,
            },
            dragstart: (e, t) => {
                const value = config.start?.invoke(e, t) ?? undefined;

                if(value !== undefined)
                {
                    e.dataTransfer.effectAllowed = effect;
                    e.dataTransfer.setData(scope, JSON.stringify(value));
                }
            },
            dragend: (e, t) => {
                config.end?.invoke(e, t);
            },
        });
    }

    static on(target, scope, config)
    {
        let valid = false;
        const last = { x: 0, y: 0 };

        target.on({
            options: {
                passive: false,
            },
            dragenter: async e => {
                valid = false;

                if(e.composedPath().includes(target) === false || e.dataTransfer.types.every(t => t !== scope))
                {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                await Promise.delay(1);

                valid = true;

                config.enter?.invoke(e);
            },
            dragover: e => {
                if(valid === false)
                {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = Drag.#allowedToEffect[e.dataTransfer.effectAllowed];

                if(last.x === e.x && last.y === e.y)
                {
                    return;
                }

                last.x = e.x;
                last.y = e.y;

                if(valid)
                {
                    Drag.#placeMarker(target, e.x, e.y);
                    config.move?.invoke({ x: e.x, y: e.y });
                }
            },
            dragleave: async e => {
                if(e.composedPath().includes(target) === false || e.dataTransfer.types.every(t => t !== scope))
                {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                valid = false;

                config.leave?.invoke(e);
            },
            drop: async e => {
                e.preventDefault();
                e.stopPropagation();

                const promises = [];

                for(const item of e.dataTransfer.items)
                {
                    if(item.type !== scope && scope !== 'Files')
                    {
                        continue;
                    }

                    const cb = async r => await config.drop?.invoke({
                        marker: Drag.#marker,
                        effect: e.dataTransfer.effectAllowed,
                        type: item.type,
                        result: r,
                        x: e.x,
                        y: e.y,
                        path: e.composedPath()
                    });

                    switch (item.kind)
                    {
                        case 'string':
                            promises.push(new Promise(res => item.getAsString(async r => res(await cb(JSON.parse(r))))));
                            break;

                        case 'file':
                            promises.push(cb(item.getAsFile()));
                            break;
                    }
                }

                await Promise.all(promises);

                marker.remove();

                e.dataTransfer.clearData();
            },
        });
    }
}