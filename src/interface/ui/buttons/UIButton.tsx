
import React from 'react';
import { IconType } from 'react-icons';

interface UIButtonProps {
  template: string
  icon?: IconType
  tooltip?: string
  children?: string 
  onActionPerformed?: () => void
}

const UIButton: React.FC<UIButtonProps> = (props) => {
  const icon = props.icon ? React.createElement(props.icon) : ''
  return (
    <button 
      type="button" 
      onClick={props.onActionPerformed}
      className={`button-${props.template}`}
      title={props.tooltip}
    >
      {icon}
      {props.children}
    </button>
  );
};

export default UIButton;