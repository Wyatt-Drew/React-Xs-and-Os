import './Game.css';
import React, { useState } from 'react';

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winningSquares, setWinningSquares] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (index) => {
    const newBoard = [...board];
    if (calculateWinner(newBoard) || newBoard[index]) {
      return; // do nothing if there's a winner
    }
    newBoard[index] = xIsNext ? 'X' : 'O';

    const winner = calculateWinner(newBoard);
    if (winner) {
      setWinningSquares(calculateWinningSquares(newBoard, winner));
    }

    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (index) => {
    const isWinningSquare = winningSquares.includes(index);

    return (
      <button
        className={`square ${board[index] ? 'clicked' : ''} ${isWinningSquare ? 'winning' : ''}`}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <div className="status">{status}</div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return the winning symbol (X or O)
    }
  }

  return null; // no winner
}

function calculateWinningSquares(squares, winner) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] === winner && squares[b] === winner && squares[c] === winner) {
      return line.slice();
    }
  }

  return [];
}

export default Game;
