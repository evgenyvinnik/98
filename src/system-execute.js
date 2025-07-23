import { programs, fileAssociations } from './program-data.js';

// This function is the new, centralized way to execute files.
// It's exposed on the window object to be accessible by legacy parts of the app (like desktop icons).
window.systemExecuteFile = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    const programId = fileAssociations[extension];
    
    if (window.windows && window.windows.launchByPath) {
        window.windows.launchByPath(filePath);
    } else {
        console.error("Window system not initialized, cannot launch program.");
        // Fallback to a simple alert if the context isn't ready for some reason
        alert(`Could not open ${filePath}. Window system not available.`);
    }
};

// The original show_help function is complex and will be handled separately.
// For now, we ensure it's still available if other parts of the system call it.
if (!window.show_help) {
    window.show_help = () => {
        alert("The Help system is currently being refactored.");
    };
}
