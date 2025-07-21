import React from 'react';
import Notepad from './components/apps/Notepad';
import IframeApp from './components/apps/IframeApp';

export interface Program {
  title: string;
  icon: string;
  component: React.ComponentType<any>;
}

const Placeholder: React.FC = () => (
  <div style={{ padding: '20px' }}>
    <h2>Coming Soon</h2>
    <p>This program is not yet implemented.</p>
  </div>
);

export const programs: Program[] = [
  { title: 'My Computer', icon: 'my-computer', component: Placeholder },
  { title: 'My Documents', icon: 'my-documents-folder', component: Placeholder },
  { title: 'Network Neighborhood', icon: 'network', component: Placeholder },
  { title: 'Recycle Bin', icon: 'recycle-bin', component: Placeholder },
  { title: 'My Pictures', icon: 'folder', component: Placeholder },
    { title: 'Internet Explorer', icon: 'internet-explorer', component: () => <IframeApp src="https://www.google.com/webhp?igu=1" title="Internet Explorer" /> },
  { title: 'Paint', icon: 'paint', component: Placeholder },
  { title: 'Minesweeper', icon: 'minesweeper', component: Placeholder },
  { title: 'Sound Recorder', icon: 'speaker', component: Placeholder },
  { title: 'Solitaire', icon: 'solitaire', component: Placeholder },
  { title: 'Notepad', icon: 'notepad', component: Notepad },
  { title: 'Winamp', icon: 'winamp2', component: Placeholder },
  { title: '3D Pipes', icon: 'pipes', component: Placeholder },
  { title: '3D Flower Box', icon: 'pipes', component: Placeholder },
  { title: 'MS-DOS Prompt', icon: 'msdos', component: Placeholder },
  { title: 'Calculator', icon: 'calculator', component: Placeholder },
  { title: 'Pinball', icon: 'pinball', component: Placeholder },
];
