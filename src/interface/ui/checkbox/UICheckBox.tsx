import { StateSetter } from '@custom-types/react-hooks';
import React from 'react';

interface UICheckBoxProps {
  id: string
  label: string
  checked: boolean
  onActionPerformed: StateSetter<boolean>
}

const UICheckBox: React.FC<UICheckBoxProps> = (props) => {
  return (
    <div className="ui-checkbox">
      <input 
        id={props.id}
        name={props.id}
        type="checkbox" 
        checked={props.checked}
        onChange={() => props.onActionPerformed(!props.checked)}
      />
      <span></span>
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
};

export default UICheckBox;