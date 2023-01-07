import { gl } from "@engine/gl/GLUtils"
import IResource from "./IResource"

class Texture implements IResource{

  private _program: WebGLTexture
  private _width: number
  private _height: number
  private _pathname: string

  private _data: Uint8Array

  public constructor(pathname?: string) {
    this._pathname = pathname
    this._width = 0
    this._height = 0
  }

  public create() {
    this._program = gl.createTexture();

    this._data = null
    if(this._pathname) {
      this._data = this.loadTexture()
    }

    if(this._width < 1 || this._height < 1) {
      throw new Error("Invalid image size!")
    }

  }

  public bind() {
    gl.bindTexture(gl.TEXTURE_2D, this._program);
    gl.texImage2D(
      gl.TEXTURE_2D, 
      0, 
      gl.RGBA, 
      this._width, 
      this._height, 
      0, 
      gl.RGBA, 
      gl.UNSIGNED_BYTE, 
      this._data
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  public unbind() {
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public destroy() {
    gl.deleteTexture(this._program)
  }
  
  private loadTexture(): Uint8Array {
    console.log('not supported yet');
    return null
  }

  public getWidth(): number {
    return this._width
  }

  public getHeight(): number {
    return this._height
  }

  public setWidth(width: number): void {
    this._width = width
  }

  public setHeight(height: number): void {
    this._height = height
  }

  public getData(): Uint8Array {
    return this._data
  }

  public setData(data: Uint8Array): void {
    this._data = data
  }

  public getProgram(): WebGLTexture {
    return this._program
  }

  
}

export default Texture