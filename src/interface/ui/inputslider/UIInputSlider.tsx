import React, { useEffect, useRef, useState } from 'react';
import {BigFloat32} from 'bigfloat'

import { 
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa'
import { StateSetter } from '@custom-types/react-hooks';

interface UIInputSliderProps {
  value: number
  onActionPerformed: StateSetter<number>
  disabled?: boolean
}

const UIInputSlider: React.FC<UIInputSliderProps> = (props) => {
  const [writeMode, setWriteMode] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>();
  const displayRef = useRef<HTMLDivElement>();
  const clicked = useRef<boolean>(false);

  useEffect(() => {
    inputRef.current.valueAsNumber = props.value/100
    displayRef.current.innerText = formatValue(props.value)
  }, [props.value]);

  function enterInput() {
    if(!props.disabled) {
      setWriteMode(true)
      inputRef.current.focus()
    }
  }

  function exitInput() {
      props.onActionPerformed(Math.round(inputRef.current.valueAsNumber*100))
      setWriteMode(false)
  }

  function changeValue(e: React.MouseEvent) {
    if(!props.disabled) {
      const div = displayRef.current
  
      const container = div.parentElement.parentElement.parentElement
      .parentElement.parentElement.parentElement
      .parentElement.parentElement.parentElement
      .parentElement.parentElement
      
      const scrollTopInPX = (container.lastChild.firstChild as HTMLDivElement).getAttribute('style').split(',')[1]
  
      const scrollTop = scrollTopInPX ? Number(scrollTopInPX.substring(0, scrollTopInPX.length-2)) : 0
      
      if(clicked.current && e.movementX !== 0 && e.button === 0 && (
        e.clientX > container.offsetLeft+div.offsetLeft &&
        e.clientX < container.offsetLeft+div.offsetLeft+div.offsetWidth &&
        e.clientY > container.offsetTop-scrollTop+div.offsetTop &&
        e.clientY < container.offsetTop+div.offsetTop-scrollTop+div.offsetHeight
      )) {
        const v = e.movementX > 0 ? 10 : -10
        props.onActionPerformed(oldValue => oldValue+v)
      }
    }
  }

  function formatValue(value: number): string {
    const v = (value/100).toString()
    if(v.includes('.')) {
      return v.substring(0, v.indexOf('.')+3)
    }
    return v
  }

  function decrease() {
    if(!props.disabled) {
      props.onActionPerformed(oldValue => oldValue-100)
    }
  }

  function increase() {
    if(!props.disabled) {
      props.onActionPerformed(oldValue => oldValue+100)
    }
  }

  function handleKeyUp(e: React.KeyboardEvent) {
    if(e.key === 'Enter') {
      exitInput()
    }
  }

  return (
    <div 
      className={`input-slider ${props.disabled && 'disabled'}`}
      style={{
        width: '10rem'
      }}
    >
      <button type="button" onClick={decrease}>
        <FaChevronLeft  />
      </button>
      <div>
        <input 
          ref={inputRef} 
          type="number" 
          onBlur={exitInput}
          onKeyUp={handleKeyUp}
          style={{
            zIndex: writeMode ? '1' : '0'
          }}
        />
        <div 
          ref={displayRef} 
          onMouseMove={changeValue}
          onDoubleClick={enterInput}
          onMouseDown={() => {clicked.current = true}}
          onMouseUp={() => {clicked.current = false}}
          style={{
            zIndex: writeMode ? '0' : '1'
          }}
        >
        </div>
      </div>
      <button type="button" onClick={increase}>
        <FaChevronRight  />
      </button>
    </div>
  );
};

export default UIInputSlider;