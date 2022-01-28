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
export declare function draggable(target: Node, scope: string, config: DragDraggableConfig): void;
export declare function on(target: Node, scope: string, config: DragOnConfig): void;
export {};
//# sourceMappingURL=drag.d.ts.map