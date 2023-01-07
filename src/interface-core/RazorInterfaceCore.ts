import GameCore from "@engine/core/GameCore";
import Razor from "@engine/core/Razor";
import ResourceLoader from "@engine/core/ResourceLoader";
import Scene from "@engine/core/Scene";
import Vec3 from "@engine/math/Vec3";
import Transform from '@engine/math/Transform';
import FileUtils from "@engine/utils/FileUtils";
import { gl } from "@engine/gl/GLUtils";
import CanvasCamera from "./CanvasCamera";
import SimpleEntity from "./entities/SimpleEntity";
import EditorRenderer from "./renderers/EditorRenderer";
import SimpleRenderer from "./renderers/SimpleRenderer";
import CameraManager from './CameraManager';


class RazorInterfaceCore extends GameCore {

  private _editorRenderer: EditorRenderer

  private _cameraManager: CameraManager

  private _sceneObserver: (keys: string[]) => void;
  private _cameraManagerObserver: (keys: string[]) => void
  private _cameraObserver: (transform: Transform) => void
  private _selectedEntity: string
  private _selectedCamera: string

  public constructor(
    sceneObserver: (keys: string[]) => void,
    cameraObserver: (transform: Transform) => void,
    cameraManagerObserver: (keys: string[]) => void
  ) {
    super()
    this._sceneObserver = sceneObserver
    this._cameraManagerObserver = cameraManagerObserver
    this._cameraObserver = cameraObserver
    this._selectedEntity = null
    this._cameraManager = new CameraManager(this.getRenderStrategy())
  }
  
  public start(): void {

    this.createNewCamera()
    this.setSelectedCamera('camera0')
    this.getCameraManager().setActive('camera0');

    // ========= SHADER ==========

    ResourceLoader.loadShader([
      {
        name: 'shader1',
        vertexShaderPathname: './resources/shader/vert.glsl', 
        fragmentShaderPathname: './resources/shader/frag.glsl'
      },
      {
        name: 'editor-shader',
        vertexShaderPathname: './resources/shader/editor.vert.glsl', 
        fragmentShaderPathname: './resources/shader/editor.frag.glsl'
      },
      {
        name: 'camera-shader',
        vertexShaderPathname: './resources/shader/camera.vert.glsl', 
        fragmentShaderPathname: './resources/shader/camera.frag.glsl'
      },
    ])
    .forEachShader((shader) => {
      shader.create();
    })

    ResourceLoader.loadVAO([
      {
        name: 'cube',
        objectData: './resources/objects/cube/cube.obj'
      },
      {
        name: 'sphere',
        objectData: './resources/objects/sphere/sphere.obj'
      },
      {
        name: 'camera',
        objectData: './resources/objects/camera/camera.obj'
      },
      {
        name: 'level',
        objectData: './resources/objects/level/level.obj'
      },
      {
        name: 'level-2',
        objectData: './resources/objects/level/level-2.obj'
      },
      {
        name: 'hall',
        objectData: './resources/objects/level/hall.obj'
      },
      {
        name: 'elevator',
        objectData: './resources/objects/level/elevator.obj'
      },
      {
        name: 'lamp',
        objectData: './resources/objects/lamp/lamp.obj'
      },
      {
        name: 'elevator-door',
        objectData: './resources/objects/doors/elevator-door.obj'
      },
      {
        name: 'hall-door',
        objectData: './resources/objects/doors/hall-door.obj'
      },
      {
        name: 'door-panel',
        objectData: './resources/objects/panels/door-panel.obj'
      },
    ])
    .forEachVAO((vao) => {
      vao.create();
    })

    const simpleRenderer = new SimpleRenderer(this._cameraManager);
    this.getRenderStrategy().add(simpleRenderer)

    this.getSceneManager().add(new Scene('scene1'), true)

    this._editorRenderer = new EditorRenderer(this._cameraManager, this.getSceneManager())

  }

  public update(time: number, delta: number): void {
    super.update(time, delta);

    //this._cameraManager.getActive().update(delta)
    this._cameraManager.update(time, delta);
  }

  public render(): void {
    this._editorRenderer.render();
    super.render();
  }

  public createNewEntity(vaoName: string): void {

    const scene = this.getSceneManager().getActive()
    let name = `${vaoName}_`
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      if(!scene.has(name+i)) {
        name += i
        break;
      }
    }

    const camera = this._cameraManager.getActive().getTransform()

    scene
      .add(new SimpleEntity(
        name,
        ResourceLoader.getVAO(vaoName), 
        ResourceLoader.getShader('shader1'),
        this.getRenderStrategy().get('renderer1')
      ))
      .get(name)
      .getTransform()
      .setTranslation(camera.getTranslation().invert())
    scene.get(name).getTransform().setRotation(new Vec3(0, 0, 0))
    scene.get(name).getTransform().setScale(new Vec3(1, 1, 1))

    if(this._sceneObserver) {
      this._sceneObserver(scene.getKeys())
    }
  }

  public removeEntity(name: string): void {
    const scene = this.getSceneManager().getActive()
    if(scene.has(name)) {
      scene.remove(name);
    }
    if(this._sceneObserver) {
      this._sceneObserver(scene.getKeys())
    }
  }

  public selectEntity(mouseX: number, mouseY: number): string {

    mouseX -= Razor.CANVAS.offsetLeft
    mouseY -= Razor.CANVAS.offsetTop

    const data = this._editorRenderer.getTexture().getData()

    const color = [
      data.at((data.length - mouseY * Razor.CANVAS.width * 4 - 1) - (Razor.CANVAS.width - mouseX) * 4 - 3),
      data.at((data.length - mouseY * Razor.CANVAS.width * 4 - 1) - (Razor.CANVAS.width - mouseX) * 4 - 2),
      data.at((data.length - mouseY * Razor.CANVAS.width * 4 - 1) - (Razor.CANVAS.width - mouseX) * 4 - 1),
      data.at((data.length - mouseY * Razor.CANVAS.width * 4 - 1) - (Razor.CANVAS.width - mouseX) * 4),
    ]

    if(color[3] > 0) {

      const id = color[0] * 256**2 + color[1] * 256 + color[2]
  
      const entities = this.getSceneManager().getActive()
        .filterVisible((entity) => (entity as SimpleEntity).getId() === id)

      if(entities.length > 0) {
        this.setSelectedEntity(entities[0].getName())
        return this._selectedEntity
      }
      
    }
    
    return null
  }

  public setSelectedEntity(entity: string) {
    if(this._selectedEntity) {
      (this.getSceneManager().getActive().get(this._selectedEntity) as SimpleEntity)
        .setSelected(false);
    }
    if(entity) {
      (this.getSceneManager().getActive().get(entity) as SimpleEntity)
      .setSelected(true)
    }
    this._selectedEntity = entity
  }

  public getCameraManager(): CameraManager {
    return this._cameraManager
  }

  public createNewCamera(): string {

    let name = 'camera'
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      if(!this.getCameraManager().has(name+i)) {
        name += i
        break;
      }
    }

    this.getCameraManager()
      .add(new CanvasCamera(name, this._cameraManager, this._cameraObserver))
      .get(name)
      .getTransform()
      .setTranslation(new Vec3(0, 0, 0))
    this.getCameraManager().get(name).getTransform().setRotation(new Vec3(0, 0, 0))
    this.getCameraManager().get(name).getTransform().setScale(new Vec3(1, 1, 1))

    if(this._sceneObserver) {
      this._cameraManagerObserver(this.getCameraManager().getKeys())
    }

    return name
  }

  public setSelectedCamera(camera: string) {
    if(this._selectedCamera) {
      (this.getCameraManager().get(this._selectedCamera) as CanvasCamera)
        .setSelected(false);
    }
    if(camera) {
      (this.getCameraManager().get(camera) as CanvasCamera)
      .setSelected(true)
    }
    this._selectedCamera = camera
  }

  public lockCamera(entityName: string) {
    if(this._selectedCamera) {
      let entity = null;
      if(this.getSceneManager().getActive().has(entityName)) {
        entity = this.getSceneManager().getActive().get(entityName)
      }
      (this.getCameraManager().get(this._selectedCamera) as CanvasCamera)
        .lock(entity)
    }
  }

  public setLookAt(shouldLookAt: boolean) {
    if(this._selectedCamera) {
      (this.getCameraManager().get(this._selectedCamera) as CanvasCamera)
        .setLookAt(shouldLookAt)
    }
  }

  public exportAll(): void {
    const json = {}
    this.getSceneManager().getActive()
      .filterVisible(entity => entity.getName().substring(0, 6) === "sphere")
      .forEach(entity => {
        const name = entity.getName().replace("sphere", "monster")
        json[name] = {}
        const e = json[name]

        const translation = entity.getTransform().getTranslation()
        //const rotation = entity.getTransform().getRotation()
        //const scale = entity.getTransform().getScale()

        e.translation = {
          x: translation.x,
          y: translation.y,
          z: translation.z,
        }
/*
        e.rotation = {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
        }

        e.scale = {
          x: scale.x,
          y: scale.y,
          z: scale.z,
        }
*/

      })
      navigator.clipboard.writeText(JSON.stringify(json)).then(() => {
        console.log(JSON.stringify(json));
      }, 
      (err) => {
        console.error('Could not copy json: ', err);
      });
    
  }

  public importAll(): void {

    interface EntityImportJSON {
      [name: string]: {
        translation: {
          x: number
          y: number
          z: number
        },
        rotation: {
          x: number
          y: number
          z: number
        },
        scale: {
          x: number
          y: number
          z: number
        },
      }
    }

    FileUtils.load('/resources/entities.json',
      (data) => {

        const entities: EntityImportJSON = JSON.parse(data)

        Object.keys(entities).forEach(key => {
          const data = entities[key]

          const vaoName = ((): string => {
            for(let i = key.length-1; i >= 0; i--) {
              if(key[i] === '_') {
                return key.substring(0, i)
              }
            }
            return '';
          })();

          const entity = new SimpleEntity(
            key,
            ResourceLoader.getVAO(vaoName), 
            ResourceLoader.getShader('shader1'),
            this.getRenderStrategy().get('renderer1')
          )

          entity.getTransform().setTranslation(new Vec3(
            data.translation.x,
            data.translation.y,
            data.translation.z,
          ))
          entity.getTransform().setRotation(new Vec3(
            data.rotation.x,
            data.rotation.y,
            data.rotation.z,
          ))
          entity.getTransform().setScale(new Vec3(
            data.scale.x,
            data.scale.y,
            data.scale.z,
          ))

          this.getSceneManager().getActive().add(entity)

        })


      },
      function onError(err) {
        console.error('Could not import entities from json: ', err);
      },
    )

    if(this._sceneObserver) {
      this._sceneObserver(this.getSceneManager().getActive().getKeys())
    }
  }

  public setFaceCulling(faceCulling: boolean) {
  
    if(faceCulling) {
      gl.enable(gl.CULL_FACE)
      return
    }

    gl.disable(gl.CULL_FACE)

  }

}


export default RazorInterfaceCore
