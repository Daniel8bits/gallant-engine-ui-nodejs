import { useGallantStore, useGameCore } from '@store/Global.store';
import React, { forwardRef } from 'react';

interface ViewportProps {
  
}

const Viewport: React.ForwardRefRenderFunction<HTMLCanvasElement, ViewportProps> = (props, ref) => {

  const core = useGameCore()
  const gallant = useGallantStore()


  function selectEntity(e: React.MouseEvent) {
    const entity = core.selectEntity(e.clientX, e.clientY)
    if(entity) {
      gallant.selectEntity({entity})
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