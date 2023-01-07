import Vec3 from "./Vec3"
import Mat4 from "./Mat4"

class Transform {

    private _translation: Vec3;
    private _rotation: Vec3;
    private _scale: Vec3;

    public constructor(translation: Vec3, rotation: Vec3, scale: Vec3) {
        this._translation = translation ?? new Vec3(0, 0, 0);
        this._rotation = rotation ?? new Vec3(0, 0, 0)
        this._scale = scale ?? new Vec3(0, 0, 0)
    }
    
    public getTranslation() : Vec3 {
        return new Vec3(this._translation.x, this._translation.y, this._translation.z)
    }

    public setTranslation(translation: Vec3) {
        this._translation.assign(translation)
    }

    public getRotation() : Vec3 {
        return new Vec3(this._rotation.x, this._rotation.y, this._rotation.z)
    }

    public setRotation(rotation: Vec3) {
        this._fixRotation(rotation.x, (v) => {this._rotation.x = v})
        this._fixRotation(rotation.y, (v) => {this._rotation.y = v})
        this._fixRotation(rotation.z, (v) => {this._rotation.z = v})
    }

    private _fixRotation(v: number, set: (v: number) => void): void {
        if(v >= 360) {
            v %= 360
            v -= 360
        }
        if(v <= -360) {
            v %= 360
            v += 360
        }
        set(v)
    }

    public getScale() : Vec3 {
        return new Vec3(this._scale.x, this._scale.y, this._scale.z)
    }

    public setScale(scale: Vec3) {
        this._scale.assign(scale)
    }

    public toMatrix() : Mat4 {
        return Mat4.transform(this._translation, this._rotation, this._scale)
    }
    

}

export default Transform