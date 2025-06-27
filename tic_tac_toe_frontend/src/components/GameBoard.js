import React from 'react';

// PUBLIC_INTERFACE
/**
 * GameBoard - renders the 3x3 Tic Tac Toe board.
 * @param {Array} board - a 2D array [['X','O',''], ...]
 * @param {function} onMove - called as onMove(row, col) when a cell is clicked
 * @param {string} playerSymbol - player's symbol ('X' or 'O')
 * @param {boolean} canMove - is it player's turn
 * @param {boolean} disabled - disables all cells (game over, waiting)
 */
function GameBoard({ board, onMove, playerSymbol, canMove, disabled }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'repeat(3, 1fr)',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        width: 260,
        height: 260,
        margin: '1.5rem auto',
        background: 'var(--bg-secondary)',
        border: '2.5px solid var(--border-color)',
        borderRadius: 14,
      }}
      className="ttt-board"
    >
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const key = `${rIdx}-${cIdx}`;
          return (
            <button
              key={key}
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--bg-primary)',
                color:
                  cell === playerSymbol
                    ? 'var(--text-secondary)'
                    : 'var(--text-primary)',
                fontSize: 38,
                border: '1.5px solid var(--border-color)',
                borderRadius: 9,
                cursor:
                  !cell && canMove && !disabled
                    ? 'pointer'
                    : 'not-allowed',
                transition: 'background 0.15s, color 0.15s',
                fontWeight: 700,
                outline: 'none',
              }}
              onClick={() =>
                !cell && canMove && !disabled && onMove && onMove(rIdx, cIdx)
              }
              disabled={disabled || !!cell}
              aria-label={`Cell ${rIdx + 1}, ${cIdx + 1} ${
                cell ? `occupied by ${cell}` : ''
              }`}
            >
              {cell || ''}
            </button>
          );
        }),
      )}
    </div>
  );
}

export default GameBoard;
