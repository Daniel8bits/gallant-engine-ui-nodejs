import Property from '@components/property/Property';
import { useGallantStore, useGameCore } from '@store/Global.store';
import UIButton from '@ui/buttons/UIButton';
import UICheckBox from '@ui/checkbox/UICheckBox';
import Entity from 'gallant-engine/dist/src/core/entities/Entity';
import { Vector3 } from 'gallant-engine/dist/src/math/LA';
import Orientation from 'gallant-engine/dist/src/math/Orientation';
import React, { useContext, useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';

interface EntityPropertiesProps {
  show: boolean
}

const EntityProperties: React.FC<EntityPropertiesProps> = (props) => {

  const [faceCulling, setFaceCulling] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] = useState<Entity>();

  const core = useGameCore()
  const gallant = useGallantStore();

  function setTranslation(x: number, y: number, z: number) {
    if(gallant.selected.entity) {
      core.getSceneManager().getActive().get(gallant.selected.entity)
        .getTransform()
        .setTranslation(new Vector3(x, y, z))
    }
  }

  function setRotation(x: number, y: number, z: number) {
    if(gallant.selected.entity) {
      core.getSceneManager().getActive().get(gallant.selected.entity)
        .getTransform()
        .setRotation(new Orientation(x, y, z))
    }
  }

  function setScale(x: number, y: number, z: number) {
    if(gallant.selected.entity) {
      core.getSceneManager().getActive().get(gallant.selected.entity)
        .getTransform()
        .setScale(new Vector3(x, y, z))
    }
  }

  useEffect(() => {
    if(core) {
      core.setFaceCulling(faceCulling)
    }
  }, [faceCulling])

  useEffect(() => {
    if(gallant.selected.entity) {
      const entity = core.getSceneManager().getActive().get(gallant.selected.entity)
      setSelectedEntity(entity)
      //setAnimate((entity as SimpleEntity).shouldAnimate())
    }
  }, [gallant.selected.entity])

  function exportAll() {
    core.exportAll()
  }

  return (
    <SimpleBar 
      className={`entity-properties ${!props.show && 'hidden'}`}
      style={{ maxHeight: '100%' }}
    >
      <h3> {`Properties: ${gallant.selected.entity ?? ''}`} </h3>
      <div className="options">
        <UICheckBox  
          id="faceculling"
          label="Face Culling"
          checked={faceCulling}
          onActionPerformed={setFaceCulling}
        />
      </div>
      <div className="options">
      <UIButton 
          template="simple"
          onActionPerformed={exportAll}
        >
          Export all
        </UIButton>
        <UIButton 
          template="simple"
          onActionPerformed={() => core.importAll()}
        >
          Import all
        </UIButton>
      </div>
      {gallant.selected.entity &&
        (<>
          <Property 
            title="Translation" 
            vector={selectedEntity?.getTransform().getTranslation()} 
            setProperty={setTranslation}  
          />
          <Property 
            title="Rotation" 
            vector={selectedEntity?.getTransform().getRotation()} 
            setProperty={setRotation}  
          />
          <Property 
            title="Scale" 
            vector={selectedEntity?.getTransform().getScale()} 
            defaultValue={new Vector3(1, 1, 1)}
            setProperty={setScale}  
          />
        </>)
      }
    </SimpleBar>
  );
};

export default EntityProperties;