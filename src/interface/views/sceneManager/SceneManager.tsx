import { useGallantStore, useGameCore } from '@store/Global.store';
import React, { useContext } from 'react';

import {FaTrashAlt} from 'react-icons/fa'
import SimpleBar from 'simplebar-react';

interface SceneManagerProps {
  
}

const SceneManager: React.FC<SceneManagerProps> = () => {
  const core = useGameCore()
  const gallant = useGallantStore();

  function selectEntity(entity: string) {
    if(core.getSceneManager().getActive().has(entity)) {
      gallant.selectEntity({entity})
      core.setSelectedEntity(entity)
    }
  }

  function removeEntity(entityName: string) {
    if(gallant.selected.entity === entityName) {
      gallant.selectEntity({entity: null})
      core.setSelectedEntity(null)
    }
    core.removeEntity(entityName)
    if(
      core.getSceneManager().getActive().getKeys().length === 0  ||
      gallant.selected.entity !== entityName
    ) {
      gallant.selectEntity({entity: null})
      core.setSelectedEntity(null)
    }
  }

  return (
    <div className='container-content scene-manager'>
      <SimpleBar style={{ maxHeight: '100%' }}>
        <ul>
          {gallant.scenes[0].entities.map((i) => {
            const selected = gallant.selected.entity === i
            return (
              <li 
                key={i} 
                onClick={() => selectEntity(i)}
                className={`${selected ? 'selected' : ''}`}
              >
                <div> {i} </div>
                <button type="button" onClick={() => removeEntity(i)} disabled={selected}>
                  <FaTrashAlt  />
                </button>
              </li>
            )
          })}
        </ul>
      </SimpleBar>
    </div>
  );
};

export default SceneManager;