//
// API UTILS: Handles REST calls to backend for game actions.
//
const BASE_URL = 'https://vscode-internal-28-dev.dev01.cloud.kavia.ai:3001';

//
// PUBLIC_INTERFACE
// Create a new game. Returns { game_id, player_symbol }
export async function createGame() {
  const res = await fetch(`${BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Unable to create game');
  return res.json();
}

// PUBLIC_INTERFACE
// Join an existing game by code. Returns { game_id, player_symbol }
export async function joinGame(gameId) {
  const res = await fetch(`${BASE_URL}/games/${gameId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Unable to join game');
  return res.json();
}

// PUBLIC_INTERFACE
// Get game state: board, status, turn, winner, etc.
export async function fetchGameState(gameId) {
  const res = await fetch(`${BASE_URL}/games/${gameId}`);
  if (!res.ok) throw new Error('Unable to fetch game state');
  return res.json();
}

// PUBLIC_INTERFACE
// Make a move: expects { row, col }
export async function makeMove(gameId, row, col) {
  const res = await fetch(`${BASE_URL}/games/${gameId}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ row, col }),
  });
  if (!res.ok) {
    let err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || 'Invalid move');
  }
  return res.json();
}
