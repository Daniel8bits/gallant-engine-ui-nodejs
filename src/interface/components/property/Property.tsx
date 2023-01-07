import Vec3 from '@engine/math/Vec3';
import UIInputSlider from '@ui/inputslider/UIInputSlider';
//import { BigFloat32 } from 'bigfloat';
import React, { useEffect, useState } from 'react';

interface PropertyProps {
  title: string
  vector?: Vec3
  defaultValue?: Vec3
  setProperty: (x: number, y: number, z: number) => void
  disabled?: boolean
}

const Property: React.FC<PropertyProps> = (props) => {
  const [x, setX] = useState<number>( props.defaultValue ? props.defaultValue.x*100 : 0 );
  const [y, setY] = useState<number>( props.defaultValue ? props.defaultValue.y*100 : 0 );
  const [z, setZ] = useState<number>( props.defaultValue ? props.defaultValue.z*100 : 0 );

  useEffect(() => {
    props.setProperty(x/100, y/100, z/100)
  }, [x, y, z]);

  useEffect(() => {
    if(props.vector) {
      setX(props.vector.x*100)
      setY(props.vector.y*100)
      setZ(props.vector.z*100)
    }
  }, [props.vector]);

  return (
    <div className="property">
        <h4> {props.title} </h4>
        <ul>
          <li>
            <span>x</span> 
            <UIInputSlider 
              value={x} 
              onActionPerformed={setX}  
              disabled={props.disabled}
            />
          </li>
          <li>
            <span>y</span> 
            <UIInputSlider 
              value={y} 
              onActionPerformed={setY}  
              disabled={props.disabled}
            />
          </li>
          <li>
            <span>z</span>
            <UIInputSlider 
              value={z} 
              onActionPerformed={setZ}  
              disabled={props.disabled}
            />
          </li>
        </ul>
      </div>
  );
};

export default Property;