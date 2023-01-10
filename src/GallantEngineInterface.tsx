import ResourceManager from "@views/resourceManager/ResourceManager";
import SceneManager from "@views/sceneManager/SceneManager";
import Viewport from "@views/viewport/Viewport";
import React, { useEffect, useRef } from "react";

import PropertiesContainer from "@views/propertiesContainer/PropertiesContainer";
import { EGallantResources, useGallantConfig, useGallantStore } from "@store/Global.store";


const GallantEngineInterface: React.FC<JSX.IntrinsicAttributes> = () => {

  const config = useGallantConfig()
  const gallant = useGallantStore()
  const ref = useRef<HTMLCanvasElement>();

  useEffect(() => {
    if(ref.current) {
      config.init(ref.current)
      gallant.createObserver({ resource: EGallantResources.VAO })
      config.start()
    }
  }, []);

  return (
    <div className="main">
      <div className="container viewport">
        <Viewport ref={ref}  />
      </div>
      <div className="container side-container">
        <SceneManager  />
        <PropertiesContainer  />
      </div>
      <div className="container bottom-container">
        <ResourceManager  />
      </div>
    </div>
  );
}

/* 
<UIButton 
        template="primary"
        onActionPerformed={() => {console.log('hi!');}}
      >
        Click here
      </UIButton>

*/

export default GallantEngineInterface;
