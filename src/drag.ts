const defaultMarker = document.createElement('div');
defaultMarker.style.border = '1px solid var(--info-bg)';

type Reference = {
    reference: Element;
    container: Element;
    action: 'append'|'insert';
};

type DragDraggableConfig = {
    query?: string,
    effect?: DataTransfer['dropEffect'],
    start?: (e: DragEvent, t: Element) => any,
};

type DragOnConfig = {
    offset?: number;
    enter?: (e: DragEvent) => any,
    move?: (e: Reference & { x: number, y: number }) => any,
    leave?: (e: DragEvent) => any,
    drop?: (e: Reference & {
        marker: Node,
        dragged: Node,
        effect?: DataTransfer['effectAllowed'],
        type: DataTransferItem['type'],
        result: any,
        x: number,
        y: number,
        path: Array<EventTarget>,
    }) => any,
};

export default class Drag
{
    private static _marker = defaultMarker;
    private static _dragged: Map<string, Node> = new Map();
    private static _allowedToEffect: { [key in DataTransfer['effectAllowed']]: DataTransfer['dropEffect'] } = {
        all: 'copy',
        copy: 'copy',
        move: 'move',
        none: 'none',
        copyLink: 'copy',
        copyMove: 'move',
        link: 'copy',
        linkMove: 'move',
        uninitialized: 'none',
    };

    private static _getReference(node: Node, x: number, y: number): Reference
    {
        const offset = 25;
        let reference: Element = document.elementFromPoint(x, y)!;
        let container: Element;
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
                if(child === Drag._marker)
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
            container = reference.parentElement!;
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

    public static draggable(target: Node, scope: string, config: DragDraggableConfig)
    {
        const { query = '*', effect = 'move' } = config;

        target.on(query, {
            options: {
                passive: false,
            },
            dragstart: (e: DragEvent, t: Element) => {
                const value: any = config.start?.(e, t) ?? undefined;

                if(value !== undefined && e.dataTransfer !== null)
                {
                    e.dataTransfer.effectAllowed = effect;
                    e.dataTransfer.setData(scope, JSON.stringify(value));

                    Drag._dragged.set(scope, e.target! as Node);
                }
            },
        });
    }

    public static on(target: Node, scope: string, config: DragOnConfig)
    {
        let valid = false;
        const last = { x: 0, y: 0 };

        target.on({
            options: {
                passive: false,
            },
            dragenter: async (e: DragEvent) => {
                valid = false;

                if(e.composedPath().includes(target) === false || e.dataTransfer?.types.every(t => t !== scope))
                {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                await Promise.delay(1);

                valid = true;

                config.enter?.(e);
            },
            dragover: (e: DragEvent) => {
                if(valid === false)
                {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                if(e.dataTransfer === null)
                {
                    return;
                }

                e.dataTransfer.dropEffect = Drag._allowedToEffect[e.dataTransfer.effectAllowed];

                if(last.x === e.x && last.y === e.y)
                {
                    return;
                }

                last.x = e.x;
                last.y = e.y;

                if(valid)
                {
                    config.move?.({ x: e.x, y: e.y, ...Drag._getReference(target, e.x, e.y) });
                }
            },
            dragleave: async (e: DragEvent) => {
                if(e.composedPath().includes(target) === false || e.dataTransfer?.types.every(t => t !== scope))
                {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                valid = false;

                config.leave?.(e);
            },
            drop: async (e: DragEvent) => {
                e.preventDefault();

                const promises = [];

                for(const item of e.dataTransfer?.items ?? [])
                {
                    if(item.type !== scope && (scope === 'Files' && item.kind === 'file') === false)
                    {
                        continue;
                    }

                    const cb = async (r: any) => await config.drop?.({
                        ...Drag._getReference(target, e.x, e.y),
                        marker: Drag._marker,
                        dragged: Drag._dragged.get(scope)!,
                        effect: e.dataTransfer?.effectAllowed,
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

                Drag._marker.remove();

                e.dataTransfer?.clearData();
            },
        });
    }
}