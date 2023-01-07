import Shader, {ShaderType} from '../tools/Shader'
import VAO, {VAOType} from '../buffer/VAO'
import VBO from '../buffer/VBO'
import OBJLoader from '../loader/OBJLoader'

class ResourceLoader {

    private static _instance: ResourceLoader

    private _shaders: Map<string, Shader>
    private _vaos: Map<string, VAO>

    private _vaoResourcesObserver: (keys: string[]) => void

    private constructor() {
        this._shaders = new Map<string, Shader>();
        this._vaos = new Map<string, VAO>();
    }

    private static getInstance() {
        if(!ResourceLoader._instance) {
            ResourceLoader._instance = new ResourceLoader();
        }
        return ResourceLoader._instance
    }

    /* =====================
              VAO'S
    ======================*/

    public static loadVAO(vaos: VAOType[]): ResourceLoader {
        return ResourceLoader.getInstance().loadVAO(vaos);
    }

    public loadVAO(vaos: VAOType[]): ResourceLoader {
        vaos.forEach((vao) => {
            if(this._vaos.has(vao.name)) {
                throw new Error(`Shader '${vao.name}' already exists!`)
            }

            if(typeof vao.objectData === 'string') {
                // todo: mesh loader 
                this._vaos.set(vao.name, new OBJLoader().load(vao.objectData as string));
                return;
            }

            this._vaos.set(vao.name, new VAO(vao.objectData as VBO[]));
        }); debugger
        if(this._vaoResourcesObserver) {
            const keys = [...this._vaos.keys()]
            this._vaoResourcesObserver(keys)
        }
        return this;
    }

    public static getVAO(name: string): VAO {
        return ResourceLoader.getInstance().getVAO(name);
    }

    public getVAO(name: string): VAO {
        return this._vaos.get(name);
    }

    public static forEachVAO(callback: (vao: VAO) => void): ResourceLoader {
        return ResourceLoader.getInstance().forEachVAO(callback);
    }

    public forEachVAO(callback: (vao: VAO) => void): ResourceLoader {
        this._vaos.forEach(callback);
        return this;
    }

    public static setVAOObserver(observer: (keys: string[]) => void): void {
        ResourceLoader.getInstance().setVAOObserver(observer)
    }

    public setVAOObserver(observer: (keys: string[]) => void): void {
        this._vaoResourcesObserver = observer;
    }

    /* =====================
            SHADERS
    ======================*/

    public static loadShader(shaders: ShaderType[]): ResourceLoader{
        return ResourceLoader.getInstance().loadShader(shaders);
    }

    public loadShader(shaders: ShaderType[]): ResourceLoader {
        shaders.forEach((shader) => {
            if(this._shaders.has(shader.name)) {
                throw new Error(`Shader '${shader.name}' already exists!`)
            }
            this._shaders.set(shader.name, new Shader(shader))
        })
        return this
    }

    public static getShader(name: string): Shader {
        return ResourceLoader.getInstance().getShader(name);
    }

    public getShader(name: string): Shader {
        return this._shaders.get(name);
    }

    public static forEachShader(callback: (shader: Shader) => void): ResourceLoader {
        return ResourceLoader.getInstance().forEachShader(callback);
    }

    public forEachShader(callback: (shader: Shader) => void): ResourceLoader {
        this._shaders.forEach(callback);
        return this
    }


}

export default ResourceLoader