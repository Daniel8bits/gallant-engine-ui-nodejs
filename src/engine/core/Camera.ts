import Transform from "../math/Transform"
import Vec3 from "../math/Vec3"

class Camera {

    private _transform: Transform

    public constructor(translation: Vec3, rotation: Vec3) {
        this._transform = new Transform(translation, rotation, new Vec3(1, 1, 1))
    }

    public getTransform() : Transform {
        return this._transform
    }

}

export default Camera