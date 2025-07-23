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
};

// The original show_help function is complex and heavily relies on jQuery and direct DOM manipulation.
// A full migration would require a significant rewrite into a React component.
// For now, we'll keep it available as a global function to ensure the help system doesn't break.
window.show_help = function(options) {
    const $help_window = window.$Window({
        title: options.title || "Help Topics",
        icons: window.iconsAtTwoSizes("chm"),
        resizable: true,
    })
    $help_window.addClass("help-window");

    let ignore_one_load = true;
    let back_length = 0;
    let forward_length = 0;

    const $main = window.$("<div>").addClass("main");
    const $toolbar = window.$("<div>").addClass("toolbar");
    const add_toolbar_button = (name, sprite_n, action_fn, enabled_fn) => {
        const $button = window.$("<button class='lightweight'>")
            .append(window.$("<span>").text(name))
            .appendTo($toolbar)
            .on("click", () => {
                action_fn();
            });
        window.$("<div class='icon'/>")
            .appendTo($button)
            .css({
                backgroundPosition: `${-sprite_n * 55}px 0px`,
            });
        const update_enabled = () => {
            $button[0].disabled = enabled_fn && !enabled_fn();
        };
        update_enabled();
        $help_window.on("click", "*", update_enabled);
        $help_window.on("update-buttons", update_enabled);
        return $button;
    };
    const measure_sidebar_width = () =>
        $contents.outerWidth() +
        parseFloat(getComputedStyle($contents[0]).getPropertyValue("margin-left")) +
        parseFloat(getComputedStyle($contents[0]).getPropertyValue("margin-right")) +
        $resizer.outerWidth();
    const $hide_button = add_toolbar_button("Hide", 0, () => {
        const toggling_width = measure_sidebar_width();
        $contents.hide();
        $resizer.hide();
        $hide_button.hide();
        $show_button.show();
        $help_window.width($help_window.width() - toggling_width);
        $help_window.css("left", $help_window.offset().left + toggling_width);
    });
    const $show_button = add_toolbar_button("Show", 5, () => {
        $contents.show();
        $resizer.show();
        $show_button.hide();
        $hide_button.show();
        const toggling_width = measure_sidebar_width();
        $help_window.width($help_window.width() + toggling_width);
        $help_window.css("left", $help_window.offset().left - toggling_width);
        if ($help_window.offset().left < 0) {
            $help_window.width($help_window.width() + $help_window.offset().left);
            $help_window.css("left", 0);
        }
    }).hide();
    add_toolbar_button("Back", 1, () => {
        $iframe[0].contentWindow.history.back();
        ignore_one_load = true;
        back_length -= 1;
        forward_length += 1;
    }, () => back_length > 0);
    add_toolbar_button("Forward", 2, () => {
        $iframe[0].contentWindow.history.forward();
        ignore_one_load = true;
        forward_length -= 1;
        back_length += 1;
    }, () => forward_length > 0);
    add_toolbar_button("Options", 3, () => { }, () => false);
    add_toolbar_button("Web Help", 4, () => {
        iframe.src = "help/online_support.htm";
    });

    const $iframe = window.$("<iframe sandbox='allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-downloads'>")
        .attr({ src: "help/default.html" })
        .addClass("inset-deep");
    const iframe = $iframe[0];
    window.enhance_iframe(iframe);
    iframe.$window = $help_window;
    const $resizer = window.$("<div>").addClass("resizer");
    const $contents = window.$("<ul>").addClass("contents inset-deep");

    $iframe.on("load", () => {
        if (!ignore_one_load) {
            back_length += 1;
            forward_length = 0;
        }
        ignore_one_load = false;
        $help_window.triggerHandler("update-buttons");
    });

    $main.append($contents, $resizer, $iframe);
    $help_window.$content.append($toolbar, $main);

    $help_window.css({ width: 800, height: 600 });

    $iframe.attr({ name: "help-frame" });
    $iframe.css({
        backgroundColor: "white",
        border: "",
        margin: "1px",
    });
    $contents.css({
        margin: "1px",
    });
    $help_window.center();
			if (includeButterchurn) {
				$.getScript("programs/winamp/lib/butterchurn.min.js", () => {
					$.getScript("programs/winamp/lib/butterchurnPresets.min.js", () => {
						callback();
					});
				});
			} else {
				callback();
			}
		});
	}
}

// from https://github.com/jberg/butterchurn/blob/master/src/isSupported.js
const isButterchurnSupported = () => {
	const canvas = document.createElement('canvas');
	let gl;
	try {
		gl = canvas.getContext('webgl2');
	} catch (x) {
		gl = null;
	}

	const webGL2Supported = !!gl;
	const audioApiSupported = !!(window.AudioContext || window.webkitAudioContext);

	return webGL2Supported && audioApiSupported;
};

let webamp;
let $webamp;
let winamp_task;
let winamp_interface;
let winamp_loading = false;
// TODO: support opening multiple files at once
function openWinamp(file_path) {
	const filePathToBlob = (file_path) => {
		return new Promise((resolve, reject) => {
			withFilesystem(function () {
				var fs = BrowserFS.BFSRequire("fs");
				fs.readFile(file_path, function (err, buffer) {
					if (err) {
						return reject(err);
					}
					const byte_array = new Uint8Array(buffer);
					const blob = new Blob([byte_array]);
					resolve(blob);
				});
			});
		});
	};

	const filePathToTrack = async (file_path) => {
		const blob = await filePathToBlob(file_path);
		const blob_url = URL.createObjectURL(blob);
		// TODO: revokeObjectURL
		const track = {
			url: blob_url,
			defaultName: file_name_from_path(file_path).replace(/\.[a-z0-9]+$/i, ""),
		};
		return track;
	};

	const whenLoaded = async () => {
		if ($webamp.css("display") === "none") {
			winamp_interface.unminimize();
		}

		winamp_interface.focus();

		if (file_path) {
			if (file_path.match(/(\.wsz|\.zip)$/i)) {
				const blob = await filePathToBlob(file_path);
				const url = URL.createObjectURL(blob);
				webamp.setSkinFromUrl(url);
			} else if (file_path.match(/(\.m3u|\.pls)$/i)) {
				alert("Sorry, we don't support playlists yet.");
			} else {
				const track = await filePathToTrack(file_path);
				webamp.setTracksToPlay([track]);
			}
		}

		winamp_loading = false;
	}
	if (winamp_task) {
		whenLoaded()
		return;
	}
	if (winamp_loading) {
		return; // TODO: queue up files?
	}
	winamp_loading = true;

	// This check creates a WebGL context, so don't do it if you try to open Winamp while it's opening or open.
	// (Otherwise it will lead to "WARNING: Too many active WebGL contexts. Oldest context will be lost.")
	const includeButterchurn = isButterchurnSupported();

	load_winamp_bundle_if_not_loaded(includeButterchurn, function () {
		const webamp_options = {
			initialTracks: [{
				metaData: {
					artist: "DJ Mike Llama",
					title: "Llama Whippin' Intro",
				},
				url: "programs/winamp/mp3/llama-2.91.mp3",
				duration: 5.322286,
			}],
			// initialSkin: {
			// 	url: "programs/winamp/skins/base-2.91.wsz",
			// },
			enableHotkeys: true,
			handleTrackDropEvent: (event) =>
				Promise.all(
					dragging_file_paths.map(filePathToTrack)
				),
			// TODO: filePickers
		};
		if (includeButterchurn) {
			webamp_options.__butterchurnOptions = {
				importButterchurn: () => Promise.resolve(window.butterchurn),
				getPresets: () => {
					const presets = window.butterchurnPresets.getPresets();
					return Object.keys(presets).map((name) => {
						return {
							name,
							butterchurnPresetObject: presets[name]
						};
					});
				},
				butterchurnOpen: true,
			};
			webamp_options.__initialWindowLayout = {
				main: { position: { x: 0, y: 0 } },
				equalizer: { position: { x: 0, y: 116 } },
				playlist: { position: { x: 0, y: 232 }, size: [0, 4] },
				milkdrop: { position: { x: 275, y: 0 }, size: [7, 12] }
			};
		}
		webamp = new Webamp(webamp_options);

		var visual_container = document.createElement("div");
		visual_container.classList.add("webamp-visual-container");
		visual_container.style.position = "absolute";
		visual_container.style.left = "0";
		visual_container.style.right = "0";
		visual_container.style.top = "0";
		visual_container.style.bottom = "0";
		visual_container.style.pointerEvents = "none";
		document.body.appendChild(visual_container);
		// Render after the skin has loaded.
		webamp.renderWhenReady(visual_container).then(() => {
			window.console && console.log("Webamp rendered");

			$webamp = $("#webamp");
			// Bring window to front, initially and when clicked
			$webamp.css({
				position: "absolute",
				left: 0,
				top: 0,
				zIndex: $Window.Z_INDEX++
			});

			const $eventTarget = $({});
			const makeSimpleListenable = (name) => {
				return (callback) => {
					const fn = () => {
						callback();
					};
					$eventTarget.on(name, fn);
					const dispose = () => {
						$eventTarget.off(name, fn);
					};
					return dispose;
				};
			};

			winamp_interface = {};
			winamp_interface.onFocus = makeSimpleListenable("focus");
			winamp_interface.onBlur = makeSimpleListenable("blur");
			winamp_interface.onClosed = makeSimpleListenable("closed");
			winamp_interface.getIconAtSize = (target_icon_size) => {
				if (target_icon_size !== 32 && target_icon_size !== 16) {
					target_icon_size = 32;
				}
				const img = document.createElement("img");
				img.src = getIconPath("winamp2", target_icon_size);
				return img;
			};
			winamp_interface.bringToFront = () => {
				$webamp.css({
					zIndex: $Window.Z_INDEX++
				});
			};
			winamp_interface.element = winamp_interface[0] = $webamp[0]; // for checking z-index in window switcher
			winamp_interface.hasClass = (className) => { // also for window switcher (@TODO: clean this stuff up)
				if (className === "focused") {
					return $webamp.hasClass("focused");
				}
				return false;
			};
			winamp_interface.focus = () => {
				if (!$webamp.hasClass("focused")) {
					$webamp.addClass("focused");
					winamp_interface.bringToFront();
					$eventTarget.triggerHandler("focus");
					// @TODO: focus last focused window/control?
					$webamp.find("#main-window [tabindex='-1']").focus();
				}
			};
			winamp_interface.blur = () => {
				if ($webamp.hasClass("focused")) {
					$webamp.removeClass("focused");
					$eventTarget.triggerHandler("blur");
					// TODO: really blur
				}
			};
			winamp_interface.minimize = () => {
				// TODO: are these actually useful or does webamp hide it?
				$webamp.hide();
			};
			winamp_interface.unminimize = () => {
				// more to the point does this work necessarily??
				$webamp.show();
				// $webamp.focus();
			};
			winamp_interface.close = () => {
				// not allowing canceling close event in this case (generally used *by* an application (for "Save changes?"), not outside of it)
				// TODO: probably something like winamp_task.close()
				// winamp_interface.triggerHandler("close");
				// winamp_interface.triggerHandler("closed");
				webamp.dispose();
				$webamp.remove();

				$eventTarget.triggerHandler("closed");

				webamp = null;
				$webamp = null;
				winamp_task = null;
				winamp_interface = null;
			};
			winamp_interface.getTitle = () => {
				let taskTitle = "Winamp 2.91";
				const $cell = $webamp.find(".playlist-track-titles .track-cell.current");
				if ($cell.length) {
					taskTitle = `${$cell.text()} - Winamp`;
					switch (webamp.getMediaStatus()) {
						case "STOPPED":
							taskTitle = `${taskTitle} [Stopped]`
							break;
						case "PAUSED":
							taskTitle = `${taskTitle} [Paused]`
							break;
					}
				}
				return taskTitle;
			};
			winamp_interface.setMinimizeTarget = () => {
				// dummy function; it won't animate to the minimize target anyway
				// (did Winamp on Windows 98 animate minimize/restore?)
			};
			// @TODO: this wasn't supposed to be part of the API, but it's needed for the taskbar
			winamp_interface.on = (event_name, callback) => {
				if (event_name === "title-change") {
					webamp.onTrackDidChange(callback);
				} else if (event_name === "icon-change") {
					// icon will never change
				} else {
					console.warn(`Unsupported event: ${event_name}`);
				}
			};

			mustHaveMethods(winamp_interface, windowInterfaceMethods);

			let raf_id;
			let global_pointerdown;

			winamp_task = new Task(winamp_interface);
			webamp.onClose(function () {
				winamp_interface.close();
				cancelAnimationFrame(raf_id);
				visualizerOverlay.fadeOutAndCleanUp();
			});
			webamp.onMinimize(function () {
				winamp_interface.minimize();
			});

			$webamp.on("focusin", () => {
				winamp_interface.focus();
			});
			$webamp.on("focusout", () => {
				// could use relatedTarget, no?
				if (
					!document.activeElement ||
					!document.activeElement.closest ||
					!document.activeElement.closest("#webamp")
				) {
					winamp_interface.blur();
				}
			});

			const visualizerOverlay = new VisualizerOverlay(
				$webamp.find(".gen-window canvas")[0],
				{ mirror: true, stretch: true },
			);

			// TODO: replace with setInterval
			// Note: can't access butterchurn canvas image data during a requestAnimationFrame here
			// because of double buffering
			const animate = () => {
				const windowElements = $(".os-window, .window:not(.gen-window)").toArray();
				windowElements.forEach(windowEl => {
					if (!windowEl.hasOverlayCanvas) {
						visualizerOverlay.makeOverlayCanvas(windowEl);
						windowEl.hasOverlayCanvas = true;
					}
				});

				if (webamp.getMediaStatus() === "PLAYING") {
					visualizerOverlay.fadeIn();
				} else {
					visualizerOverlay.fadeOut();
				}
				raf_id = requestAnimationFrame(animate);
			};
			raf_id = requestAnimationFrame(animate);

			whenLoaded()
		}, (error) => {
			// TODO: show_error_message("Failed to load Webamp:", error);
			alert("Failed to render Webamp:\n\n" + error);
			console.error(error);
		});
	});
}
openWinamp.acceptsFilePaths = true;

/*
function saveAsDialog(){
	var $win = new $Window();
	$win.title("Save As");
	return $win;
}
function openFileDialog(){
	var $win = new $Window();
	$win.title("Open");
	return $win;
}
*/

function openURLFile(file_path) {
	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire("fs");
		fs.readFile(file_path, "utf8", function (err, content) {
			if (err) {
				return alert(err);
			}
			// it's supposed to be an ini-style file, but lets handle files that are literally just a URL as well, just in case
			var match = content.match(/URL\s*=\s*([^\n\r]+)/i);
			var url = match ? match[1] : content;
			Explorer(url);
		});
	});
}
openURLFile.acceptsFilePaths = true;

function openThemeFile(file_path) {
	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire("fs");
		fs.readFile(file_path, "utf8", function (err, content) {
			if (err) {
				return alert(err);
			}
			loadThemeFromText(content);
			try {
				localStorage.setItem("desktop-theme", content);
				localStorage.setItem("desktop-theme-path", file_path);
			} catch (error) {
				// no local storage
			}
		});
	});
}
openThemeFile.acceptsFilePaths = true;

// Note: extensions must be lowercase here. This is used to implement case-insensitive matching.
var file_extension_associations = {
	// Fonts:
	// - eot (Embedded OpenType)
	// - otf (OpenType)
	// - ttf (TrueType)
	// - woff (Web Open Font Format)
	// - woff2 (Web Open Font Format 2)
	// - (also svg but that's mainly an image format)

	// Misc binary:
	// - wasm (WebAssembly)
	// - o (Object file)
	// - so (Shared Object)
	// - dll (Dynamic Link Library)
	// - exe (Executable file)
	// - a (static library)
	// - lib (static library)
	// - pdb (Program Debug database)
	// - idb (Intermediate Debug file)
	// - bcmap (Binary Character Map)
	// - bin (generic binary file extension)

	// Text:
	"": Notepad, // bare files such as LICENSE, Makefile, CNAME, etc.
	ahk: Notepad,
	ai: Paint,
	bat: Notepad,
	check_cache: Notepad,
	cmake: Notepad,
	cmd: Notepad,
	conf: Notepad,
	cpp: Notepad,
	css: Notepad,
	d: Notepad,
	editorconfig: Notepad,
	filters: Notepad,
	gitattributes: Notepad,
	gitignore: Notepad,
	gitrepo: Notepad,
	h: Notepad,
	hhc: Notepad,
	hhk: Notepad,
	html: Notepad,
	ini: Notepad,
	js: Notepad,
	json: Notepad,
	log: Notepad,
	make: Notepad,
	map: Notepad,
	marks: Notepad,
	md: Notepad,
	prettierignore: Notepad,
	properties: Notepad,
	rc: Notepad,
	rsp: Notepad,
	sh: Notepad,
	ts: Notepad,
	txt: Notepad,
	vcxproj: Notepad,
	webmanifest: Notepad,
	xml: Notepad,
	yml: Notepad,

	// Images:
	bmp: Paint,
	cur: Paint,
	eps: Paint,
	gif: Paint,
	icns: Paint,
	ico: Paint,
	jpeg: Paint,
	jpg: Paint,
	kra: Paint,
	pbm: Paint,
	pdf: Paint, // yes I added PDF support to JS Paint (not all formats listed here are supported though)
	pdn: Paint,
	pgm: Paint,
	png: Paint,
	pnm: Paint,
	ppm: Paint,
	ps: Paint,
	psd: Paint,
	svg: Paint,
	tga: Paint,
	tif: Paint,
	tiff: Paint,
	webp: Paint,
	xbm: Paint,
	xcf: Paint,
	xcfbz2: Paint,
	xcfgz: Paint,
	xpm: Paint,

	// Winamp Skins:
	wsz: openWinamp, // winamp skin zip
	zip: openWinamp, // MIGHT be a winamp skin zip, so might as well for now

	// Audio:
	wav: SoundRecorder,
	mp3: openWinamp,
	ogg: openWinamp,
	wma: openWinamp,
	m4a: openWinamp,
	aac: openWinamp,
	flac: openWinamp,
	mka: openWinamp,
	mpc: openWinamp,
	"mp+": openWinamp,

	// Playlists:
	m3u: openWinamp,
	pls: openWinamp,

	// Misc:
	htm: Explorer,
	html: Explorer,
	url: openURLFile,
	theme: openThemeFile,
	themepack: openThemeFile,
};

// Note: global systemExecuteFile called by explorer
function systemExecuteFile(file_path) {
	// execute file with default handler
	// like the START command in CMD.EXE

	withFilesystem(function () {
		var fs = BrowserFS.BFSRequire("fs");
		fs.stat(file_path, function (err, stats) {
			if (err) {
				return alert("Failed to get info about " + file_path + "\n\n" + err);
			}
			if (stats.isDirectory()) {
				Explorer(file_path);
			} else {
				var file_extension = file_extension_from_path(file_path);
				var program = file_extension_associations[file_extension.toLowerCase()];
				if (program) {
					if (!program.acceptsFilePaths) {
						alert(program.name + " does not support opening files via the virtual filesystem yet");
						return;
					}
					program(file_path);
				} else {
					alert("No program is associated with " + file_extension + " files");
				}
			}
		});
	});
}

// TODO: base all the desktop icons off of the filesystem
// Note: `C:\Windows\Desktop` doesn't contain My Computer, My Documents, Network Neighborhood, Recycle Bin, or Internet Explorer,
// or Connect to the Internet, or Setup MSN Internet Access,
// whereas `Desktop` does (that's the full address it shows; it's one of them "special locations")
var add_icon_not_via_filesystem = function (options) {
	folder_view.add_item(new FolderViewItem({
		icons: {
			// @TODO: know what sizes are available
			[DESKTOP_ICON_SIZE]: getIconPath(options.iconID, DESKTOP_ICON_SIZE),
		},
		...options,
	}));
};
add_icon_not_via_filesystem({
	title: "My Computer",
	iconID: "my-computer",
	open: function () { systemExecuteFile("/"); },
	// file_path: "/",
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "My Documents",
	iconID: "my-documents-folder",
	open: function () { systemExecuteFile("/my-documents"); },
	// file_path: "/my-documents/",
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "Network Neighborhood",
	iconID: "network",
	open: function () { systemExecuteFile("/network-neighborhood"); },
	// file_path: "/network-neighborhood/",
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "Recycle Bin",
	iconID: "recycle-bin",
	open: function () { Explorer("https://www.epa.gov/recycle/"); },
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "My Pictures",
	iconID: "folder",
	open: function () { systemExecuteFile("/my-pictures"); },
	// file_path: "/my-pictures/",
	is_system_folder: true,
});
add_icon_not_via_filesystem({
	title: "Internet Explorer",
	iconID: "internet-explorer",
	open: function () { Explorer("https://www.google.com/"); }
});
add_icon_not_via_filesystem({
	title: "Paint",
	iconID: "paint",
	open: Paint,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Minesweeper",
	iconID: "minesweeper",
	open: Minesweeper,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Sound Recorder",
	iconID: "speaker",
	open: SoundRecorder,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Solitaire",
	iconID: "solitaire",
	open: Solitaire,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Notepad",
	iconID: "notepad",
	open: Notepad,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Winamp",
	iconID: "winamp2",
	open: openWinamp,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "3D Pipes",
	iconID: "pipes",
	open: Pipes,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "3D Flower Box",
	iconID: "pipes",
	open: FlowerBox,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "MS-DOS Prompt",
	iconID: "msdos",
	open: CommandPrompt,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Calculator",
	iconID: "calculator",
	open: Calculator,
	shortcut: true
});
add_icon_not_via_filesystem({
	title: "Pinball",
	iconID: "pinball",
	open: Pinball,
	shortcut: true
});

folder_view.arrange_icons();

function iconsAtTwoSizes(iconID) {
	return {
		16: `images/icons/${iconID}-16x16.png`,
		32: `images/icons/${iconID}-32x32.png`,
	};
}
