import useGameCore from '@hooks/useGameCore';

import React, { forwardRef, useContext } from 'react';
import { RazorContext, RazorObserverActions } from '@providers/RazorProvider';

interface ViewportProps {
  
}

const Viewport: React.ForwardRefRenderFunction<HTMLCanvasElement, ViewportProps> = (props, ref) => {

  const core = useGameCore()
  const razorContext = useContext(RazorContext);


  function selectEntity(e: React.MouseEvent) {
    const entity = core.selectEntity(e.clientX, e.clientY)
    if(entity) {
      razorContext.observerDispatch({
        type: RazorObserverActions.selectEntity,
        payload: entity
      })
    }
  }

  return (
    <canvas 
      ref={ref as React.MutableRefObject<HTMLCanvasElement>} 
      className='container-content'
      onClick={selectEntity}
    >
    </canvas>
  );
};

export default forwardRef(Viewport);