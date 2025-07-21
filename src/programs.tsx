import React from 'react';
import { type MenuBarDef } from './components/MenuBar/MenuBar';
import { MENU_DIVIDER } from './components/MenuBar/MenuItem';
import Notepad from './components/apps/Notepad';
import WinampApp from './components/apps/Winamp';
import InternetExplorer from './components/apps/InternetExplorer';
import DisplayProperties from './components/apps/DisplayProperties';

export interface Program {
  title: string;
  icon: string;
  component: React.ComponentType<any>;
  menus?: MenuBarDef;
}

const notepadMenu: MenuBarDef = {
  '&File': [
    { label: '&New', action: () => alert('New file') },
    { label: '&Open...', action: () => alert('Open file') },
    { label: '&Save', action: () => alert('Save file') },
    { label: 'Save &As...', action: () => alert('Save As') },
    MENU_DIVIDER,
    { label: 'Page Se&tup...', action: () => alert('Page Setup') },
    { label: '&Print...', action: () => alert('Print') },
    MENU_DIVIDER,
    { label: 'E&xit', action: () => alert('Exit') },
  ],
  '&Edit': [
    { label: '&Undo', action: () => alert('Undo') },
    MENU_DIVIDER,
    { label: 'Cu&t', action: () => alert('Cut') },
    { label: '&Copy', action: () => alert('Copy') },
    { label: '&Paste', action: () => alert('Paste') },
    { label: 'De&lete', action: () => alert('Delete') },
    MENU_DIVIDER,
    { label: 'Select &All', action: () => alert('Select All') },
    { label: 'Time/&Date', action: () => alert('Time/Date') },
  ],
  '&Help': [
    { label: '&Help Topics', action: () => alert('Help Topics') },
    MENU_DIVIDER,
    { label: '&About Notepad', action: () => alert('About Notepad') },
  ],
};

const Placeholder: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <p>{`The ${title} application is not yet implemented.`}</p>
  </div>
);

export const programs: Program[] = [
  { title: 'My Computer', icon: 'my-computer', component: () => <Placeholder title="My Computer" /> },
  { title: 'My Documents', icon: 'my-documents-folder', component: () => <Placeholder title="My Documents" /> },
  { title: 'Network Neighborhood', icon: 'network', component: () => <Placeholder title="Network Neighborhood" /> },
  { title: 'Recycle Bin', icon: 'recycle-bin', component: () => <Placeholder title="Recycle Bin" /> },
  { title: 'My Pictures', icon: 'folder', component: () => <Placeholder title="My Pictures" /> },
  { title: 'Internet Explorer', icon: 'internet-explorer', component: InternetExplorer },
  { title: 'Paint', icon: 'paint', component: () => <Placeholder title="Paint" /> },
  { title: 'Minesweeper', icon: 'minesweeper', component: () => <Placeholder title="Minesweeper" /> },
  { title: 'Sound Recorder', icon: 'speaker', component: () => <Placeholder title="Sound Recorder" /> },
  { title: 'Solitaire', icon: 'solitaire', component: () => <Placeholder title="Solitaire" /> },
  { title: 'Notepad', icon: 'notepad', component: Notepad, menus: notepadMenu },
  { title: 'Winamp', icon: 'winamp2', component: WinampApp },
  { title: '3D Pipes', icon: 'pipes', component: () => <Placeholder title="3D Pipes" /> },
  { title: '3D Flower Box', icon: 'pipes', component: () => <Placeholder title="3D Flower Box" /> },
  { title: 'MS-DOS Prompt', icon: 'msdos', component: () => <Placeholder title="MS-DOS Prompt" /> },
  { title: 'Calculator', icon: 'calculator', component: () => <Placeholder title="Calculator" /> },
  { title: 'Pinball', icon: 'pinball', component: () => <Placeholder title="Pinball" /> },
  { title: 'Display Properties', icon: 'display-properties', component: DisplayProperties },
];
