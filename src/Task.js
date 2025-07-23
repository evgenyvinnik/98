Task.all_tasks = [];
function Task(win) {
	Task.all_tasks.push(this);

	this.win = win;

	// Add the window to the global state.
	this.id = window.windows.add(win);

	this.updateTitle = () => {
		window.windows.update(this.id, { title: win.getTitle() });
	};

	this.updateIcon = () => {
		window.windows.update(this.id, { icon: win.getIconAtSize(16) });
	};

	this.updateTitle();
	this.updateIcon();

	win.on("title-change", this.updateTitle);
	win.on("icon-change", this.updateIcon);

	// The minimize target is now handled by the React component, but we might need a reference to the taskbar button.
	// For now, we'll leave this empty.
	win.setMinimizeTarget(document.createElement('div')); // Dummy element

	win.onFocus(() => {
		window.windows.focus(this.id);
	});
	win.onBlur(() => {
		// The concept of a 'deselected' task is now just a window that isn't focused.
		// The context handles this automatically.
	});
	win.onClosed(() => {
		window.windows.remove(this.id);
		const index = Task.all_tasks.indexOf(this);
		if (index !== -1) {
			Task.all_tasks.splice(index, 1);
		}
	});

	if (win.is && win.is(":visible")) {
		win.focus();
	}
}
