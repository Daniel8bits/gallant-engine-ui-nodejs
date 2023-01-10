import Renderer from "gallant-engine/dist/src/renderer/Renderer";
import SceneManager from "gallant-engine/dist/src/core/scenes/SceneManager";
import Texture from "gallant-engine/dist/src/appearance/Texture";
import Shader from "gallant-engine/dist/src/appearance/Shader";
import { Matrix4, toRadians } from "gallant-engine/dist/src/math/LA";
import GLUtils, { gl } from "gallant-engine/dist/src/gl/GLUtils";
import ResourceManager from "gallant-engine/dist/src/core/ResourceManager";
import Gallant from "gallant-engine/dist/src/core/Gallant";

import SimpleEntity from "@interface-core/entities/SimpleEntity";
import CameraManager from "@interface-core/CameraManager";

class EditorRenderer extends Renderer {

    private _framebuffer: WebGLFramebuffer
    private _depthBuffer: WebGLFramebuffer
    private _sceneManager: SceneManager
    private _texture: Texture
    private _shader: Shader

    private _projection: Matrix4;
    private _cameraManager: CameraManager

    private _id: number

    constructor(cameraManager: CameraManager, sceneManager: SceneManager) {
      super('editor_renderer', cameraManager.getActive())
      this._cameraManager = cameraManager
      const vd = gl.getParameter(gl.VIEWPORT)

      this._projection = new Matrix4().perspective({
        fovy: toRadians(70), 
        aspect: vd[2] / vd[3], 
        near: 1, 
        far: 1000
      })

      this._sceneManager = sceneManager
      this._framebuffer = gl.createFramebuffer()
      this._depthBuffer = gl.createRenderbuffer()
      this._texture = new Texture()
      this._texture.setWidth(Gallant.CANVAS.width)
      this._texture.setHeight(Gallant.CANVAS.height)
      this._texture.create()
      this._shader = ResourceManager.getShader('editor-shader')
      this._id = 0;
    }

    public render() {

      if(this._cameraManager.getActive()) {

        this.bind()
  
        this._shader.bind();
  
        this._shader.setMatrix4x4('u_projection', this._projection);
        this._shader.setMatrix4x4('u_view', this.getCamera().getView());
  
        this._id = 0;
  
        this._sceneManager.getActive().forEach((entity) => {
          entity.getVAO().bind();
          this._shader.setMatrix4x4('u_transform', entity.getTransform().toMatrix());
          (entity as SimpleEntity).setId(this._id)
          this._shader.setFloat('u_id', this._id)
          this._id++
          GLUtils.draw(entity.getVAO().getLength())
          entity.getVAO().unbind()
        })
  
        const data = new Uint8Array(this._texture.getWidth() * this._texture.getHeight() * 4)
  
        gl.readPixels(
          0, 
          0,
          this._texture.getWidth(),
          this._texture.getHeight(),
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          data
        )
        this._texture.setData(data);
  
        this.unbind()
      }

    }

    private bind() {

      this._texture.bind();
      gl.viewport(0, 0, this._texture.getWidth(), this._texture.getHeight());

      gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
      gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffer);

      gl.framebufferTexture2D(
        gl.FRAMEBUFFER, 
        gl.COLOR_ATTACHMENT0, 
        gl.TEXTURE_2D, 
        this._texture.getProgram(), 
        0
      );

      gl.renderbufferStorage(
        gl.RENDERBUFFER, 
        gl.DEPTH_COMPONENT16, 
        this._texture.getWidth(),
        this._texture.getHeight()
      );

      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER, 
        gl.DEPTH_ATTACHMENT, 
        gl.RENDERBUFFER, 
        this._depthBuffer
      );

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
      //console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE)
    }

    private unbind() {
      //gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      this._texture.unbind()
      gl.viewport(0, 0, Gallant.CANVAS.width, Gallant.CANVAS.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
    }

    public getTexture(): Texture {
      return this._texture;
    }
}

export default EditorRenderer