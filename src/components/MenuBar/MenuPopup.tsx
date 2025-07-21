import React, { useState, useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './MenuPopup.styles';
import MenuItem, { type MenuItemDef, MENU_DIVIDER } from './MenuItem';

interface MenuPopupProps {
  items: (MenuItemDef | typeof MENU_DIVIDER)[];
  onClose: () => void;
  onAction: (item: MenuItemDef) => void;
}

const MenuPopup: React.FC<MenuPopupProps> = ({ items, onClose, onAction }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [submenu, setSubmenu] = useState<{ index: number; items: (MenuItemDef | typeof MENU_DIVIDER)[] } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // TODO: Implement keyboard navigation
  };

  const handleItemClick = (item: MenuItemDef, index: number) => {
    if (item.submenu) {
      setSubmenu({ index, items: item.submenu });
    } else {
      onAction(item);
    }
  };

  return (
    <div
      {...stylex.props(styles.menuPopup)}
      ref={ref}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onBlur={onClose}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          item={item}
          isHighlighted={highlightedIndex === index}
          onHover={() => setHighlightedIndex(index)}
          onClick={() => item !== MENU_DIVIDER && handleItemClick(item, index)}
        />
      ))}
      {submenu && (
        // This is a simplified implementation. A real implementation would need to handle positioning.
        <div style={{ position: 'absolute', left: '100%', top: 0 }}>
          <MenuPopup items={submenu.items} onClose={() => setSubmenu(null)} onAction={onAction} />
        </div>
      )}
    </div>
  );
};

export default MenuPopup;
