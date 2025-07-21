import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './MenuItem.styles';
import * as AccessKeys from './AccessKeys';

export const MENU_DIVIDER = 'MENU_DIVIDER';

export interface MenuItemDef {
  label?: string;
  action?: () => void;
  enabled?: boolean | (() => boolean);
  submenu?: (MenuItemDef | typeof MENU_DIVIDER)[];
  description?: string;
}

interface MenuItemProps {
  item: MenuItemDef | typeof MENU_DIVIDER;
  isHighlighted: boolean;
  onHover: () => void;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, isHighlighted, onHover, onClick }) => {
  if (item === MENU_DIVIDER) {
    return <div {...stylex.props(styles.divider)} />;
  }

  const isDisabled = typeof item.enabled === 'function' ? !item.enabled() : item.enabled === false;

  return (
    <div
      {...stylex.props(
        styles.menuItem,
        isDisabled && styles.disabled,
        isHighlighted && !isDisabled && styles.highlighted,
        item.submenu && styles.hasSubmenu
      )}
      onMouseEnter={onHover}
      onClick={!isDisabled ? onClick : undefined}
    >
      <span>{item.label && AccessKeys.toReact(item.label)}</span>
      {item.submenu && <div {...stylex.props(styles.submenuArrow)} />}
    </div>
  );
};

export default MenuItem;
