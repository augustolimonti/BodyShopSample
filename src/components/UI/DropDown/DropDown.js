import arrowRight from '../../../img/arrow-right.svg';
import React from 'react';
import styles from './DropDown.module.scss';
export default function DropDown({ value, values, selectValue,dropdownLabel='' }) {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen(!open);
  const handleClose = () => setOpen(false);
  const btnRef = React.useRef();
  const dropdownRef = React.useRef();
  useOutsideClick({ dropdownRef, btnRef, outsideAction: handleClose });
  return (
    <div className={styles.wrapper}>
      <div ref={btnRef} onClick={handleClick} className={styles.btn}>
        <p className={styles.value}>{dropdownLabel} {value?.label || value}</p>{' '}
        <p className={`${styles.chevron} ${open ? styles.open : ''}`}>
          <img src={arrowRight} alt="expand" />
        </p>
      </div>
      <div
        ref={dropdownRef}
        className={`${styles.dropdown} ${open ? styles.open : ''} scrollbar-thin`}
      >
        {values.map((val) => (
          <div
            onClick={() => {
              selectValue(val);
              handleClose();
            }}
            key={val}
            className="cursor-pointer hover:opacity-50"
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );
}
function useOutsideClick({ dropdownRef, btnRef, outsideAction }) {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        !dropdownRef?.current?.contains(event.target) &&
        !btnRef?.current?.contains(event.target)
      ) {
        outsideAction();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
}
