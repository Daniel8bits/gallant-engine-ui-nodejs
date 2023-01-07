import Entity from "../core/Entity";
import Scene from "../core/Scene";
import Renderer from "./Renderer"

class RenderStrategy {

    private _renderers: Map<string, Renderer>

    public constructor() {
        this._renderers = new Map<string, Renderer>()
    }

    public render() {
        this._renderers.forEach((renderer) => {
            renderer.render();
        })
    }

    public setScene(scene: Scene) {
        this._renderers.forEach((renderer) => {
            renderer.setScene(scene);
        })
    }

    /**
     * Adds a new renderer
     * @param renderer renderer or the name of the renderer to be added
     */
     public add(renderer: Renderer, active: boolean = false): void {
        const key: string = this._validate(renderer);
        this._renderers.set(key, renderer);
    }

    /**
     * Remove an existent renderer
     * @param renderer renderer or the name of the renderer to be removed
     */
    public remove(renderer: Renderer|string): void {
        const key: string = this._validate(renderer, false);
        this._renderers.delete(key);
    }

    /**
     * Returns an existent renderer
     * @param name the name of the renderer to be returned
     */
    public get(name: string): Renderer {
        this._validate(name, false);
        return this._renderers.get(name);
    }

    /**
     * Returns the keys of all scenes
     */
    public getKeys(): string[] {
        return [...this._renderers.keys()];
    }

    /**
     * Iterates all scenes
     * @param fn do something with each scene
     */
    public forEach(fn: (renderer: Renderer, key?: string) => void): void {
        this._renderers.forEach((renderer, key) => {
            fn(renderer, key);
        })
    }

    /**
     * Checks if there is a given renderer
     * @param renderer renderer or the name of the renderer to be checked
     */
    public has(renderer: Renderer|string): boolean {
        const name = this._getName(renderer);
        return this._renderers.has(name);
    }

    /**
     * Validates the existence or not of a given renderer and
     * returns the renderer key in case of success.
     * Fail case is defined by 'exists' param.
     * @param renderer renderer or the name of the renderer to be validated
     * @param exists fail case of the validation
     * @returns the scene name
     */
    private _validate(renderer: Renderer|string, exists: boolean = true): string|never {
        const name = this._getName(renderer);
        if(exists && this._renderers.has(name)) {
            throw new Error(`Renderer ${name} already exists!`);
        }
        if(!exists && !this._renderers.has(name)) {
            throw new Error(`Renderer ${name} does not exists!`);
        }
        return name;
    }

    /**
     * Resolves the scene name
     * @param scene scene or the name of the scene to be resolved
     */
    private _getName(renderer: Renderer|string): string {
        return renderer instanceof Renderer ? renderer.getName() : renderer;
    }

}

export default RenderStrategy