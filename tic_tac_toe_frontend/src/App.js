import React, { useMemo, useState } from 'react';
import './App.css';
import { calculateWinner, isDraw, isValidMove } from './game';

const INITIAL_BOARD = Array(9).fill(null);

/**
 * Creates the initial state object for a new game.
 * Keeping this as a function avoids sharing object references.
 */
function createInitialGameState() {
  return {
    board: [...INITIAL_BOARD],
    currentPlayer: 'X',
    status: 'Player X',
    winnerLine: null,
    isGameOver: false,
  };
}

function indexToRowCol(index) {
  const row = Math.floor(index / 3) + 1; // 1-based for display
  const col = (index % 3) + 1;
  return { row, col };
}

function getSquareAriaLabel(cellValue, currentPlayer, index, isGameOver) {
  const { row, col } = indexToRowCol(index);

  if (cellValue === 'X' || cellValue === 'O') {
    return `Row ${row} column ${col} is ${cellValue}`;
  }

  if (isGameOver) {
    return `Square at row ${row} column ${col} is empty. Game over.`;
  }

  return `Place ${currentPlayer} at row ${row} column ${col}`;
}

// PUBLIC_INTERFACE
function App() {
  const [game, setGame] = useState(() => createInitialGameState());

  const winningSet = useMemo(() => {
    if (!game.winnerLine) return null;
    return new Set(game.winnerLine);
  }, [game.winnerLine]);

  const handleSquareClick = (index) => {
    // Ignore input when game is over or move isn't valid.
    if (game.isGameOver) return;
    if (!isValidMove(game.board, index)) return;

    const nextBoard = [...game.board];
    nextBoard[index] = game.currentPlayer;

    const winnerInfo = calculateWinner(nextBoard);
    if (winnerInfo) {
      setGame({
        board: nextBoard,
        currentPlayer: game.currentPlayer,
        status: `Player ${winnerInfo.winner} wins!`,
        winnerLine: winnerInfo.line,
        isGameOver: true,
      });
      return;
    }

    if (isDraw(nextBoard)) {
      setGame({
        board: nextBoard,
        currentPlayer: game.currentPlayer,
        status: `It's a draw!`,
        winnerLine: null,
        isGameOver: true,
      });
      return;
    }

    const nextPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    setGame({
      board: nextBoard,
      currentPlayer: nextPlayer,
      status: `Player ${nextPlayer}`,
      winnerLine: null,
      isGameOver: false,
    });
  };

  const resetGame = () => {
    setGame(createInitialGameState());
  };

  return (
    <div className="App">
      <main className="ttt-page">
        <section className="ttt-card" aria-labelledby="ttt-title">
          <header className="ttt-header">
            <h1 id="ttt-title" className="ttt-title">
              Tic Tac Toe
            </h1>

            <div className="ttt-status" role="status" aria-live="polite" aria-atomic="true">
              {game.status}
            </div>
          </header>

          <div className="ttt-boardWrap" aria-label="Tic Tac Toe board">
            <div className="ttt-board" role="grid" aria-label="3 by 3 Tic Tac Toe grid">
              {game.board.map((cell, idx) => {
                const isWinning = Boolean(winningSet && winningSet.has(idx));
                const isDisabled = game.isGameOver || !isValidMove(game.board, idx);

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`ttt-square ${isWinning ? 'is-winning' : ''}`}
                    onClick={() => handleSquareClick(idx)}
                    disabled={isDisabled}
                    aria-label={getSquareAriaLabel(cell, game.currentPlayer, idx, game.isGameOver)}
                    aria-pressed={cell ? true : false}
                  >
                    <span className="ttt-mark" aria-hidden="true">
                      {cell}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="ttt-controls" aria-label="Game controls">
            <button type="button" className="btn btn-primary" onClick={resetGame}>
              Reset
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetGame}>
              New Game
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
