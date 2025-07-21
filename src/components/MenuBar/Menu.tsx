import React, { useState, useRef, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './Menu.styles';
import MenuPopup from './MenuPopup';
import { type MenuItemDef, MENU_DIVIDER } from './MenuItem';
import * as AccessKeys from './AccessKeys';

interface MenuProps {
  label: string;
  items: (MenuItemDef | typeof MENU_DIVIDER)[];
  onAction: (item: MenuItemDef) => void;
}

const Menu: React.FC<MenuProps> = ({ label, items, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div ref={ref} {...stylex.props(styles.menuContainer)}>
      <button
        {...stylex.props(styles.menuButton, isOpen && styles.menuButtonOpen)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {AccessKeys.toReact(label)}
      </button>
      {isOpen && <MenuPopup items={items} onClose={handleClose} onAction={onAction} />}
    </div>
  );
};

export default Menu;
