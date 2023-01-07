import Renderer from "@engine/renderer/Renderer";
import GLUtils, { gl } from "@engine/gl/GLUtils";
import Texture from "@engine/tools/Texture";
import SceneManager from "@engine/core/SceneManager";
import Razor from "@engine/core/Razor";
import Shader from "@engine/tools/Shader";
import ResourceLoader from "@engine/core/ResourceLoader";
import SimpleEntity from "@interface-core/entities/SimpleEntity";
import CameraManager from "@interface-core/CameraManager";
import Mat4 from "@engine/math/Mat4";

class EditorRenderer extends Renderer {

    private _framebuffer: WebGLFramebuffer
    private _depthBuffer: WebGLFramebuffer
    private _sceneManager: SceneManager
    private _texture: Texture
    private _shader: Shader

    private _projection: Mat4;
    private _cameraManager: CameraManager

    private _id: number

    constructor(cameraManager: CameraManager, sceneManager: SceneManager) {
      super('editor_renderer')
      this._cameraManager = cameraManager
      const vd = gl.getParameter(gl.VIEWPORT)
      this._projection = Mat4.perspective(70, vd[2] / vd[3], 1, 1000)

      this._sceneManager = sceneManager
      this._framebuffer = gl.createFramebuffer()
      this._depthBuffer = gl.createRenderbuffer()
      this._texture = new Texture()
      this._texture.setWidth(Razor.CANVAS.width)
      this._texture.setHeight(Razor.CANVAS.height)
      this._texture.create()
      this._shader = ResourceLoader.getShader('editor-shader')
      this._id = 0;
    }

    public render() {

      if(this._cameraManager.getActive()) {

        this.bind()
  
        this._shader.bind();
  
        this._shader.setMatrix4x4('u_projection', this._projection);
        this._shader.setMatrix4x4('u_view', Mat4.view(
          this._cameraManager.getActive().getTransform().getTranslation(),
          this._cameraManager.getActive().getTransform().getRotation(),
        ));
  
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
      gl.viewport(0, 0, Razor.CANVAS.width, Razor.CANVAS.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
    }

    public getTexture(): Texture {
      return this._texture;
    }
}

export default EditorRenderer