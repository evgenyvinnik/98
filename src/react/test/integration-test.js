/**
 * Integration Test Script
 * 
 * This script tests the integration between React components and the existing jQuery-based code.
 * It verifies that our React migration is working correctly and that components can interact
 * with each other and with the existing code.
 */

/**
 * Test the React window system
 */
function testWindowSystem() {
  console.log('Testing React window system...');
  
  try {
    // Create a test window
    const windowId = window.createReactWindow({
      title: 'Test Window',
      component: () => ({
        render: () => '<div>Test Window Content</div>'
      }),
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 }
    });
    
    console.log('Window created with ID:', windowId);
    
    // Test window operations
    setTimeout(() => {
      console.log('Testing window operations...');
      
      // Focus the window
      window.focusReactWindow(windowId);
      console.log('Window focused');
      
      // Minimize the window
      setTimeout(() => {
        window.minimizeReactWindow(windowId);
        console.log('Window minimized');
        
        // Restore the window
        setTimeout(() => {
          window.restoreReactWindow(windowId);
          console.log('Window restored');
          
          // Maximize the window
          setTimeout(() => {
            window.maximizeReactWindow(windowId);
            console.log('Window maximized');
            
            // Close the window
            setTimeout(() => {
              window.closeReactWindow(windowId);
              console.log('Window closed');
              
              console.log('Window system test completed successfully');
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
    
    return true;
  } catch (error) {
    console.error('Error testing window system:', error);
    return false;
  }
}

/**
 * Test the React program system
 */
function testProgramSystem() {
  console.log('Testing React program system...');
  
  const programs = ['Notepad', 'Paint', 'Calculator', 'Minesweeper', 'SoundRecorder'];
  let successCount = 0;
  
  for (const program of programs) {
    try {
      console.log(`Testing ${program}...`);
      
      // Check if the program is registered
      if (!window.reactPrograms || !window.reactPrograms[program]) {
        console.warn(`Program ${program} is not registered as a React program`);
        continue;
      }
      
      // Launch the program
      const task = window[program] ? window[program]() : null;
      
      if (task) {
        console.log(`${program} launched successfully`);
        successCount++;
        
        // Close the program after a delay
        setTimeout(() => {
          if (task.$window && task.$window.close) {
            task.$window.close();
            console.log(`${program} closed`);
          }
        }, 1000);
      } else {
        console.warn(`Failed to launch ${program}`);
      }
    } catch (error) {
      console.error(`Error testing ${program}:`, error);
    }
  }
  
  console.log(`Program system test completed: ${successCount}/${programs.length} programs launched successfully`);
  return successCount === programs.length;
}

/**
 * Test the file dialog system
 */
function testFileDialogSystem() {
  console.log('Testing file dialog system...');
  
  try {
    // Check if the file dialog context is available
    if (!window.reactFileDialog) {
      console.warn('React file dialog system not available');
      return false;
    }
    
    // Test open dialog
    console.log('Testing open dialog...');
    window.reactFileDialog.showOpenDialog({
      title: 'Test Open Dialog',
      initialPath: '/',
      fileTypes: ['.txt']
    }).then(
      path => console.log('Open dialog selected path:', path),
      error => console.log('Open dialog canceled')
    );
    
    // Test save dialog
    setTimeout(() => {
      console.log('Testing save dialog...');
      window.reactFileDialog.showSaveDialog({
        title: 'Test Save Dialog',
        initialPath: '/',
        fileTypes: ['.txt']
      }).then(
        path => console.log('Save dialog selected path:', path),
        error => console.log('Save dialog canceled')
      );
    }, 2000);
    
    return true;
  } catch (error) {
    console.error('Error testing file dialog system:', error);
    return false;
  }
}

/**
 * Test the message box system
 */
function testMessageBoxSystem() {
  console.log('Testing message box system...');
  
  try {
    // Check if the message box system is available
    if (!window.reactShowMessageBox) {
      console.warn('React message box system not available');
      return false;
    }
    
    // Show a test message box
    window.reactShowMessageBox({
      title: 'Test Message Box',
      message: 'This is a test message box from the React integration test.',
      buttons: [
        { label: 'OK', value: 'ok', default: true },
        { label: 'Cancel', value: 'cancel' }
      ],
      iconID: 'info'
    }).then(
      result => console.log('Message box result:', result),
      error => console.log('Message box canceled')
    );
    
    return true;
  } catch (error) {
    console.error('Error testing message box system:', error);
    return false;
  }
}

/**
 * Run all integration tests
 */
function runAllTests() {
  console.log('Running all integration tests...');
  
  const results = {
    windowSystem: testWindowSystem(),
    programSystem: testProgramSystem(),
    fileDialogSystem: testFileDialogSystem(),
    messageBoxSystem: testMessageBoxSystem()
  };
  
  console.log('Integration test results:', results);
  
  // Check if all tests passed
  const allPassed = Object.values(results).every(result => result);
  console.log(allPassed ? 'All tests passed!' : 'Some tests failed!');
  
  return results;
}

// Register test functions with the global scope
window.testWindowSystem = testWindowSystem;
window.testProgramSystem = testProgramSystem;
window.testFileDialogSystem = testFileDialogSystem;
window.testMessageBoxSystem = testMessageBoxSystem;
window.runAllTests = runAllTests;

// Run tests when the document is ready
function initTests() {
  if (document.readyState === 'complete') {
    // Wait a bit to ensure all scripts are loaded
    setTimeout(() => {
      console.log('Running integration tests automatically...');
      runAllTests();
    }, 2000);
  } else {
    window.addEventListener('load', () => {
      // Wait a bit to ensure all scripts are loaded
      setTimeout(() => {
        console.log('Running integration tests automatically...');
        runAllTests();
      }, 2000);
    });
  }
}

// Initialize tests
initTests();

export {
  testWindowSystem,
  testProgramSystem,
  testFileDialogSystem,
  testMessageBoxSystem,
  runAllTests
};
