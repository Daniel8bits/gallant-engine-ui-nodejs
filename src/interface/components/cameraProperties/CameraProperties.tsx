import Property from '@components/property/Property';
import useGameCore from '@hooks/useGameCore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';

import {BsPlus, BsDash} from 'react-icons/bs'
import {BiTargetLock} from 'react-icons/bi'
import UIButton from '@ui/buttons/UIButton';
import UICombo from '@ui/combo/UICombo';
import UICheckBox from '@ui/checkbox/UICheckBox';
import { RazorContext, RazorObserverActions } from '@providers/RazorProvider';
import { Vector3 } from 'gallant-engine/dist/src/math/LA';
import Razor from 'gallant-engine/dist/src/core/Razor';
import Orientation from 'gallant-engine/dist/src/math/Orientation';

interface CameraPropertiesProps {
  show: boolean
}

const CameraProperties: React.FC<CameraPropertiesProps> = (props) => {
  const [speed, setSpeed] = useState<number>(10);
  const [lookAt, setLookAt] = useState<boolean>(false);
  const core = useGameCore()
  const razorContext = useContext(RazorContext);
  //const cameraSelectRef = useRef<HTMLSelectElement>();
  const entitySelectRef = useRef<HTMLSelectElement>();

  const translation = new Vector3(
    razorContext.observers.camera.transform.translation[0],
    razorContext.observers.camera.transform.translation[1],
    razorContext.observers.camera.transform.translation[2],
  )

  const rotation = new Vector3(
    razorContext.observers.camera.transform.rotation[0],
    razorContext.observers.camera.transform.rotation[1],
    razorContext.observers.camera.transform.rotation[2],
  )

  function setTranslation(x: number, y: number, z: number) {
    if(
      razorContext.observers.selected.camera &&
      !Razor.IS_MOUSE_INSIDE
    ) {

      core.getCameraManager().get(razorContext.observers.selected.camera)
        .getTransform()
        .setTranslation(new Vector3(x, y, z))
      
    }
  }

  function setRotation(x: number, y: number, z: number) {
    if(
      razorContext.observers.selected.camera &&
      !Razor.IS_MOUSE_INSIDE
    ) {

      core.getCameraManager().get(razorContext.observers.selected.camera)
        .getTransform()
        .setRotation(new Orientation(x, y, z))

    }
  }

  useEffect(() => {
    razorContext.observerDispatch({
      type: RazorObserverActions.selectCamera,
      payload: 'camera0'
    })
    razorContext.observerDispatch({
      type: RazorObserverActions.targetCamera,
      payload: 'camera0'
    })
  }, [])

  function targetCamera(camera: string) {// = cameraSelectRef.current.value) {
    core.getCameraManager().setActive(camera)
    razorContext.observerDispatch({
      type: RazorObserverActions.targetCamera,
      payload: camera
    })
    core.getCameraManager().getActive().setSpeed(speed)
  }

  function selectCamera(camera: string) {// = cameraSelectRef.current.value) {
    core.setSelectedCamera(camera)
    const transform = core.getCameraManager().get(camera).getTransform()
    razorContext.observerDispatch({
      type: RazorObserverActions.selectCamera,
      payload: camera
    })
    razorContext.observerDispatch({
      type: RazorObserverActions.updateCamera,
      payload: {
        translation: [
          transform.getTranslation().x,
          transform.getTranslation().y,
          transform.getTranslation().z,
        ],
        rotation: [
          transform.getRotation().x,
          transform.getRotation().y,
          transform.getRotation().z,
        ],
      }
    })
    const entity = core.getCameraManager().get(camera).getLockedIn()
    lockIn(entity ? entity.getName() : null, true)
    setLookAt(core.getCameraManager().get(camera).shouldLookAt())
    console.log(camera, core.getCameraManager().get(camera).shouldLookAt());
    
  }

  function addCamera() {
    const newCamera = core.createNewCamera()
    selectCamera(newCamera)
    targetCamera(newCamera)
  }

  function lockIn(entity: string, alreadyLocked: boolean = false) {
    if(!alreadyLocked) {
      core.lockCamera(entity)
    }
    razorContext.observerDispatch({
      type: RazorObserverActions.lockCamera,
      payload: entity
    })
    
  }

  useEffect(() => {
    core?.setLookAt(lookAt)
  }, [lookAt])

  function increaseSpeed() {

    if(speed === 30 ) {
      setSpeed(5);
      core.getCameraManager().getActive().setSpeed(5)
      return
    }
    setSpeed(speed+5);
    core.getCameraManager().getActive().setSpeed(speed+5)

  }

  function decreaseSpeed() {

    if(speed === 5 ) {
      setSpeed(30);
      core.getCameraManager().getActive().setSpeed(30)
      return
    }
    setSpeed(speed-5);
    core.getCameraManager().getActive().setSpeed(speed-5)

  }

  return (
    <SimpleBar 
      className={`camera-properties ${!props.show && 'hidden'}`}
      style={{ maxHeight: '100%' }}
    >
      <h3> {`Camera Properties - ${razorContext.observers.camera.target ?? ''}`} </h3>
      <div className="options">
        

        <UICombo  
          value={razorContext.observers.selected.camera ?? undefined}
          items={razorContext.observers.scenes[0].cameras}
          strict
          onActionPerformed={selectCamera}
        />
        
        <UIButton 
          template="simple" 
          icon={BiTargetLock}
          tooltip='Ativar camera'
          onActionPerformed={() => targetCamera(razorContext.observers.selected.camera)}
        ></UIButton>
        <UIButton 
          template="simple" 
          icon={BsPlus}
          tooltip='Adicionar camera'
          onActionPerformed={addCamera}
        ></UIButton>
      </div>
      <div className="options">
        

        <UICombo  
          value={razorContext.observers.camera.lockedIn}
          items={razorContext.observers.scenes[0].entities}
          onActionPerformed={lockIn}
        />
        
        <UICheckBox  
          id="lookAt"
          label="Look At"
          checked={lookAt}
          onActionPerformed={setLookAt}
        />

      </div>
      <div className="options">
        <span>Speed: </span>
        <UIButton 
          template="simple"
          icon={BsPlus}
          tooltip='Aumentar velocidade'
          onActionPerformed={increaseSpeed}
        ></UIButton>
        <span>{speed}</span>
        <UIButton 
          template="simple"
          icon={BsDash}
          tooltip='Diminuir velocidade'
          onActionPerformed={decreaseSpeed}
        ></UIButton>
      </div>
      <Property 
        title="Translation" 
        vector={translation} 
        setProperty={setTranslation}  
        disabled={razorContext.observers.camera.lockedIn !== null}
      />
      <Property 
        title="Rotation" 
        vector={rotation} 
        setProperty={setRotation}  
        disabled={razorContext.observers.camera.lockedIn !== null}
      />
    </SimpleBar>
  );
};

/*

<select 
  ref={cameraSelectRef}
  value={razorContext.observers.selected.camera ?? undefined}
  onChange={() => selectCamera()}
>
  {razorContext.observers.scenes[0].cameras?.map((camera) => {
    return (
      <option key={camera} value={camera}> {camera} </option>
    )
  })}
</select>
<select 
          ref={entitySelectRef}
          
          onChange={() => {}}
          
        >
          <option value='-'> none </option>
          {razorContext.observers.scenes[0].entities?.map((entity) => {
            return (
              <option key={entity} value={entity}> {entity} </option>
            )
          })}
        </select>

*/

export default CameraProperties;
