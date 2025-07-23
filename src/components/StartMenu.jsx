import React from 'react';

const StartMenu = ({ isOpen, closeMenu }) => {
  // This component is currently just a placeholder for the start menu's UI.
  // The logic for opening/closing is managed in the parent Taskbar component.
  if (!isOpen) {
    return null;
  }

  return (
    <div className="start-menu outset-deep" style={{ display: 'block', zIndex: 5001 }}>
      <div className="start-menu-titlebar"></div>
      <div className="start-menu-content">
        <h1 style={{ fontFamily: 'cursive', fontSize: '2em' }}>’S tart</h1>
        <h2 style={{ fontFamily: 'cursive', fontSize: '1em', color: 'gray', margin: '0', marginLeft: '300px', whiteSpace: 'nowrap' }}>’s a strawberry tart</h2>
        <img src="https://i.postimg.cc/dtxsJq0d/CK1IhDr.gif" alt="" />
      </div>
    </div>
  );
};

export default StartMenu;
