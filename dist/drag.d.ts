declare type Reference = {
    reference: Element;
    container: Element;
    action: 'append' | 'insert';
};
declare type DragDraggableConfig = {
    query?: string;
    effect?: DataTransfer['dropEffect'];
    start?: (e: DragEvent, t: Element) => any;
};
declare type DragOnConfig = {
    offset?: number;
    enter?: (e: DragEvent) => any;
    move?: (e: Reference & {
        x: number;
        y: number;
    }) => any;
    leave?: (e: DragEvent) => any;
    drop?: (e: Reference & {
        marker: Node;
        dragged: Node;
        effect?: DataTransfer['effectAllowed'];
        type: DataTransferItem['type'];
        result: any;
        x: number;
        y: number;
        path: Array<EventTarget>;
    }) => any;
};
export default class Drag {
    private static _marker;
    private static _dragged;
    private static _allowedToEffect;
    private static _getReference;
    static draggable(target: Node, scope: string, config: DragDraggableConfig): void;
    static on(target: Node, scope: string, config: DragOnConfig): void;
}
export {};
//# sourceMappingURL=drag.d.ts.map