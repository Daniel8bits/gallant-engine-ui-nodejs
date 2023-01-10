import { useGallantStore, useGameCore, EGallantResources } from '@store/Global.store';
import React, { useContext } from 'react';
import SimpleBar from 'simplebar-react';

interface ResourceManagerProps {
  
}

/* 

  TODO:
    - adicionar uma lista de observer e nomes para cada recurso no RazorStore
    - adicionar uma hook para cada recurso q deverá criar o observer
    - no observer, deve-se atualizar a lista de nomes
    - na hook, deve-se retornar a lista de nomes

*/

const ResourceManager: React.FC<ResourceManagerProps> = () => {

  const core = useGameCore()
  const gallant = useGallantStore();

  function createNewEntity(vaoName: string) {
    core.createNewEntity(vaoName)
  }

  return (
    <div className='container-content resource-manager'>
      <SimpleBar style={{ maxHeight: '100%' }}>
        <ul>
          {gallant.resources[EGallantResources.VAO].keys.map(vao => {
            return (
              <li key={vao} onDoubleClick={() => createNewEntity(vao)}>
                <img src="/interface-assets/icons/obj-file-icon.svg" alt={vao} />
                <span>{vao}</span>
              </li>
            )
          })}
        </ul>
      </SimpleBar>
    </div>
  );
};

export default ResourceManager;