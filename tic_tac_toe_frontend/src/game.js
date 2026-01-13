/**
 * Pure helper utilities for Tic Tac Toe game rules.
 */

/**
 * Board values are: 'X' | 'O' | null
 * @typedef {'X'|'O'|null} Cell
 */

/**
 * PUBLIC_INTERFACE
 * Calculates the winner for a given board.
 * @param {Cell[]} board - Array of 9 cells.
 * @returns {{winner: 'X'|'O', line: number[]} | null} Winner info (including winning indices) or null.
 */
export function calculateWinner(board) {
  if (!Array.isArray(board) || board.length !== 9) return null;

  /** @type {number[][]} */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diags
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return { winner: v, line };
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Determines if the board is a draw (full board with no winner).
 * @param {Cell[]} board - Array of 9 cells.
 * @returns {boolean} True if draw, else false.
 */
export function isDraw(board) {
  if (!Array.isArray(board) || board.length !== 9) return false;
  if (calculateWinner(board)) return false;
  return board.every((c) => c === 'X' || c === 'O');
}

/**
 * PUBLIC_INTERFACE
 * Determines if a move is valid at the given index.
 * @param {Cell[]} board - Array of 9 cells.
 * @param {number} index - Cell index 0..8.
 * @returns {boolean} True if index in range and cell empty.
 */
export function isValidMove(board, index) {
  if (!Array.isArray(board) || board.length !== 9) return false;
  if (typeof index !== 'number' || Number.isNaN(index)) return false;
  if (index < 0 || index > 8) return false;
  return board[index] == null;
}
