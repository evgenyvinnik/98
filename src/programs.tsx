import React from 'react';
import Notepad from './components/apps/Notepad';

export interface Program {
  title: string;
  iconID: string;
  component: React.ComponentType;
}

const Placeholder: React.FC<{ title: string }> = ({ title }) => <div>{`${title} content will be implemented soon.`}</div>;

export const programs: Program[] = [
  { title: 'My Computer', iconID: 'my-computer', component: () => <Placeholder title="My Computer" /> },
  { title: 'My Documents', iconID: 'my-documents-folder', component: () => <Placeholder title="My Documents" /> },
  { title: 'Network Neighborhood', iconID: 'network', component: () => <Placeholder title="Network Neighborhood" /> },
  { title: 'Recycle Bin', iconID: 'recycle-bin', component: () => <Placeholder title="Recycle Bin" /> },
  { title: 'My Pictures', iconID: 'folder', component: () => <Placeholder title="My Pictures" /> },
  { title: 'Internet Explorer', iconID: 'internet-explorer', component: () => <Placeholder title="Internet Explorer" /> },
  { title: 'Paint', iconID: 'paint', component: () => <Placeholder title="Paint" /> },
  { title: 'Minesweeper', iconID: 'minesweeper', component: () => <Placeholder title="Minesweeper" /> },
  { title: 'Sound Recorder', iconID: 'speaker', component: () => <Placeholder title="Sound Recorder" /> },
  { title: 'Solitaire', iconID: 'solitaire', component: () => <Placeholder title="Solitaire" /> },
  { title: 'Notepad', iconID: 'notepad', component: Notepad },
  { title: 'Winamp', iconID: 'winamp2', component: () => <Placeholder title="Winamp" /> },
  { title: '3D Pipes', iconID: 'pipes', component: () => <Placeholder title="3D Pipes" /> },
  { title: '3D Flower Box', iconID: 'pipes', component: () => <Placeholder title="3D Flower Box" /> },
  { title: 'MS-DOS Prompt', iconID: 'msdos', component: () => <Placeholder title="MS-DOS Prompt" /> },
  { title: 'Calculator', iconID: 'calculator', component: () => <Placeholder title="Calculator" /> },
  { title: 'Pinball', iconID: 'pinball', component: () => <Placeholder title="Pinball" /> },
];
