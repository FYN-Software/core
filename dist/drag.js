import { delay } from './function/promise.js';
const defaultMarker = document.createElement('div');
defaultMarker.style.border = '1px solid var(--info-bg)';
const marker = defaultMarker;
const dragged = new Map();
const allowedToEffect = {
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
function getReference(node, x, y) {
    const offset = 25;
    let reference = document.elementFromPoint(x, y);
    let container;
    const rect = reference.getBoundingClientRect();
    const test = new DOMRect(rect.x + offset, rect.y + offset, rect.width - offset * 2, rect.height - offset * 2);
    if (x >= test.left && x <= test.right && y >= test.top && y <= test.bottom) {
        container = reference;
        for (const child of reference.children) {
            if (child === marker) {
                continue;
            }
            const rect = child.getBoundingClientRect();
            if ((x < (rect.left + rect.width / 2) && y >= rect.top && y <= rect.bottom) ||
                (y < (rect.top + rect.height / 2) && x >= rect.left && x <= rect.right)) {
                reference = child;
                break;
            }
            reference = container;
        }
    }
    else {
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
}
;
export function draggable(target, scope, config) {
    const { query = '*', effect = 'move' } = config;
    target.on(query, {
        options: {
            passive: false,
        },
        dragstart: (e, t) => {
            const value = config.start?.(e, t) ?? undefined;
            if (value !== undefined && e.dataTransfer !== null) {
                e.dataTransfer.effectAllowed = effect;
                e.dataTransfer.setData(scope, JSON.stringify(value));
                dragged.set(scope, e.target);
            }
        },
    });
}
export function on(target, scope, config) {
    let valid = false;
    const last = { x: 0, y: 0 };
    target.on({
        options: {
            passive: false,
        },
        dragenter: async (e) => {
            valid = false;
            if (e.composedPath().includes(target) === false || e.dataTransfer?.types.every(t => t !== scope)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            await delay(1);
            valid = true;
            config.enter?.(e);
        },
        dragover: (e) => {
            if (valid === false) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer === null) {
                return;
            }
            e.dataTransfer.dropEffect = allowedToEffect[e.dataTransfer.effectAllowed];
            if (last.x === e.x && last.y === e.y) {
                return;
            }
            last.x = e.x;
            last.y = e.y;
            if (valid) {
                config.move?.({ x: e.x, y: e.y, ...getReference(target, e.x, e.y) });
            }
        },
        dragleave: async (e) => {
            if (e.composedPath().includes(target) === false || e.dataTransfer?.types.every(t => t !== scope)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            valid = false;
            config.leave?.(e);
        },
        drop: async (e) => {
            e.preventDefault();
            const promises = [];
            for (const item of e.dataTransfer?.items ?? []) {
                if (item.type !== scope && (scope === 'Files' && item.kind === 'file') === false) {
                    continue;
                }
                const cb = async (r) => await config.drop?.({
                    ...getReference(target, e.x, e.y),
                    marker,
                    dragged: dragged.get(scope),
                    effect: e.dataTransfer?.effectAllowed,
                    type: item.type,
                    result: r,
                    x: e.x,
                    y: e.y,
                    path: e.composedPath()
                });
                switch (item.kind) {
                    case 'string':
                        promises.push(new Promise(res => item.getAsString(async (r) => res(await cb(JSON.parse(r))))));
                        break;
                    case 'file':
                        promises.push(cb(item.getAsFile()));
                        break;
                }
            }
            if (promises.length === 0) {
                return;
            }
            await Promise.all(promises);
            marker.remove();
            e.dataTransfer?.clearData();
        },
    });
}
//# sourceMappingURL=drag.js.map