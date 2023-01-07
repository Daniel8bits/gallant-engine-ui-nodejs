import IResource from './IResource';
import { gl } from "../gl/GLUtils";
import FileUtils from '../utils/FileUtils';
import Mat4 from '../math/Mat4';

export interface ShaderType {
    name: string
    vertexShaderPathname: string
    fragmentShaderPathname: string
}

class Shader implements IResource{

    private _name: string;
    private _vertexShaderPathname: string;
    private _fragmentShaderPathname: string;
    private _program: WebGLProgram;

    public constructor(params: ShaderType) {
        this._name = params.name;
        this._vertexShaderPathname = params.vertexShaderPathname;
        this._fragmentShaderPathname = params.fragmentShaderPathname;
    }

    public create() : void {
        this._program = gl.createProgram();

        const vertexShader : WebGLShader = this.load(this._vertexShaderPathname, gl.VERTEX_SHADER);
        const fragmentShader : WebGLShader = this.load(this._fragmentShaderPathname, gl.FRAGMENT_SHADER);

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);

        const error : string = gl.getProgramInfoLog(this._program).trim();
        if(error !== '') {
            throw new Error(`Error trying to link shader: ${this._name}.\n ${error}`);
        }
    }

    private load(pathname: string, type: number) : WebGLShader {
        const shader : WebGLShader = gl.createShader(type);

        FileUtils.load(
            pathname, 
            function onSuccess(file) {
                gl.shaderSource(shader, file);
            },
            function onError(err) {
                throw new Error(`Error trying to load shader: ${pathname}.\n ${err}`);
            },
        );

        gl.compileShader(shader);
        const error : string = gl.getShaderInfoLog(shader).trim();
        if( error !== '') {
            throw new Error(`Error trying to compile shader: ${pathname}.\n ${error}`);
        }

        return shader;
    }

    public bind() : void {
        gl.useProgram(this._program);
    }

    public unbind() : void {
        throw new Error('Not implemented yet')
    }

    public destroy() : void {
        throw new Error('Not implemented yet')
    }

    public getUniformLocation(name : string) : WebGLUniformLocation {
        return gl.getUniformLocation(this._program, name);
    }

    /**
     * Check if the given name matches an actual uniform in the shader,
     * if so sets the value, otherwise throw an error
     * @param name uniform name
     * @param setValue callback to set the value in case of success
     */
    private _checkIfUniformExists(name : string, 
        setValue: (location: WebGLUniformLocation) => void) : void {
        const location = gl.getUniformLocation(this._program, name);
        if(location === -1) {
            throw new Error(`Uniform '${name}' does not exist in shader: ${this._name}`);
        }
        setValue(location);
    }

    /**
     * Sets the value of a 32 bits integer uniform
     * @param name uniform name on shader
     * @param value value to set
     */
    public setInt(name : string, value : number) : void {
        this._checkIfUniformExists(name, (location) => gl.uniform1i(location, value));
    }

    /**
     * Sets the value of a 32 bits integer array uniform
     * @param name uniform name on shader
     * @param value value to set
     */
     public setIntArray(name : string, arrayValue: number[]) : void {
        this._checkIfUniformExists(name, 
            (location) => gl.uniform1iv(location, new Int32Array(arrayValue)));
    }

    /**
     * Sets the value of a 32 bits precision float uniform
     * @param name uniform name on shader
     * @param value value to set
     */
    public setFloat(name : string, value : number) : void {
        this._checkIfUniformExists(name, (location) => gl.uniform1f(location, value));
    }

    /**
     * Sets the value of a 32 bits precision float array uniform
     * @param name uniform name on shader
     * @param value value to set
     */
    public setFloatArray(name : string, arrayValue: number[]) : void {
        this._checkIfUniformExists(name, 
            (location) => gl.uniform1fv(location, new Float32Array(arrayValue)));
    }

    public setMatrix4x4(name: string, matrix: Mat4): void {
        this._checkIfUniformExists(name, 
            (location) => gl.uniformMatrix4fv(location, false, matrix.toArray()));
    }

    public getName(): string { 
        return this._name
    }
    
}

export default Shader;