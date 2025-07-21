import React from 'react';
import Notepad from './components/apps/Notepad';

export interface Program {
  title: string;
  icon: string;
  component: React.ComponentType<any> | string;
}

const Placeholder: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h2>{title}</h2>
    <p>This program is not yet implemented.</p>
  </div>
);

export const programs: Program[] = [
  { title: 'My Computer', icon: 'my-computer', component: () => <Placeholder title="My Computer" /> },
  { title: 'My Documents', icon: 'my-documents-folder', component: () => <Placeholder title="My Documents" /> },
  { title: 'Network Neighborhood', icon: 'network', component: () => <Placeholder title="Network Neighborhood" /> },
  { title: 'Recycle Bin', icon: 'recycle-bin', component: () => <Placeholder title="Recycle Bin" /> },
  { title: 'My Pictures', icon: 'folder', component: () => <Placeholder title="My Pictures" /> },
  { title: 'Internet Explorer', icon: 'internet-explorer', component: () => <Placeholder title="Internet Explorer" /> },
  { title: 'Paint', icon: 'paint', component: () => <Placeholder title="Paint" /> },
  { title: 'Minesweeper', icon: 'minesweeper', component: () => <Placeholder title="Minesweeper" /> },
  { title: 'Sound Recorder', icon: 'speaker', component: () => <Placeholder title="Sound Recorder" /> },
  { title: 'Solitaire', icon: 'solitaire', component: () => <Placeholder title="Solitaire" /> },
  { title: 'Notepad', icon: 'notepad', component: Notepad },
  { title: 'Winamp', icon: 'winamp2', component: () => <Placeholder title="Winamp" /> },
  { title: '3D Pipes', icon: 'pipes', component: () => <Placeholder title="3D Pipes" /> },
  { title: '3D Flower Box', icon: 'pipes', component: () => <Placeholder title="3D Flower Box" /> },
  { title: 'MS-DOS Prompt', icon: 'msdos', component: () => <Placeholder title="MS-DOS Prompt" /> },
  { title: 'Calculator', icon: 'calculator', component: () => <Placeholder title="Calculator" /> },
  { title: 'Pinball', icon: 'pinball', component: () => <Placeholder title="Pinball" /> },
];
