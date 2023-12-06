import './Game.css';
import './RainbowButton.css';
import React, { useState, useEffect } from 'react';
import backgroundMusic from "../assets/background.mp3";


function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winningSquares, setWinningSquares] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);
  const [computerEnabled, setComputerEnabled] = useState(false);
  const [playerHasMoved, setPlayerHasMoved] = useState(null);
  const [singlePlayerScore, setSinglePlayerScore] = useState([0,0,0]);
  const [twoPlayerScore, setTwoPlayerScore] = useState([0,0,0]);
  const [gameIsOver, setGameIsOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audio] = useState(new Audio(backgroundMusic));

  const resetGame = ()  => {
    setBoard(Array(9).fill(null));
    setWinningSquares([]);
    setXIsNext(true);
    setPlayerHasMoved(null);
    setGameIsOver(false);
  }
  const toggleComputerEnabled = ()  => {
    setComputerEnabled(!computerEnabled);
    resetGame();
  }
  function toggleBackgroundMusic() {
    setSoundEnabled((prevSoundEnabled) => !prevSoundEnabled);
  
    if (soundEnabled) {
      audio.loop = true; // Enable looping
      audio.play();
    } else {
      audio.pause();
    }
  }
  const move = (index) => {
    const newBoard = [...board];
    if (calculateWinner(newBoard, updateScores) || newBoard[index]) {
      return; // do nothing if there's a winner or sq is full
    }
    newBoard[index] = xIsNext ? 'X' : 'O';

    const winner = calculateWinner(newBoard, updateScores);
    if (winner) {
      setWinningSquares(calculateWinningSquares(newBoard, winner));
    }
    setBoard(newBoard);
    setXIsNext((XIsNext) => !XIsNext); //functional form ensures states are up to date
    setPlayerHasMoved(null);
  }
  const handleClick = (index) => {
    let isCompTurn = computerEnabled && !xIsNext;
    if (playerHasMoved == null && !isCompTurn && !board[index]) {
      setPlayerHasMoved(index); // Set to the index of the clicked square
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
    // handle all moves
    if (!xIsNext && computerEnabled) {
      computerMove();
    } else if (playerHasMoved !== null) {
      move(playerHasMoved);
    }

    const winner = calculateWinner(board, updateScores);
    if (winner && !gameIsOver) {
      const updatedScores = updateScores(winner);
      if (computerEnabled) {
        setSinglePlayerScore(updatedScores);
      } else {
        setTwoPlayerScore(updatedScores);
      }
      setGameIsOver(true);
      setWinningSquares(calculateWinningSquares(board, winner));
    }
  }, [playerHasMoved, xIsNext, computerEnabled, board, gameIsOver]);
  

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
  const updateScores = (winner) => {
    if (winner === 'X') {
      return computerEnabled
        ? [singlePlayerScore[0] + 1, singlePlayerScore[1], singlePlayerScore[2]]
        : [twoPlayerScore[0] + 1, twoPlayerScore[1], twoPlayerScore[2]];
    } else if (winner === 'O') {
      return computerEnabled
        ? [singlePlayerScore[0], singlePlayerScore[1] + 1, singlePlayerScore[2]]
        : [twoPlayerScore[0], twoPlayerScore[1] + 1, twoPlayerScore[2]];
    } else {
      // It's a tie
      return computerEnabled
        ? [singlePlayerScore[0], singlePlayerScore[1], singlePlayerScore[2] + 1]
        : [twoPlayerScore[0], twoPlayerScore[1], twoPlayerScore[2] + 1];
    }
  };

  const renderScores = () => {
    return computerEnabled ? (
      <div className="button-container">
        <div>Wins: {singlePlayerScore[0]}&nbsp;&nbsp;</div>
        <div>Losses: {singlePlayerScore[1]}&nbsp;&nbsp;</div>
        <div>Ties: {singlePlayerScore[2]}</div>
      </div>
    ) : (
      <div className="button-container">
        <div>X Wins: {twoPlayerScore[0]} &nbsp;&nbsp;</div>
        <div>Y Wins: {twoPlayerScore[1]} &nbsp;&nbsp;</div>
        <div>Ties: {twoPlayerScore[2]}</div>
      </div>
    );
  };
  const winner = calculateWinner(board, updateScores);
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
      <div className="status">{status}</div>
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
      
      <div className="button-container">
        <button className="rainbow-button" onClick={resetGame}>
          New Game
        </button>
        <button className="rainbow-button" onClick={toggleComputerEnabled}>
          {computerEnabled ? '1 Player' : '2 Player'}
        </button>
      </div>
      <button className="rainbow-button" onClick={toggleBackgroundMusic}>
        {soundEnabled ? 'Mute' : 'Unmute'}
      </button>
      {renderScores()}
    </div>
  );
}

function calculateWinner(squares, updateScores) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      updateScores(squares[a]);
      return squares[a]; // Return the winning symbol (X or O)
    }
  }
  if (squares.every((square) => square)) {
    updateScores(null);
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
