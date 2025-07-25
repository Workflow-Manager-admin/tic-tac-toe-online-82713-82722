import React, { useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * The main App component renders the Tic Tac Toe game,
 * including the status message, 3x3 grid, and reset functionality.
 */
function App() {
  // Board is a 9-sized array: null | "X" | "O"
  const [board, setBoard] = useState(Array(9).fill(null));
  // true if X's turn, false if O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // Tracks the winner (null if ongoing or draw)
  const winner = calculateWinner(board);
  // For disabling board on completion
  const isDraw = !winner && board.every(sq => sq !== null);

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    // Ignore if cell already filled or game over
    if (board[idx] || winner) return;
    const b = board.slice();
    b[idx] = xIsNext ? "X" : "O";
    setBoard(b);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE
  function getStatusMessage() {
    if (winner) {
      return `Winner: ${winner === 'draw' ? 'Draw' : winner}`;
    }
    if (isDraw) {
      return "It's a draw!";
    }
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="App tic-tac-toe-light-bg">
      <div className="tictactoe-wrapper">
        <h1 className="ttt-title" style={{ color: 'var(--primary-color)' }}>Tic Tac Toe</h1>
        <div 
          className="ttt-status"
          style={{ color: winner ? 'var(--accent-color)' : 'var(--secondary-color)' }}
          data-testid="game-status"
        >
          {getStatusMessage()}
        </div>
        <Board 
          squares={board} 
          onCellClick={handleCellClick} 
          disabled={Boolean(winner) || isDraw} 
        />
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          aria-label="Reset game"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board component renders the 3x3 grid and individual cells.
 */
function Board({ squares, onCellClick, disabled }) {
  return (
    <div className="ttt-board" role="grid">
      {squares.map((val, idx) => (
        <Cell
          key={idx}
          value={val}
          onClick={() => onCellClick(idx)}
          disabled={disabled || val !== null}
          ariaPos={idx}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Cell component for each tic-tac-toe square.
 */
function Cell({ value, onClick, disabled, ariaPos }) {
  return (
    <button
      className="ttt-cell"
      onClick={onClick}
      disabled={disabled}
      role="gridcell"
      aria-colindex={(ariaPos % 3) + 1}
      aria-rowindex={Math.floor(ariaPos / 3) + 1}
      tabIndex={0}
      aria-label={value || 'Empty'}
      style={{
        color: 
          value === "X"
            ? "var(--primary-color)"
            : value === "O"
            ? "var(--accent-color)"
            : "var(--secondary-color)"
      }}
    >
      {value}
    </button>
  );
}

/**
 * Calculate the winner given the board's squares.
 * Returns "X", "O", or null.
 */
function calculateWinner(squares) {
  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diags
  ];
  for (const [a, b, c] of winLines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  // If board full and no winner
  if (squares.every(sq => sq !== null)) {
    return 'draw';
  }
  return null;
}

export default App;
