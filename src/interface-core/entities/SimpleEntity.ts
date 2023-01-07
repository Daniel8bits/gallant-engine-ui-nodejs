import VAO from "@engine/buffer/VAO";
import Entity from "@engine/core/Entity";
import { toRadian } from "@engine/math/math";
import Transform from "@engine/math/Transform";
import Vec3 from "@engine/math/Vec3";
import Renderer from "@engine/renderer/Renderer";
import Shader from "@engine/tools/Shader";

class SimpleEntity extends Entity {

    private _id: number

    private _selected: boolean

    private _previousTransform: Transform
    private _entityMovement: Transform

    private _pitch: number
    private _angleAround: number

    private _shouldAnimate: boolean

    public constructor(name: string, vao: VAO, shader: Shader, renderer: Renderer) {
        super(name, vao, shader, renderer);
        this._id = 0;
        this._selected = false
        this._previousTransform = new Transform(new Vec3(), new Vec3(), new Vec3(1, 1, 1));
        this._entityMovement = new Transform(new Vec3(), new Vec3(), new Vec3(1, 1, 1));
        this._pitch = 0;
        this._angleAround = 0;
        this._shouldAnimate = false
    }

    public update(time: number, delta: number): void {

        if(this._shouldAnimate) {
            this._animate(delta)
        }

        this._entityMovement.setTranslation(
            this.getTransform().getTranslation().sub(this._previousTransform.getTranslation())
        )
        this._entityMovement.setRotation(
            this.getTransform().getRotation().sub(this._previousTransform.getRotation())
        )
        this._entityMovement.setScale(
            this.getTransform().getScale().sub(this._previousTransform.getScale())
        )

        this._previousTransform.setTranslation(this.getTransform().getTranslation())
        this._previousTransform.setRotation(this.getTransform().getRotation())
        this._previousTransform.setScale(this.getTransform().getScale())

    }

    private _animate(delta : number) {
        
        this._angleAround += 30 * delta

        if(this._angleAround >= 360) {
            this._angleAround %= 360
        }
        else if(this._angleAround < 0) {
            this._angleAround %= 360
            this._angleAround = 360 + this._angleAround
        }

        const horizontalDistance = 10 * Math.cos(toRadian(0))
        const offsetX = horizontalDistance * Math.sin(toRadian(this._angleAround))
        const offsetZ = horizontalDistance * Math.cos(toRadian(this._angleAround))
        const center = new Vec3()

        this.getTransform().setTranslation(new Vec3(
            center.x + offsetX,
            Math.sin(Math.PI * toRadian(this._angleAround)) * 2,
            center.z + offsetZ
        ))

        this.getTransform().setRotation(new Vec3(
            this._pitch,
            180-this._angleAround
        ))

    }

    public getId(): number {
        return this._id;
    }

    public setId(id: number): void {
        this._id = id
    }

    public isSelected(): boolean {
        return this._selected;
    }

    public setSelected(selected: boolean): void {
        this._selected = selected
    }

    public shouldAnimate(): boolean {
        return this._shouldAnimate;
    }

    public setAnimate(shouldAnimate: boolean): void {
        this._shouldAnimate = shouldAnimate
    }

    public getMovement(): Transform {
        return this._entityMovement
    }
}

export default SimpleEntity