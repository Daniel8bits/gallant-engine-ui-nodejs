import Renderer from "gallant-engine/dist/src/renderer/Renderer";
import { Matrix4, toRadians } from "gallant-engine/dist/src/math/LA";
import GLUtils, { gl } from "gallant-engine/dist/src/gl/GLUtils";
import ResourceManager from "gallant-engine/dist/src/core/ResourceManager";
import Entity from "gallant-engine/dist/src/core/entities/Entity";

import SimpleEntity from "@interface-core/entities/SimpleEntity";
import CameraManager from "@interface-core/CameraManager";

class SimpleRenderer extends Renderer {

    private _projection: Matrix4;
    private _cameraManager: CameraManager

    constructor(cameraManager: CameraManager) {
        super('renderer1', cameraManager.getActive())
        this._cameraManager = cameraManager
        const vd = gl.getParameter(gl.VIEWPORT)

        this._projection = new Matrix4().perspective({
            fovy: toRadians(70), 
            aspect: vd[2] / vd[3], 
            near: 1, 
            far: 1000
          })
    }

    public render() {

        if(this._cameraManager.getActive()) {
            ResourceManager.forEachShader((shader) => {
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
        const shader = ResourceManager.getShader('camera-shader')
        const vao = ResourceManager.getVAO('camera')
        shader.bind();
        shader.setMatrix4x4('u_projection', this._projection);
        const view = this._cameraManager.getActive().getView()
        shader.setMatrix4x4('u_view', view);
        this._cameraManager.forEach((camera) => {
            if(camera.getName() === this._cameraManager.getActive().getName()) {
                return;
            }
            shader.setMatrix4x4('u_transform', camera.getTransform().toMatrix());
            vao.bind()
            GLUtils.draw(vao.getLength());
            vao.unbind();
        })
    }
}


export default SimpleRenderer