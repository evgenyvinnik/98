export const programs = [
  {
    id: 'notepad',
    name: 'Notepad',
    icon: 'notepad',
    acceptsFilePaths: true,
    launch: (filePath) => {
      const documentTitle = filePath ? window.file_name_from_path(filePath) : 'Untitled';
      const winTitle = `${documentTitle} - Notepad`;
      const win = window.make_iframe_window({
        src: `programs/notepad/index.html${filePath ? `?path=${filePath}` : ''}`,
        icons: window.iconsAtTwoSizes('notepad'),
        title: winTitle,
        outerWidth: 480,
        outerHeight: 321,
        resizable: true,
      });
      return new window.Task(win);
    },
  },
  {
    id: 'paint',
    name: 'Paint',
    icon: 'paint',
    acceptsFilePaths: true,
    launch: (filePath) => {
      const win = window.make_iframe_window({
        src: 'programs/jspaint/index.html',
        icons: window.iconsAtTwoSizes('paint'),
        title: 'untitled - Paint',
        outerWidth: 275,
        outerHeight: 400,
        minOuterWidth: 275,
        minOuterHeight: 400,
      });
      // This is a placeholder for the complex system hooks logic from the original file.
      // A full migration would require refactoring that logic to work within this new structure.
      return new window.Task(win);
    },
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    icon: 'minesweeper',
    launch: () => {
      const win = window.make_iframe_window({
        src: 'programs/minesweeper/index.html',
        icons: window.iconsAtTwoSizes('minesweeper'),
        title: 'Minesweeper',
        innerWidth: 280,
        innerHeight: 320 + 21,
        resizable: false,
      });
      return new window.Task(win);
    },
  },
  {
    id: 'sound-recorder',
    name: 'Sound Recorder',
    icon: 'speaker',
    acceptsFilePaths: true,
    launch: (filePath) => {
        const documentTitle = filePath ? window.file_name_from_path(filePath) : 'Sound';
        const winTitle = `${documentTitle} - Sound Recorder`;
        const win = window.make_iframe_window({
            src: `programs/sound-recorder/index.html${filePath ? `?path=${filePath}` : ''}`,
            icons: window.iconsAtTwoSizes('speaker'),
            title: winTitle,
            outerWidth: 260,
            outerHeight: 120,
            resizable: false,
        });
        return new window.Task(win);
    },
  },
  {
    id: 'webamp',
    name: 'Webamp',
    icon: 'winamp',
    launch: () => {
        const win = window.make_iframe_window({
            src: 'programs/webamp/index.html',
            icons: window.iconsAtTwoSizes('winamp'),
            title: 'Webamp',
        });
        return new window.Task(win);
    },
  },
  {
      id: 'help',
      name: 'Help',
      icon: 'chm',
      launch: (options) => {
        // The original show_help function is complex and directly manipulates the DOM.
        // For now, we'll call the original global function.
        // A full migration would require refactoring show_help into a React component.
        return window.show_help(options);
      }
  }
];

export const fileAssociations = {
  txt: 'notepad',
  md: 'notepad',
  js: 'notepad',
  css: 'notepad',
  html: 'notepad',
  gitattributes: 'notepad',
  gitignore: 'notepad',
  json: 'notepad',
  bmp: 'paint',
  png: 'paint',
  jpg: 'paint',
  jpeg: 'paint',
  gif: 'paint',
  webp: 'paint',
  wav: 'sound-recorder',
  // mp3: 'webamp',
  // ogg: 'webamp',
  // wma: 'webamp',
};
