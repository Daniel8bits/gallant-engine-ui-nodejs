import useGameCore from '@hooks/useGameCore';
import { RazorContext, RazorObserverActions } from '@providers/RazorProvider';
import React, { useContext } from 'react';

import {FaTrashAlt} from 'react-icons/fa'
import SimpleBar from 'simplebar-react';

interface SceneManagerProps {
  
}

const SceneManager: React.FC<SceneManagerProps> = () => {
  const core = useGameCore()
  const razorContext = useContext(RazorContext);

  function selectEntity(entityName: string) {
    if(core.getSceneManager().getActive().has(entityName)) {
      razorContext.observerDispatch({
        type: RazorObserverActions.selectEntity,
        payload: entityName
      })
      core.setSelectedEntity(entityName)
    }
  }

  function removeEntity(entityName: string) {
    if(razorContext.observers.selected.entity === entityName) {
      razorContext.observerDispatch({
        type: RazorObserverActions.selectEntity,
        payload: null
      })
      core.setSelectedEntity(null)
    }
    core.removeEntity(entityName)
    if(
      core.getSceneManager().getActive().getKeys().length === 0  ||
      razorContext.observers.selected.entity !== entityName
    ) {
      razorContext.observerDispatch({
        type: RazorObserverActions.selectEntity,
        payload: null
      })
      core.setSelectedEntity(null)
    }
  }

  return (
    <div className='container-content scene-manager'>
      <SimpleBar style={{ maxHeight: '100%' }}>
        <ul>
          {razorContext.observers.scenes[0].entities.map((i) => {
            const selected = razorContext.observers.selected.entity === i
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