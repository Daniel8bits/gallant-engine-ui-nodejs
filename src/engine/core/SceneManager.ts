import RenderStrategy from "../renderer/RenderStrategy";
import Scene from "./Scene";


class SceneManager {

    /* All entities */
    private _scenes: Map<string, Scene>;
    /* Active scene: the scene that is being rendered currently */
    private _active: Scene;

    private _renderStrategy: RenderStrategy;

    public constructor(renderStrategy: RenderStrategy) {
        this._scenes = new Map<string, Scene>();
        this._active = null;
        this._renderStrategy = renderStrategy;
    }

    public render(): void {
        this._renderStrategy.setScene(this._active)
        this._renderStrategy.render();
    }

    public update(time: number, delta: number): void {
        this._active.update(time, delta);
    }

    /**
     * Adds a new scene, not active by default
     * @param scene scene or the name of the scene to be added
     * @param active set de scene to be active
     */
    public add(scene: Scene, active: boolean = false): SceneManager {
        const key: string = this._validate(scene);
        this._scenes.set(key, scene);
        if(active) {
            this._active = scene;
        }
        return this
    }

    /**
     * Remove an existent scene
     * @param scene scene or the name of the scene to be removed
     */
    public remove(scene: Scene|string): SceneManager {
        const key: string = this._validate(scene, false);
        this._scenes.delete(key);
        if(this._active.getName() === key) {
            this._active = null;
        }
        return this
    }

    /**
     * Sets the active scene
     * @param scene scene or the name of the scene to become active
     */
    public setActive(scene: Scene|string): SceneManager|never {
        const key: string = this._validate(scene, false);
        this._active = this._scenes.get(key);
        return this
    }

    public getActive(): Scene {
        return this._active;
    }

    /**
     * Returns an existent scene
     * @param scene the name of the scene to be returned
     */
    public get(name: string): Scene {
        this._validate(name, false);
        return this._scenes.get(name);
    }

    /**
     * Returns the keys of all scenes
     */
    public getKeys(): string[] {
        return [...this._scenes.keys()];
    }

    /**
     * Iterates all scenes
     * @param fn do something with each scene
     */
    public forEach(fn: (scene: Scene, key?: string) => void): SceneManager {
        this._scenes.forEach((scene, key) => {
            fn(scene, key);
        })
        return this
    }

    /**
     * Checks if there is a given scene
     * @param scene scene or the name of the scene to be checked
     */
    public has(scene: Scene|string): boolean {
        const name = this._getName(scene);
        return this._scenes.has(name);
    }

    /**
     * Validates the existence or not of a given scene and
     * returns the scene key in case of success.
     * Fail case is defined by 'exists' param.
     * @param scene scene or the name of the scene to be validated
     * @param exists fail case of the validation
     * @returns the scene name
     */
    private _validate(scene: Scene|string, exists: boolean = true): string|never {
        const name = this._getName(scene);
        if(exists && this._scenes.has(name)) {
            throw new Error(`Scene ${name} already exists!`);
        }
        if(!exists && !this._scenes.has(name)) {
            throw new Error(`Scene ${name} does not exists!`);
        }
        return name;
    }

    /**
     * Resolves the scene name
     * @param scene scene or the name of the scene to be resolved
     */
    private _getName(scene: Scene|string): string {
        return scene instanceof Scene ? scene.getName() : scene;
    }

}

export default SceneManager;