import type { StateSetter } from '@custom-types/react-hooks';
import React from 'react';

interface UIInputTextProps {
  onActionPerformed: StateSetter<string>;
}

const UIInputText: React.FC<UIInputTextProps> = () => {
  return (
    <input type="text" />
  );
};

export default UIInputText;