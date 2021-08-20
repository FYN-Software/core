export declare class Vector2 {
    private _x;
    private _y;
    constructor(x: number, y?: number);
    normalize(): Vector2;
    max(max?: number): Vector2;
    add(x: number | Vector2, y?: number): Vector2;
    subtract(x: number | Vector2, y?: number): Vector2;
    multiply(x: number | Vector2, y?: number): Vector2;
    dotProduct(b: Vector2): number;
    [Symbol.iterator](): Generator<number, void, unknown>;
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get points(): [number, number];
    get magnitude(): number;
    get radians(): number;
    set radians(radians: number);
    get angle(): number;
    set angle(angle: number);
    snapped(steps?: number): number;
    get clone(): Vector2;
    static get normalized(): Vector2;
}
//# sourceMappingURL=math.d.ts.map