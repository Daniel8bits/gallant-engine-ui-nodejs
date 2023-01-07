import SimpleEntity from "@interface-core/entities/SimpleEntity";
import Renderer from "@engine/renderer/Renderer";
import ResourceLoader from "@engine/core/ResourceLoader";
import GLUtils, { gl } from "@engine/gl/GLUtils";
import Mat4 from "@engine/math/Mat4";
import Entity from "@engine/core/Entity";
import CameraManager from "@interface-core/CameraManager";

class SimpleRenderer extends Renderer {

    private _projection: Mat4;
    private _cameraManager: CameraManager

    constructor(cameraManager: CameraManager) {
        super('renderer1')
        this._cameraManager = cameraManager
        const vd = gl.getParameter(gl.VIEWPORT)
        this._projection = Mat4.perspective(60, vd[2] / vd[3], 1, 1000)
        //this._projection = Mat4.perspective(70, window.innerWidth / window.innerHeight, 1, 1000)
        /*
        this._ortho = Mat4.orthographic(
            0, 
            window.innerWidth,
            0,
            window.innerHeight,
            -1,
            100
        );
        */
    }

    public render() {

        if(this._cameraManager.getActive()) {
            ResourceLoader.forEachShader((shader) => {
                shader.bind();
                shader.setMatrix4x4('u_projection', this._projection);
                const view = this._cameraManager.getActive().getView()
                shader.setMatrix4x4('u_view', view);
                //shader.setMatrix4x4('u_lookAt', view.inverse())
    
                this.getEntitiesByShader(shader). forEach((entity: Entity) => {
                    shader.setMatrix4x4('u_transform', entity.getTransform().toMatrix());
                    shader.setInt('u_selected', Number((entity as SimpleEntity).isSelected()));
                    entity.getVAO().bind()
                    //gl.drawElements(gl.TRIANGLES, entity.getVAO().getIbo().getLength(), gl.UNSIGNED_SHORT, 0);
                    GLUtils.draw(entity.getVAO().getLength());
                    entity.getVAO().unbind();
                })
            })

            this._renderCameras()
        }

    }
    private _renderCameras(): void {
        const shader = ResourceLoader.getShader('camera-shader')
        const vao = ResourceLoader.getVAO('camera')
        shader.bind();
        shader.setMatrix4x4('u_projection', this._projection);
        const view = this._cameraManager.getActive().getView()
        shader.setMatrix4x4('u_view', view);
        this._cameraManager.forEach((camera) => {
            if(camera.getName() === this._cameraManager.getActive().getName()) {
                return;
            }
            shader.setMatrix4x4('u_transform', Mat4.transform(
                camera.getTransform().getTranslation().mult(-1),
                camera.getTransform().getRotation().mult(-1),
                camera.getTransform().getScale()
            ));            
            vao.bind()
            GLUtils.draw(vao.getLength());
            vao.unbind();
        })
    }
}


export default SimpleRenderer