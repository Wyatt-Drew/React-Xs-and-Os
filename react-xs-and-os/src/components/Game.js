import './Game.css';
import './RainbowButton.css';
import React, { useState, useEffect } from 'react';

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winningSquares, setWinningSquares] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);
  const [computerEnabled, setComputerEnabled] = useState(false);
  const [playerHasMoved, setPlayerHasMoved] = useState(false);
  
  const resetGame = ()  => {
    setBoard(Array(9).fill(null));
    setWinningSquares([]);
    setXIsNext(true);
    setPlayerHasMoved(false);
  }
  const toggleComputerEnabled = ()  => {
    setComputerEnabled(!computerEnabled);
    resetGame();
  }
  const move = (index) => {
    const newBoard = [...board];
    if (calculateWinner(newBoard) || newBoard[index]) {
      return; // do nothing if there's a winner or sq is full
    }
    newBoard[index] = xIsNext ? 'X' : 'O';

    const winner = calculateWinner(newBoard);
    if (winner) {
      setWinningSquares(calculateWinningSquares(newBoard, winner));
    }
    setBoard(newBoard);
    setXIsNext((XIsNext) => !XIsNext); //functional form ensures states are up to date
  }
  const handleClick = (index) => {
    if (!playerHasMoved && !(computerEnabled && !xIsNext)) //only allow 1 move at a time
    {
      move(index); // Directly make the move
      setPlayerHasMoved(true); // Set to true to prevent additional moves
    }
  };
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const computerMove = () => {
    // Gather all empty squares
    const emptySquares = [];
    board.forEach((square, index) => {
      if (!square) {
        emptySquares.push(index);
      }
    });
  
    // If there are empty squares, update the board state
    if (emptySquares.length > 0) {
      const randomIndex = emptySquares[getRandomInt(0, emptySquares.length - 1)];
      move(randomIndex);
    }
  };
  //This section performs synchronously whenever the computer or player make a move
  useEffect(() => {
    //handle all moves
    if (playerHasMoved && xIsNext)
    {
      setPlayerHasMoved(false);
    }else {
      if (computerEnabled && !xIsNext) {
        computerMove();
      }
    }
    const winner = calculateWinner(board);
    if (winner) {
      setWinningSquares(calculateWinningSquares(board, winner));
    }
  }, [playerHasMoved, xIsNext, computerEnabled, board]); //All dependancies

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
  let status;
  if (winner === 'Tie') {
    status = 'It\'s a tie!';
  } else {
  status = 
  winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;
  }
  return (
    <div className="game">
      <button className="rainbow-button" onClick={resetGame}>
        New Game
      </button>
      <button className="rainbow-button" onClick={toggleComputerEnabled}>
        {computerEnabled ? '2 Player' : '1 Player'}
      </button>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
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
  if (squares.every((square) => square)) {
    return 'Tie'; // Return 'Tie' if all squares are filled with no winner
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
