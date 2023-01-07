// import UIButton from "@ui/buttons/UIButton";
import ResourceManager from "@views/resourceManager/ResourceManager";
import SceneManager from "@views/sceneManager/SceneManager";
import Viewport from "@views/viewport/Viewport";
import React, { useEffect, useLayoutEffect, useMemo, useReducer, useRef } from "react";

import { useDispatch } from '@store/Root.store'
import { RazorActions } from "@store/Razor.store";
import RazorInterfaceCore from "@interface-core/RazorInterfaceCore";
import ResourceLoader from "@engine/core/ResourceLoader";
import produce from "immer";
import PropertiesContainer from "@views/propertiesContainer/PropertiesContainer";
import Transform from "@engine/math/Transform";
import { numberToString } from "bigfloat";
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
