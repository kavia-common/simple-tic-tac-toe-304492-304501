import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

function squareButton(row, col) {
  // Matches initial "Place X/O at row r column c" label.
  return screen.getByRole('button', {
    name: new RegExp(`row ${row} column ${col}`, 'i'),
  });
}

test('initial render shows Player X turn', () => {
  render(<App />);
  expect(screen.getByRole('status')).toHaveTextContent('Player X');
});

test('placing a mark toggles turn to O', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(squareButton(1, 1));

  expect(screen.getByRole('status')).toHaveTextContent('Player O');
});

test('cannot play on an occupied cell', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(squareButton(1, 1)); // X at (1,1)
  expect(screen.getByRole('status')).toHaveTextContent('Player O');

  // Try to click the same square again (it becomes disabled after placement).
  await user.click(screen.getByRole('button', { name: /row 1 column 1 is x/i }));

  // Turn should remain O because the second click should have no effect.
  expect(screen.getByRole('status')).toHaveTextContent('Player O');
});

test('detects a win (top row) and shows Player X wins!', async () => {
  const user = userEvent.setup();
  render(<App />);

  // X: (1,1), O: (2,1), X: (1,2), O: (2,2), X: (1,3) => X wins top row
  await user.click(squareButton(1, 1)); // X
  await user.click(squareButton(2, 1)); // O
  await user.click(squareButton(1, 2)); // X
  await user.click(squareButton(2, 2)); // O
  await user.click(squareButton(1, 3)); // X

  expect(screen.getByRole('status')).toHaveTextContent('Player X wins!');
});

test("detects a draw on a full board and shows It's a draw!", async () => {
  const user = userEvent.setup();
  render(<App />);

  // Fill board in a known draw sequence:
  // X O X
  // X O O
  // O X X
  const moves = [
    [1, 1], // X
    [1, 2], // O
    [1, 3], // X
    [2, 1], // O? wait - we need exact turn order; just click empties sequentially.
  ];

  // Explicitly click by coordinates in order:
  await user.click(squareButton(1, 1)); // X
  await user.click(squareButton(1, 2)); // O
  await user.click(squareButton(1, 3)); // X
  await user.click(squareButton(2, 2)); // O
  await user.click(squareButton(2, 1)); // X
  await user.click(squareButton(2, 3)); // O
  await user.click(squareButton(3, 2)); // X
  await user.click(squareButton(3, 1)); // O
  await user.click(squareButton(3, 3)); // X

  expect(screen.getByRole('status')).toHaveTextContent("It's a draw!");
});

test('Reset clears board and sets turn back to X', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(squareButton(1, 1)); // X
  expect(screen.getByRole('status')).toHaveTextContent('Player O');

  await user.click(screen.getByRole('button', { name: /reset/i }));

  expect(screen.getByRole('status')).toHaveTextContent('Player X');
  // After reset, square (1,1) should be empty again and offer placing X.
  expect(screen.getByRole('button', { name: /place x at row 1 column 1/i })).toBeEnabled();
});
