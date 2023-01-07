import Mat4 from "./Mat4";
import Vec2 from "./Vec2";

class Vec3 extends Vec2 {

    protected _z: number;

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y);
        this._z = z;
    }

    public get z(): number {
        return this._z;
    }

    public set z(z: number) {
        this._z = z;
    }

    public assign(v: Vec3): void {
        super.assign(v);
        this._z = v.z
    }

    public equals(v: Vec3): boolean {
        return super.equals(v) && this._z === v.z;
    }

    public sum(v: Vec3): Vec3 {
        return new Vec3(this._x + v.x, this._y + v.y, this._z + v.z);
    }

    public sub(v: Vec3): Vec3 {
        return new Vec3(this._x - v.x, this._y - v.y, this._z - v.z);
    }

    public mult(v: number): Vec3 {
        return new Vec3(this._x * v, this._y * v, this._z * v);
    }

    public div(v: number): Vec3 {
        return new Vec3(this._x / v, this._y / v, this._z / v);
    }

    public cross(v: Vec3): Vec3 {
        return new Vec3(
            this._y * v.z - this._z * v.y,
            this._z * v.x - this._x * v.z,
            this._x * v.y - this._y * v.x,
        );
    }

    public dot(v: Vec3): number {
        return super.dot(v) + this._z * v.z;
    }

    public module(): number {
        return Math.sqrt(this._x ** 2 + this._y ** 2 + this._z ** 2);
    }

    public normalize(): Vec3 {
        return this.div(this.module());
    }

    public lookAt(to: Vec3, tmp: Vec3 = new Vec3(0, 1, 0)): Mat4 {
        const matrix: Mat4 = new Mat4();

        const forward = this.sub(to).normalize();
        const right = tmp.normalize().cross(forward);
        const up = forward.cross(right).normalize();

        matrix.set([0, 0], right.x); 
        matrix.set([0, 1], right.y); 
        matrix.set([0, 2], right.z); 
        matrix.set([1, 0], up.x); 
        matrix.set([1, 1], up.y); 
        matrix.set([1, 2], up.z); 
        matrix.set([2, 0], forward.x); 
        matrix.set([2, 1], forward.y); 
        matrix.set([2, 2], forward.z); 
    
        matrix.set([3, 0], this.x); 
        matrix.set([3, 1], this.y); 
        matrix.set([3, 2], this.z); 

        return matrix;
    }

    public invert(): Vec3 {
        return new Vec3(-this._x, -this._y, -this._z)
    }

}

export default Vec3;