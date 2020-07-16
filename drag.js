export default class Drag
{
    static #marker = DocumentFragment.fromString('<div style="border: 1px solid var(--info-bg);"></div>').children[0];
    static #dragged = new Map();
    static #allowedToEffect = {
        all: 'copy',
        copy: 'copy',
        move: 'move',
        none: 'none',
    };
    static #getReference = (node, x, y) => {
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
                if(child === Drag.#marker)
                {
                    continue;
                }

                const rect = child.getBoundingClientRect();

                if( // NOTE(Chris Kruining) This had 'dead-spots' in the corner regions, maybe we want to fix that?
                    (x < (rect.left + rect.width / 2) && y >= rect.top && y <= rect.bottom) ||
                    (y < (rect.top + rect.height / 2) && x >= rect.left && x <= rect.right)
                ) {
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

        return {
            reference,
            container,
            action: container === reference
                ? 'append'
                : 'insert',
        };
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

                    Drag.#dragged.set(scope, e.target);
                }
            },
            // dragend: async (e, t) => {
            //     console.log('WHAT?!', config.end)
            //
            //     config.end?.invoke(e, t);
            //
            //     await Promise.delay(1);
            //
            //     // Drag.#marker.remove();
            // },
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
                    config.move?.invoke({ x: e.x, y: e.y, ...Drag.#getReference(target, e.x, e.y) });
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

                const promises = [];

                for(const item of e.dataTransfer.items)
                {
                    if(item.type !== scope && (scope === 'Files' && item.kind === 'file') === false)
                    {
                        continue;
                    }

                    const cb = async r => await config.drop?.invoke({
                        marker: Drag.#marker,
                        dragged: Drag.#dragged.get(scope),
                        ...Drag.#getReference(target, e.x, e.y),
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

                // NOTE(Chris Kruining) This might cause a bug where the marker is left behind unwanted, but initial testing shows this is not an issue.
                if(promises.length === 0)
                {
                    return;
                }

                await Promise.all(promises);

                Drag.#marker.remove();

                e.dataTransfer.clearData();
            },
        });
    }
}