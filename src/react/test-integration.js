/**
 * React Integration Test Script
 * 
 * This script provides functions to test the integration between
 * React components and the existing jQuery-based application.
 * It can be used to verify that our React migration is working correctly.
 */

/**
 * Test the React window system
 * This function creates a React window and verifies that it works correctly
 */
export function testReactWindowSystem() {
  console.log('Testing React window system...');
  
  // Check if the React window system is initialized
  if (!window.createReactWindow) {
    console.error('React window system not initialized');
    return false;
  }
  
  try {
    // Create a simple React window
    const windowId = window.createReactWindow({
      title: 'React Test Window',
      icon: '/images/icons/notepad-16x16.png',
      component: () => {
        return {
          render: () => {
            return '<div>React Test Window Content</div>';
          }
        };
      },
      position: { x: 100, y: 100 },
      size: { width: 300, height: 200 }
    });
    
    console.log('React window created with ID:', windowId);
    return true;
  } catch (error) {
    console.error('Error creating React window:', error);
    return false;
  }
}

/**
 * Test the React program integration
 * This function creates a React-based Notepad window
 */
export function testReactNotepad() {
  console.log('Testing React Notepad...');
  
  // Check if Notepad is available
  if (!window.Notepad) {
    console.error('Notepad not available');
    return false;
  }
  
  try {
    // Create a Notepad window
    const task = window.Notepad();
    
    console.log('Notepad window created:', task);
    return true;
  } catch (error) {
    console.error('Error creating Notepad window:', error);
    return false;
  }
}

/**
 * Run all integration tests
 */
export function runIntegrationTests() {
  console.log('Running React integration tests...');
  
  const results = {
    windowSystem: testReactWindowSystem(),
    notepad: testReactNotepad()
  };
  
  console.log('Integration test results:', results);
  return results;
}

// Initialize when the document is ready
function initWhenReady() {
  if (document.readyState === 'complete') {
    // Wait a bit to ensure all other scripts are loaded
    setTimeout(runIntegrationTests, 1000);
  } else {
    window.addEventListener('load', () => {
      // Wait a bit to ensure all other scripts are loaded
      setTimeout(runIntegrationTests, 1000);
    });
  }
}

// Start initialization
initWhenReady();
