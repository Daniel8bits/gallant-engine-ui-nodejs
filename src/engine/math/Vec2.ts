
class Vec2 {

    protected _x: number;
    protected _y: number;

    public constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }
    
    public get x() : number {
        return this._x;
    }

    public get y() : number{
        return this._y;
    }

    public set x(x: number) {
        this._x = x;
    }

    public set y(y: number) {
        this._y = y;
    }

    public assign(v: Vec2): void {
        this._x = v.x 
        this._y = v.y;
    }

    public equals(v: Vec2): boolean {
        return this._x === v.x && this._y === v.y;
    }
    
    public sum(v: Vec2): Vec2 {
        return new Vec2(this._x + v.x, this._y + v.y);
    }

    public sub(v: Vec2): Vec2 {
        return new Vec2(this._x - v.x, this._y - v.y);
    }

    public mult(v: number): Vec2 {
        return new Vec2(this._x*v, this._y*v);
    }

    public div(v: number): Vec2 {
        return new Vec2(this._x/v, this._y/v);
    }

    public dot(v: Vec2): number {
        return this._x*v.x + this._y*v.y;
    }

    public module(): number {
        return Math.sqrt(this._x ** 2 + this._y ** 2);
    }

    public normalize(): Vec2 {
        return this.div(this.module())
    }

}

export default Vec2;