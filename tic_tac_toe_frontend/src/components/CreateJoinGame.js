import React, { useState } from 'react';
import { createGame, joinGame } from '../api';

// PUBLIC_INTERFACE
/**
 * CreateJoinGame component allows a user to start or join a Tic Tac Toe game.
 * @param {function} onGameReady - called with { gameId, playerSymbol }
 */
function CreateJoinGame({ onGameReady }) {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Start new game
  async function handleCreate() {
    setError('');
    setLoading(true);
    try {
      const { game_id, player_symbol } = await createGame();
      onGameReady && onGameReady(game_id, player_symbol);
    } catch (e) {
      setError(e.message || 'Failed to start game');
    }
    setLoading(false);
  }

  // Join existing game
  async function handleJoin(e) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setError('');
    setLoading(true);
    try {
      const { game_id, player_symbol } = await joinGame(joinCode.trim());
      onGameReady && onGameReady(game_id, player_symbol);
    } catch (e) {
      setError(e.message || 'Failed to join game');
    }
    setLoading(false);
  }

  return (
    <div className="container" style={{ maxWidth: 340, margin: '3rem auto' }}>
      <h2 style={{ marginBottom: 16 }}>Tic Tac Toe</h2>
      <button className="theme-toggle" style={{ position: 'static', margin: '12px 0' }} onClick={handleCreate} disabled={loading}>
        {loading ? 'Starting...' : 'Start New Game'}
      </button>
      <form style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 8 }} onSubmit={handleJoin}>
        <label htmlFor="join-code" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
          Join Game by Code:
        </label>
        <input
          id="join-code"
          type="text"
          maxLength={24}
          placeholder="Enter game code"
          value={joinCode}
          autoComplete="off"
          onChange={e => setJoinCode(e.target.value)}
          style={{
            padding: '8px',
            fontSize: 16,
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            marginBottom: 8,
          }}
        />
        <button
          className="theme-toggle"
          style={{ position: 'static', width: '100%' }}
          type="submit"
          disabled={loading || !joinCode.trim()}
        >{loading ? 'Joining...' : 'Join Game'}
        </button>
        {error && <div style={{ color: '#e53935', fontSize: 14, marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}

export default CreateJoinGame;
