import React, { useState } from 'react';
import {
  BsCameraReels
} from 'react-icons/bs'
import {
  BiCube
} from 'react-icons/bi'
import EntityProperties from '@components/entityProperties/EntityProperties';
import CameraProperties from '@components/cameraProperties/CameraProperties';



interface PropertiesContainerProps {
  
}

const PropertiesContainer: React.FC<PropertiesContainerProps> = () => {
  enum ETabs {
    CAMERA = 0,
    ENTITY = 1
  }
  const [selectedTab, setSelectedTab] = useState<ETabs>(ETabs.CAMERA);
  

  return (
    <div className="container-content properties-container">
      <div>
        <ul>
          <li>
            <button 
              type="button" 
              className={`${selectedTab === ETabs.CAMERA && 'selected'}`}
              onClick={() => setSelectedTab(ETabs.CAMERA)}
            >
              <BsCameraReels  />
            </button>
          </li>
          <li>
            <button 
              type="button"
              className={`${selectedTab === ETabs.ENTITY && 'selected'}`}
              onClick={() => setSelectedTab(ETabs.ENTITY)}
            >
              <BiCube  />
            </button>
          </li>
        </ul>
      </div>
      <div>
        <CameraProperties show={selectedTab === ETabs.CAMERA}  />
        <EntityProperties show={selectedTab === ETabs.ENTITY}  />
      </div>
    </div>
  );
};

/*
<h3> Properties: Camera </h3>
<Property 
  title="Translation" 
  defaultValue={selectedEntity?.getTransform().getTranslation()} 
  setProperty={setTranslation}  
/>


*/

export default PropertiesContainer;