import Vec3 from "./Vec3";

class Vec4 extends Vec3 {

    protected _w: number;

    public constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super(x, y, z);
        this._w = w;
    }

    public get w() : number {
        return this._w;
    }

    public set w(w: number) {
        this._w = w;
    }

    public assign(v: Vec4): void {
        super.assign(v);
        this._w = v.w
    }

    public equals(v: Vec4): boolean {
        return super.equals(v) && this._w === v.w;
    }

    public sum(v: Vec4): Vec4 {
        return new Vec4(this._x + v.x, this._y + v.y, this._z + v.z, this._w + v.w);
    }

    public sub(v: Vec4): Vec4 {
        return new Vec4(this._x - v.x, this._y - v.y, this._z - v.z, this._w - v.w);
    }

    public mult(v: number): Vec4 {
        return new Vec4(this._x*v, this._y*v, this._z*v, this._w*v);
    }

    public div(v: number): Vec4 {
        return new Vec4(this._x/v, this._y/v, this._z/v, this._w/v);
    }

    public dot(v: Vec4): number {
        return super.dot(v) + this._w*v.w;
    }

    public module(): number {
        return Math.sqrt(this._x ** 2 + this._y ** 2 + this._z ** 2 + this._w ** 2);
    }
    
}

export default Vec4;