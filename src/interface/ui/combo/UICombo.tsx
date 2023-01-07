import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import {StateSetter} from '@custom-types/react-hooks'
import {FaChevronDown} from 'react-icons/fa'
import onClickOutside from '@utils/onClickOutside';

interface UIComboProps {
  value: string
  items: string[]
  strict?: boolean;
  onActionPerformed: StateSetter<string>
}

const UICombo: React.FC<UIComboProps> = (props) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>();
  const event = useRef<(e: MouseEvent) => void>(null);

  useEffect(() => {
    if(open) {
      if(event.current) {
          document.removeEventListener('click', event.current, true)
          event.current = null
      }

      event.current = onClickOutside(ref.current, () => {
        setOpen(false)
      })
    }
  }, [open]);

  function selectItem(value: string) {
    props.onActionPerformed(value)
  }

  const width = ref.current ? ref.current.offsetWidth - 2 : 0;

  const height = useMemo<number>((): number => {
    return props.items.length * 29 + (props.strict ? 0 : 29);
  }, [props.items, props.strict])

  const getX = useCallback((): number => {
    if(!ref.current) {
        return 0;
    }
    return ref.current.offsetLeft + 1
  }, [])

  const getY = useCallback((): number => {
    if(!ref.current) {
        return 0;
    }
    const gap = 4
    const anchorY1 = ref.current.offsetTop
    const anchorY2 = anchorY1 + ref.current.offsetHeight
    
    if(anchorY2+gap+height < window.innerHeight) {
        return anchorY2+gap
    }
    return anchorY1-gap
  }, [])

  return (
    <div 
      ref={ref} 
      className="combo"
      onClick={() => setOpen(!open)}
    >
      <div>{!props.value ? 'none' : props.value}</div>
      <FaChevronDown  />
      <div 
        className="comboPopover"
        style={{
          display: open ? 'block' : 'none',
          left: `${getX()}px`,
          top: `${getY()}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <ul>
          {!props.strict && <li onClick={() => selectItem(null)}> none </li>}
          {props.items.map((item) => {
            return <li key={item} onClick={() => selectItem(item)}>{item}</li>
          })}
        </ul>
      </div>
    </div>
  );
};

export default UICombo;