import React from 'react';

// PUBLIC_INTERFACE
/**
 * StatusBar - Displays current game status, turn, player, and allows new game navigation.
 * @param {string} status - ("waiting", "in_progress", "won", "draw", etc.)
 * @param {string} turn - ("X" or "O" or null)
 * @param {string} playerSymbol - user's symbol
 * @param {string} winner - winner's symbol or null
 * @param {function} onRestart - callback for new game
 * @param {boolean} isSpectator - true if the user is not an active player
 */
function StatusBar({
  status,
  turn,
  playerSymbol,
  winner,
  onRestart,
  isSpectator,
}) {
  let message = '';
  let color = 'var(--text-primary)';

  if (status === 'waiting') {
    message = 'Waiting for another player to join...';
    color = '#bdbdbd';
  } else if (status === 'in_progress') {
    if (isSpectator) {
      message = `Spectating. ${turn ? `It's ${turn}'s turn.` : ''}`;
    } else if (turn === playerSymbol) {
      message = "Your turn!";
      color = 'var(--text-secondary)';
    } else {
      message = `Opponent's turn`;
      color = '#7897d6';
    }
  } else if (status === 'won') {
    if (winner === playerSymbol) {
      message = `🎉 You win!`;
      color = '#43a047';
    } else if (winner) {
      message = 'Defeat! You lost.';
      color = '#e53935';
    }
  } else if (status === 'draw') {
    message = "It's a draw!";
    color = '#ffb300';
  } else if (status === 'abandoned') {
    message = "Game ended: opponent left.";
    color = '#bdbdbd';
  }
  return (
    <div
      style={{
        padding: '16px 0 8px',
        fontWeight: 600,
        minHeight: 40,
        color: color,
        fontSize: 18,
      }}
      className="ttt-status-bar"
    >
      {message}
      {['won', 'draw', 'abandoned'].includes(status) && (
        <div>
          <button
            className="theme-toggle"
            style={{ marginTop: 14, fontSize: 15, padding: '7px 26px' }}
            onClick={onRestart}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}

export default StatusBar;
