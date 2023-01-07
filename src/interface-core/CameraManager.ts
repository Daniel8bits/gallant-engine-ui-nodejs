import RenderStrategy from "@engine/renderer/RenderStrategy";
import CanvasCamera from "./CanvasCamera";


class CameraManager {

    /* All entities */
    private _canvascameras: Map<string, CanvasCamera>;
    /* Active canvascamera: the canvascamera that is being rendered currently */
    private _active: CanvasCamera;

    private _renderStrategy: RenderStrategy;

    public constructor(renderStrategy: RenderStrategy) {
        this._canvascameras = new Map<string, CanvasCamera>();
        this._active = null;
        this._renderStrategy = renderStrategy;
    }

    public render(): void {
        //this._renderStrategy.setCanvasCamera(this._active)
        //this._renderStrategy.render();
    }

    public update(time: number, delta: number): void {
        this._canvascameras.forEach((camera) => {
            camera.update(delta);
        })
        //this._active.update(time, delta);
    }

    /**
     * Adds a new canvascamera, not active by default
     * @param canvascamera canvascamera or the name of the canvascamera to be added
     * @param active set de canvascamera to be active
     */
    public add(canvascamera: CanvasCamera, active: boolean = false): CameraManager {
        const key: string = this._validate(canvascamera);
        this._canvascameras.set(key, canvascamera);
        if(active) {
            this._active = canvascamera;
        }
        return this
    }

    /**
     * Remove an existent canvascamera
     * @param canvascamera canvascamera or the name of the canvascamera to be removed
     */
    public remove(canvascamera: CanvasCamera|string): CameraManager {
        const key: string = this._validate(canvascamera, false);
        this._canvascameras.delete(key);
        if(this._active.getName() === key) {
            this._active = null;
        }
        return this
    }

    /**
     * Sets the active canvascamera
     * @param canvascamera canvascamera or the name of the canvascamera to become active
     */
    public setActive(canvascamera: CanvasCamera|string): CameraManager|never {
        const key: string = this._validate(canvascamera, false);
        this._active = this._canvascameras.get(key);
        return this
    }

    public getActive(): CanvasCamera {
        return this._active;
    }

    /**
     * Returns an existent canvascamera
     * @param canvascamera the name of the canvascamera to be returned
     */
    public get(name: string): CanvasCamera {
        this._validate(name, false);
        return this._canvascameras.get(name);
    }

    /**
     * Returns the keys of all canvascameras
     */
    public getKeys(): string[] {
        return [...this._canvascameras.keys()];
    }

    /**
     * Iterates all canvascameras
     * @param fn do something with each canvascamera
     */
    public forEach(fn: (canvascamera: CanvasCamera, key?: string) => void): CameraManager {
        this._canvascameras.forEach((canvascamera, key) => {
            fn(canvascamera, key);
        })
        return this
    }

    /**
     * Checks if there is a given canvascamera
     * @param canvascamera canvascamera or the name of the canvascamera to be checked
     */
    public has(canvascamera: CanvasCamera|string): boolean {
        const name = this._getName(canvascamera);
        return this._canvascameras.has(name);
    }

    /**
     * Validates the existence or not of a given canvascamera and
     * returns the canvascamera key in case of success.
     * Fail case is defined by 'exists' param.
     * @param canvascamera canvascamera or the name of the canvascamera to be validated
     * @param exists fail case of the validation
     * @returns the canvascamera name
     */
    private _validate(canvascamera: CanvasCamera|string, exists: boolean = true): string|never {
        const name = this._getName(canvascamera);
        if(exists && this._canvascameras.has(name)) {
            throw new Error(`CanvasCamera ${name} already exists!`);
        }
        if(!exists && !this._canvascameras.has(name)) {
            throw new Error(`CanvasCamera ${name} does not exists!`);
        }
        return name;
    }

    /**
     * Resolves the canvascamera name
     * @param canvascamera canvascamera or the name of the canvascamera to be resolved
     */
    private _getName(canvascamera: CanvasCamera|string): string {
        return canvascamera instanceof CanvasCamera ? canvascamera.getName() : canvascamera;
    }

}

export default CameraManager;