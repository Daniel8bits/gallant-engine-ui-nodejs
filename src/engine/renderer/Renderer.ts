import Entity from "../core/Entity";
import Scene from "../core/Scene";
import Shader from "../tools/Shader";

abstract class Renderer {

    private _name: string;

    private _scene: Scene;

    protected constructor(name: string) {
        this._name = name;
    }

    protected getEntitiesByShader(shader: Shader): Entity[] {
        return this._scene.filterVisible(
            (entity: Entity) => 
                entity.getRenderer().getName() === this._name &&
                entity.getShader().getName() === shader.getName()
        )
    }

    public abstract render(): void;

    public getName(): string { 
        return this._name
    }

    public setScene(scene: Scene) {
        this._scene = scene;
    }
}

export default Renderer