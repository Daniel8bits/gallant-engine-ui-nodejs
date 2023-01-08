import ResourceManager from "@views/resourceManager/ResourceManager";
import SceneManager from "@views/sceneManager/SceneManager";
import Viewport from "@views/viewport/Viewport";
import React, { useRef } from "react";

import PropertiesContainer from "@views/propertiesContainer/PropertiesContainer";
import RazorProvider from "@providers/RazorProvider";

const RazorEngineInterface: React.FC<JSX.IntrinsicAttributes> = () => {

  const ref = useRef<HTMLCanvasElement>();

  return (
    <RazorProvider canvasRef={ref}>
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
    </RazorProvider>
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

export default RazorEngineInterface;
