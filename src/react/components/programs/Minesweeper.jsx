import React, { useState, useEffect, useCallback } from 'react';

/**
 * Minesweeper component that implements the classic Windows 98 game
 * This will replace the iframe-based Minesweeper program
 */
const Minesweeper = () => {
  // Game settings
  const [difficulty, setDifficulty] = useState('beginner');
  const [boardSize, setBoardSize] = useState({ rows: 9, cols: 9 });
  const [mineCount, setMineCount] = useState(10);
  
  // Game state
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, won, lost
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [faceStatus, setFaceStatus] = useState('smile'); // smile, surprised, won, lost
  
  // Initialize the game board
  const initializeBoard = useCallback(() => {
    const { rows, cols } = boardSize;
    const newBoard = Array(rows).fill().map(() => 
      Array(cols).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      }))
    );
    setBoard(newBoard);
    setGameStatus('waiting');
    setFlagsPlaced(0);
    setTimeElapsed(0);
    setTimerActive(false);
    setFaceStatus('smile');
  }, [boardSize]);
  
  // Place mines on the board (avoiding the first clicked cell)
  const placeMines = (firstRow, firstCol) => {
    const { rows, cols } = boardSize;
    const newBoard = [...board];
    
    // Make sure the first clicked cell and its neighbors are not mines
    const safeZone = [];
    for (let r = Math.max(0, firstRow - 1); r <= Math.min(rows - 1, firstRow + 1); r++) {
      for (let c = Math.max(0, firstCol - 1); c <= Math.min(cols - 1, firstCol + 1); c++) {
        safeZone.push({ row: r, col: c });
      }
    }
    
    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      // Check if this cell is in the safe zone or already has a mine
      const isSafe = safeZone.some(pos => pos.row === row && pos.col === col);
      if (!isSafe && !newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calculate adjacent mines for each cell
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          // Check all 8 neighboring cells
          for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
              if (newBoard[r][c].isMine) count++;
            }
          }
          newBoard[row][col].adjacentMines = count;
        }
      }
    }
    
    setBoard(newBoard);
  };
  
  // Handle cell click
  const handleCellClick = (row, col) => {
    // Ignore clicks if game is over or cell is flagged
    if (gameStatus === 'won' || gameStatus === 'lost' || board[row][col].isFlagged) {
      return;
    }
    
    // Start the game if this is the first click
    if (gameStatus === 'waiting') {
      setGameStatus('playing');
      setTimerActive(true);
      placeMines(row, col);
    }
    
    const newBoard = [...board];
    
    // If clicked on a mine, game over
    if (newBoard[row][col].isMine) {
      newBoard[row][col].isRevealed = true;
      setBoard(newBoard);
      setGameStatus('lost');
      setTimerActive(false);
      setFaceStatus('lost');
      revealAllMines();
      return;
    }
    
    // Reveal the clicked cell
    revealCell(newBoard, row, col);
    setBoard(newBoard);
    
    // Check if player has won
    checkWinCondition();
  };
  
  // Reveal a cell and its neighbors if it has no adjacent mines
  const revealCell = (board, row, col) => {
    const { rows, cols } = boardSize;
    
    // If cell is already revealed or flagged, do nothing
    if (board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }
    
    // Reveal the cell
    board[row][col].isRevealed = true;
    
    // If cell has no adjacent mines, reveal all neighboring cells
    if (board[row][col].adjacentMines === 0) {
      for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
          if (r !== row || c !== col) {
            revealCell(board, r, c);
          }
        }
      }
    }
  };
  
  // Handle right-click to place/remove flags
  const handleCellRightClick = (e, row, col) => {
    e.preventDefault(); // Prevent context menu
    
    // Ignore right-clicks if game is over or cell is revealed
    if (gameStatus === 'won' || gameStatus === 'lost' || board[row][col].isRevealed) {
      return;
    }
    
    const newBoard = [...board];
    const cell = newBoard[row][col];
    
    // Toggle flag
    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagsPlaced(flagsPlaced - 1);
    } else {
      // Only allow placing flags if there are mines left to flag
      if (flagsPlaced < mineCount) {
        cell.isFlagged = true;
        setFlagsPlaced(flagsPlaced + 1);
      }
    }
    
    setBoard(newBoard);
    
    // Check if player has won
    checkWinCondition();
  };
  
  // Reveal all mines when game is lost
  const revealAllMines = () => {
    const newBoard = [...board];
    
    for (let row = 0; row < boardSize.rows; row++) {
      for (let col = 0; col < boardSize.cols; col++) {
        if (newBoard[row][col].isMine) {
          newBoard[row][col].isRevealed = true;
        }
      }
    }
    
    setBoard(newBoard);
  };
  
  // Check if player has won
  const checkWinCondition = () => {
    // Player wins if all non-mine cells are revealed
    const { rows, cols } = boardSize;
    let allNonMinesRevealed = true;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!board[row][col].isMine && !board[row][col].isRevealed) {
          allNonMinesRevealed = false;
          break;
        }
      }
      if (!allNonMinesRevealed) break;
    }
    
    if (allNonMinesRevealed) {
      setGameStatus('won');
      setTimerActive(false);
      setFaceStatus('won');
      
      // Flag all mines
      const newBoard = [...board];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (newBoard[row][col].isMine) {
            newBoard[row][col].isFlagged = true;
          }
        }
      }
      setBoard(newBoard);
      setFlagsPlaced(mineCount);
    }
  };
  
  // Handle reset button click
  const handleReset = () => {
    initializeBoard();
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    
    switch (newDifficulty) {
      case 'beginner':
        setBoardSize({ rows: 9, cols: 9 });
        setMineCount(10);
        break;
      case 'intermediate':
        setBoardSize({ rows: 16, cols: 16 });
        setMineCount(40);
        break;
      case 'expert':
        setBoardSize({ rows: 16, cols: 30 });
        setMineCount(99);
        break;
      default:
        setBoardSize({ rows: 9, cols: 9 });
        setMineCount(10);
    }
  };
  
  // Initialize the board when component mounts or difficulty changes
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard, difficulty]);
  
  // Timer effect
  useEffect(() => {
    let interval;
    
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerActive]);
  
  // Handle mouse down/up for face expression
  const handleMouseDown = () => {
    if (gameStatus === 'playing') {
      setFaceStatus('surprised');
    }
  };
  
  const handleMouseUp = () => {
    if (gameStatus === 'playing') {
      setFaceStatus('smile');
    }
  };
  
  // Get cell content based on its state
  const getCellContent = (cell) => {
    if (cell.isFlagged) {
      return '🚩';
    }
    
    if (!cell.isRevealed) {
      return '';
    }
    
    if (cell.isMine) {
      return '💣';
    }
    
    return cell.adjacentMines === 0 ? '' : cell.adjacentMines;
  };
  
  // Get cell color based on adjacent mines
  const getCellColor = (cell) => {
    if (!cell.isRevealed || cell.adjacentMines === 0) {
      return 'black';
    }
    
    const colors = [
      'blue',       // 1
      'green',      // 2
      'red',        // 3
      'darkblue',   // 4
      'darkred',    // 5
      'teal',       // 6
      'black',      // 7
      'gray'        // 8
    ];
    
    return colors[cell.adjacentMines - 1] || 'black';
  };
  
  // Get face emoji based on game state
  const getFaceEmoji = () => {
    switch (faceStatus) {
      case 'smile': return '🙂';
      case 'surprised': return '😮';
      case 'won': return '😎';
      case 'lost': return '😵';
      default: return '🙂';
    }
  };
  
  // Format the timer display
  const formatTime = (time) => {
    return time.toString().padStart(3, '0');
  };
  
  return (
    <div className="minesweeper-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      padding: '10px',
      backgroundColor: '#c0c0c0',
      fontFamily: 'MS Sans Serif, Arial, sans-serif'
    }}>
      {/* Menu Bar */}
      <div className="menu-bar" style={{ 
        display: 'flex', 
        backgroundColor: '#c0c0c0',
        borderBottom: '1px solid #808080',
        padding: '2px',
        marginBottom: '10px'
      }}>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>Game</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>Help</div>
      </div>
      
      {/* Game Controls */}
      <div className="game-controls" style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div className="mine-counter" style={{
          backgroundColor: 'black',
          color: 'red',
          fontFamily: 'Digital, monospace',
          fontSize: '24px',
          padding: '2px 8px',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: '#808080 #ffffff #ffffff #808080'
        }}>
          {formatTime(mineCount - flagsPlaced)}
        </div>
        
        <button 
          className="reset-button" 
          onClick={handleReset}
          style={{
            width: '40px',
            height: '40px',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            backgroundColor: '#c0c0c0',
            cursor: 'pointer'
          }}
        >
          {getFaceEmoji()}
        </button>
        
        <div className="timer" style={{
          backgroundColor: 'black',
          color: 'red',
          fontFamily: 'Digital, monospace',
          fontSize: '24px',
          padding: '2px 8px',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: '#808080 #ffffff #ffffff #808080'
        }}>
          {formatTime(timeElapsed)}
        </div>
      </div>
      
      {/* Difficulty Selector */}
      <div className="difficulty-selector" style={{
        display: 'flex',
        marginBottom: '10px'
      }}>
        <button 
          onClick={() => handleDifficultyChange('beginner')}
          style={{
            marginRight: '5px',
            padding: '2px 5px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: difficulty === 'beginner' ? '#808080 #ffffff #ffffff #808080' : '#ffffff #808080 #808080 #ffffff',
            backgroundColor: '#c0c0c0'
          }}
        >
          Beginner
        </button>
        <button 
          onClick={() => handleDifficultyChange('intermediate')}
          style={{
            marginRight: '5px',
            padding: '2px 5px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: difficulty === 'intermediate' ? '#808080 #ffffff #ffffff #808080' : '#ffffff #808080 #808080 #ffffff',
            backgroundColor: '#c0c0c0'
          }}
        >
          Intermediate
        </button>
        <button 
          onClick={() => handleDifficultyChange('expert')}
          style={{
            padding: '2px 5px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: difficulty === 'expert' ? '#808080 #ffffff #ffffff #808080' : '#ffffff #808080 #808080 #ffffff',
            backgroundColor: '#c0c0c0'
          }}
        >
          Expert
        </button>
      </div>
      
      {/* Game Board */}
      <div 
        className="game-board"
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${boardSize.rows}, 20px)`,
          gridTemplateColumns: `repeat(${boardSize.cols}, 20px)`,
          gap: '1px',
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          backgroundColor: '#c0c0c0',
          padding: '5px'
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
              style={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                color: getCellColor(cell),
                backgroundColor: cell.isRevealed ? '#d1d1d1' : '#c0c0c0',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: cell.isRevealed ? '#808080 #808080 #808080 #808080' : '#ffffff #808080 #808080 #ffffff',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {getCellContent(cell)}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default Minesweeper;
