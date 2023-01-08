
import Entity from "gallant-engine/dist/src/core/entities/Entity";
import Camera from "gallant-engine/dist/src/core/Camera";
import Transform from "gallant-engine/dist/src/math/Transform";
import Orientation from "gallant-engine/dist/src/math/Orientation";
import {Vector3} from "gallant-engine/dist/src/math/LA";
import Razor from "gallant-engine/dist/src/core/Razor";
import { toRadians } from "gallant-engine/dist/src/math/math";
import InputManager, { Keys } from "gallant-engine/dist/src/core/InputManager";
import CameraManager from "./CameraManager";
import SimpleEntity from "./entities/SimpleEntity";

class CanvasCamera extends Camera {

    public static readonly MODE = {
        FIRST_PERSON: 0,
        THIRD_PERSON: 1,
    }
    
    private _name: string
    private _selected: boolean

    private _speed: number
    private _sensitivity: number
    private _pitch: number
    private _angleAround: number

    private _cameraObserver: (transform: Transform) => void
    
    private _lockedIn: Entity
    private _mode: number
    private _lookAt: boolean

    private _cameraManager: CameraManager

    public constructor(
        name: string, 
        cameraManager: CameraManager,
        cameraObserver: (transform: Transform) => void
    ) {
        super(new Vector3(), new Orientation())
        this._name = name
        this._cameraManager = cameraManager
        this._speed = 10
        this._sensitivity = 7.5
        this._pitch = 0
        this._cameraObserver = cameraObserver
        this._selected = false;
        this._lockedIn = null
        this._mode = CanvasCamera.MODE.FIRST_PERSON
        this._lookAt = false
        this._angleAround = 0
    }

    public update(delta: number) {

        if(this._mode === CanvasCamera.MODE.FIRST_PERSON) {
            this._firstPersonMovement(delta)
        }

        if(this._mode === CanvasCamera.MODE.THIRD_PERSON) {
            this._thirdPersonMovement(delta)
        }

        if(this._selected && this._cameraObserver && Razor.IS_MOUSE_INSIDE) {
            this._cameraObserver(this.getTransform())
        }

    }

    private _firstPersonMovement(delta: number): void {

        if(this._cameraManager.getActive().getName() === this._name) {
            const x = Math.sin(toRadians(this.getTransform().getRotation().y)) * this._speed * delta;
            const z = Math.cos(toRadians(this.getTransform().getRotation().y)) * this._speed * delta;
    
            if(InputManager.isKeyPressed(Keys.KEY_W)){ // FRONT
                const translation = this.getTransform().getTranslation()
                translation.x += -x;
                translation.z += -z;
                this.getTransform().setTranslation(translation)
            }
    
            if(InputManager.isKeyPressed(Keys.KEY_S)){ // BACK
                const translation = this.getTransform().getTranslation()
                translation.x += x;
                translation.z += z;
                this.getTransform().setTranslation(translation)
            }
    
            if(InputManager.isKeyPressed(Keys.KEY_A)){ // LEFT
                const translation = this.getTransform().getTranslation()
                translation.x += -z;
                translation.z += x;
                this.getTransform().setTranslation(translation)
            }
    
            if(InputManager.isKeyPressed(Keys.KEY_D)){ // RIGHT
                const translation = this.getTransform().getTranslation()
                translation.x += z;
                translation.z += -x;
                this.getTransform().setTranslation(translation)
            }
    
            if(InputManager.isKeyPressed(Keys.KEY_SPACE)){ // UP
                const translation = this.getTransform().getTranslation()
                translation.y += this._speed * delta;
                this.getTransform().setTranslation(translation)
            }
    
            if(InputManager.isKeyPressed(Keys.KEY_ALT_L)){ // DOWN
                const translation = this.getTransform().getTranslation()
                translation.y += -this._speed * delta;
                this.getTransform().setTranslation(translation)
            }
    
            if(InputManager.isMouseLeft()) {
                const dx = InputManager.getMouseDX() 
                const dy = InputManager.getMouseDY() 
        
                this.getTransform().setRotation(
                    this.getTransform().getRotation().add(new Orientation(
                        dy * this._sensitivity * delta, 
                        dx * this._sensitivity * delta,
                        0
                    ))
                )
            }
        }

    }

    private _thirdPersonMovement(delta: number): void {

        if(
            (InputManager.isMouseLeft() && !this._lookAt) && 
            this._cameraManager.getActive().getName() === this._name
        ) {
            this._angleAround -= InputManager.getMouseDX() * this._sensitivity*2 * delta
            this._pitch -= InputManager.getMouseDY() * this._sensitivity*2 * delta
            if(this._pitch > 45) {
                this._pitch = 45
            }
            else if(this._pitch < -45) {
                this._pitch = -45
            }
        }

        if(this._lookAt) {
            const entity = this._lockedIn as SimpleEntity
            this._angleAround -= entity.getMovement().getTranslation().x
            this._pitch -= entity.getMovement().getTranslation().y*4
            if(this._pitch > 45) {
                this._pitch = 45
            }
            else if(this._pitch < -45) {
                this._pitch = -45
            }
        }

        const horizontalDistance = 10 * Math.cos(toRadians(this._pitch))
        const verticalDistance = 10 * Math.sin(toRadians(this._pitch))
        const theta = this._lockedIn.getTransform().getRotation().y + this._angleAround
        const offsetX = horizontalDistance * Math.sin(toRadians(theta))
        const offsetZ = horizontalDistance * Math.cos(toRadians(theta))
        const entityTranslation = this._lockedIn.getTransform().getTranslation()

        if(!this._lookAt) {
            this.getTransform().setTranslation(new Vector3(
                (entityTranslation.x + offsetX) * -1,
                (entityTranslation.y - verticalDistance) * -1,
                (entityTranslation.z + offsetZ) * -1
            ))
        }

        if(
            InputManager.isMouseLeft() && !this._lookAt &&
            this._cameraManager.getActive().getName() === this._name
        ) { // MOUSE
            this.getTransform().setRotation(new Orientation(
                -this._pitch,
                180+theta
            ))
        }

        if(this._lookAt) { // MOUSE
            const theta = this._lockedIn.getTransform().getRotation().y + this._angleAround*4
            this.getTransform().setRotation(new Orientation(
                this._pitch,
                -theta
            ))
        }

    }

    public isSelected(): boolean {
        return this._selected;
    }

    public setSelected(selected: boolean): void {
        this._selected = selected
    }

    public lock(entity: Entity): void {
        this._lockedIn = entity
        this._mode = CanvasCamera.MODE.FIRST_PERSON

        if(entity) {
            this._mode = CanvasCamera.MODE.THIRD_PERSON
            const translation = entity.getTransform().getTranslation()
            translation.x *= -1
            translation.z += 10
            this.getTransform().setTranslation(translation)
            this.getTransform().setRotation(new Orientation())
            this._angleAround = 180;
        }
        
    }

    public getLockedIn(): Entity {
        return this._lockedIn
    }

    public setLookAt(shouldLookAt: boolean): void {
        this._lookAt = shouldLookAt
    }

    public shouldLookAt(): boolean {
        return this._lookAt
    }

    public setSpeed(speed: number): void {
        this._speed = speed
    }

    public getName(): string {
        return this._name;
    }

}

export default CanvasCamera