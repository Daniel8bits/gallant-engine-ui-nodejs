import Material from "gallant-engine/dist/src/appearance/material/Material"
import VAO from "gallant-engine/dist/src/buffer/VAO"
import Entity from "gallant-engine/dist/src/core/entities/Entity"
import { toRadians, Vector3 } from "gallant-engine/dist/src/math/LA"
import Orientation from "gallant-engine/dist/src/math/Orientation"
import Transform from "gallant-engine/dist/src/math/Transform"
import Renderer from "gallant-engine/dist/src/renderer/Renderer"


class SimpleEntity extends Entity {

    private _id: number

    private _selected: boolean

    private _previousTransform: Transform
    private _entityMovement: Transform

    private _pitch: number
    private _angleAround: number

    private _shouldAnimate: boolean

    public constructor(name: string, vao: VAO, material: Material, renderer: Renderer) {
        super(name, vao, material, renderer);
        this._id = 0;
        this._selected = false
        this._previousTransform = new Transform(new Vector3(), new Orientation(), new Vector3(1, 1, 1));
        this._entityMovement = new Transform(new Vector3(), new Orientation(), new Vector3(1, 1, 1));
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

        const horizontalDistance = 10 * Math.cos(toRadians(0))
        const offsetX = horizontalDistance * Math.sin(toRadians(this._angleAround))
        const offsetZ = horizontalDistance * Math.cos(toRadians(this._angleAround))
        const center = new Vector3()

        this.getTransform().setTranslation(new Vector3(
            center.x + offsetX,
            Math.sin(Math.PI * toRadians(this._angleAround)) * 2,
            center.z + offsetZ
        ))

        this.getTransform().setRotation(new Orientation(
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