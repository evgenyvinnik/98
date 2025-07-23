import React, { useState, useEffect, useRef } from 'react';

const Desktop = () => {
  const [wallpaperStyle, setWallpaperStyle] = useState({
    backgroundImage: 'url(images/clouds.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  });
  const folderViewRef = useRef(null);

  useEffect(() => {
    // Expose a function for legacy scripts to set the wallpaper
    window.setDesktopWallpaper = (file, repeat, saveToLocalStorage) => {
      const blob_url = URL.createObjectURL(file);
      setWallpaperStyle({
        backgroundImage: `url(${blob_url})`,
        backgroundRepeat: repeat,
        backgroundPosition: 'center',
        backgroundSize: 'auto',
      });

      if (saveToLocalStorage) {
        const fr = new FileReader();
        fr.onload = () => {
          localStorage.setItem('wallpaper-data-url', fr.result);
          localStorage.setItem('wallpaper-repeat', repeat);
        };
        fr.readAsDataURL(file);
      }
    };

    // Load initial wallpaper from localStorage
    try {
      const wallpaper_data_url = localStorage.getItem('wallpaper-data-url');
      const wallpaper_repeat = localStorage.getItem('wallpaper-repeat');
      if (wallpaper_data_url) {
        fetch(wallpaper_data_url)
          .then(r => r.blob())
          .then(file => {
            window.setDesktopWallpaper(file, wallpaper_repeat, false);
          });
      }
    } catch (error) {
      console.error('Failed to load wallpaper:', error);
    }

    // --- Theme Loading Logic ---
    window.applyTheme = (cssProperties, documentElement = document.documentElement) => {
      window.applyCSSProperties(cssProperties, { element: documentElement, recurseIntoIframes: true });
    };
    window.loadThemeFromText = (fileText) => {
      const cssProperties = window.parseThemeFileString(fileText);
      window.applyTheme(cssProperties);
      window.themeCSSProperties = cssProperties;
    };
    window.loadThemeFile = (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        window.loadThemeFromText(reader.result);
      };
      reader.readAsText(file);
    };

    try {
        const theme_file_content = localStorage.getItem("desktop-theme");
        if (theme_file_content) {
            window.loadThemeFromText(theme_file_content);
        }
    } catch (error) {
        console.error(error);
    }

    // --- FolderView Integration ---
    if (folderViewRef.current) {
      const folder_view = new window.FolderView(window.desktop_folder_path, {
        asDesktop: true,
        openFileOrFolder: (path) => {
          window.systemExecuteFile(path);
        },
      });
      folderViewRef.current.appendChild(folder_view.element);
    }
    
    // --- Global Event Listeners ---
    const preventDefault = (e) => e.preventDefault();
    window.addEventListener('scroll', preventDefault, true);
    window.addEventListener('focusin', preventDefault, true);

    const onDrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const files = [...event.dataTransfer.files];
      for (const file of files) {
        if (file.name.match(/\.theme(pack)?$/i)) {
          window.loadThemeFile(file);
        }
      }
    };

    const htmlEl = document.documentElement;
    htmlEl.addEventListener('dragover', preventDefault);
    htmlEl.addEventListener('dragleave', preventDefault);
    htmlEl.addEventListener('drop', onDrop);

    // Cleanup function
    return () => {
      delete window.setDesktopWallpaper;
      delete window.loadThemeFile;
      delete window.loadThemeFromText;
      delete window.applyTheme;
      window.removeEventListener('scroll', preventDefault, true);
      window.removeEventListener('focusin', preventDefault, true);
      htmlEl.removeEventListener('dragover', preventDefault);
      htmlEl.removeEventListener('dragleave', preventDefault);
      htmlEl.removeEventListener('drop', onDrop);
    };
  }, []);

  return (
    <div className="desktop" style={wallpaperStyle}>
      <div ref={folderViewRef} style={{width: '100%', height: '100%'}}></div>
    </div>
  );
};

export default Desktop;
