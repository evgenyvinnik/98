import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './MenuBar.styles';
import Menu from './Menu';
import { type MenuItemDef, MENU_DIVIDER } from './MenuItem';

export type MenuBarDef = {
  [key: string]: (MenuItemDef | typeof MENU_DIVIDER)[];
};

interface MenuBarProps {
  menus: MenuBarDef;
}

const MenuBar: React.FC<MenuBarProps> = ({ menus }) => {
  const handleAction = (item: MenuItemDef) => {
    item.action?.();
  };

  return (
    <div {...stylex.props(styles.menuBar)}>
      {Object.entries(menus).map(([label, items]) => (
        <Menu key={label} label={label} items={items} onAction={handleAction} />
      ))}
    </div>
  );
};

export default MenuBar;
