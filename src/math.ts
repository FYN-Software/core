export class Vector2
{
    private _x: number;
    private _y: number;

    constructor(x: number, y?: number)
    {
        this._x = x;
        this._y = y ?? x;
    }

    normalize(): Vector2
    {
        if(this.magnitude === 0)
        {
            return Vector2.normalized;
        }

        let f = this.magnitude;

        return new Vector2(this.x / f, this.y / f);
    }

    max(max: number = 1): Vector2
    {
        return this.multiply(1 / Math.max(1, this.magnitude / max));
    }

    add(x: number|Vector2, y?: number): Vector2
    {
        if(x instanceof Vector2)
        {
            y = x.y;
            x = x.x;
        }
        else if(Number.isNaN(x) === false && y === undefined)
        {
            y = x;
        }

        return new Vector2(this.x + x, this.y + y!);
    }

    subtract(x: number|Vector2, y?: number): Vector2
    {
        if(x instanceof Vector2)
        {
            y = x.y;
            x = x.x;
        }
        else if(Number.isNaN(x) === false && y === undefined)
        {
            y = x;
        }

        return new Vector2(this.x - x, this.y - y!);
    }

    multiply(x: number|Vector2, y?: number): Vector2
    {
        if(x instanceof Vector2)
        {
            y = x.y;
            x = x.x;
        }
        else if(Number.isNaN(x) === false && y === undefined)
        {
            y = x;
        }

        return new Vector2(this.x * x, this.y * y!);
    }

    dotProduct(b: Vector2): number
    {
        return this.x * b.x + this.y * b.y;
    }

    *[Symbol.iterator]()
    {
        yield this.x;
        yield this.y;
    }

    get x(): number
    {
        return this._x;
    }

    set x(x: number)
    {
        this._x = x;
    }

    get y(): number
    {
        return this._y;
    }

    set y(y: number)
    {
        this._y = y;
    }

    get points(): [ number, number ]
    {
        return [ this.x, this.y ];
    }

    get magnitude(): number
    {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    get radians(): number
    {
        return Math.atan2(this.y, this.x);
    }

    set radians(radians: number)
    {
        let magnitude = this.magnitude;

        this.x = magnitude * Math.cos(radians);
        this.y = magnitude * Math.sin(radians);
    }

    get angle(): number
    {
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    }

    set angle(angle: number)
    {
        let magnitude = this.magnitude;

        this.x = magnitude * Math.cos(angle * Math.PI / 180);
        this.y = magnitude * Math.sin(angle * Math.PI / 180);
    }

    snapped(steps: number = 8): number
    {
        const interval = 360 / (Math.abs(steps) % 360);
        return this.clone.angle = (Math.round((this.angle % 360 + 180) / interval) * interval - 180);
    }

    get clone(): Vector2
    {
        return new Vector2(this.x, this.y);
    }

    static get normalized(): Vector2
    {
        return new Vector2(Math.sqrt(2));
    }
}