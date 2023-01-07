import SceneManager from './SceneManager'
import RenderStrategy from '../renderer/RenderStrategy'

abstract class GameCore {

    private _renderStrategy: RenderStrategy;
    private _sceneManager: SceneManager;
    
    protected constructor() {
        this._renderStrategy = new RenderStrategy();
        this._sceneManager = new SceneManager(this._renderStrategy);
    }

    public abstract start(): void;

    public update(time: number, delta: number): void {
        this._sceneManager.update(time, delta);
    }

    public render(): void {
        this._sceneManager.render();
    }

    public getSceneManager(): SceneManager {
        return this._sceneManager;
    }

    public getRenderStrategy(): RenderStrategy {
        return this._renderStrategy;
    }

}

export default GameCore;