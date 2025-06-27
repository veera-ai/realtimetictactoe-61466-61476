import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

import CreateJoinGame from './components/CreateJoinGame';
import GameBoard from './components/GameBoard';
import StatusBar from './components/StatusBar';
import { fetchGameState, makeMove } from './api';
import { useWebSocket } from './hooks/useWebSocket';

// PUBLIC_INTERFACE
function App() {
  // Theme (light/dark)
  const [theme, setTheme] = useState('light');

  // Game/state
  const [step, setStep] = useState('menu'); // menu | playing
  const [gameId, setGameId] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null); // 'X' or 'O'
  const [board, setBoard] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
  const [status, setStatus] = useState('waiting');
  const [turn, setTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isSpectator, setIsSpectator] = useState(false);
  const [wsUrl, setWsUrl] = useState(null);
  const [error, setError] = useState('');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // When user successfully starts/joins a game
  const handleGameReady = (id, symbol) => {
    setGameId(id);
    setPlayerSymbol(symbol);
    setStep('playing');
    setIsSpectator(false);
    setError('');
    setWsUrl(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:3001/ws/games/${id}?player=${symbol}`);
    // State will be synced by ws or fetch below
  };

  // On manual reload (e.g., after reconnect or page refresh)
  useEffect(() => {
    if (gameId && playerSymbol) {
      fetchGameState(gameId)
        .then((data) => {
          setBoard(data.board);
          setStatus(data.status);
          setTurn(data.turn);
          setWinner(data.winner || null);
          setIsSpectator(data.is_spectator || false);
        })
        .catch(() => {
          setError('Could not fetch game state');
        });
    }
  }, [gameId, playerSymbol]);

  // WebSocket: Real-time update handler
  const handleWsMsg = useCallback(
    (msg) => {
      // Backend should push board, status, turn, winner etc.
      if (msg.type === 'state') {
        setBoard(msg.board);
        setStatus(msg.status);
        setTurn(msg.turn);
        setWinner(msg.winner || null);
        setIsSpectator(msg.is_spectator || false);
      } else if (msg.type === 'error') {
        setError(msg.detail || msg.message);
      }
    },
    []
  );

  // Attach WebSocket when in game
  useWebSocket(wsUrl, handleWsMsg);

  // On move on board (row,col)
  const handleMove = async (row, col) => {
    setError('');
    try {
      await makeMove(gameId, row, col);
      // UI updates on ws event, not immediately for optimistic mode
    } catch (err) {
      setError(err.message || 'Move error.');
    }
  };

  // "New Game" = return to main menu
  const handleRestart = () => {
    setGameId(null);
    setPlayerSymbol(null);
    setStep('menu');
    setStatus('waiting');
    setTurn(null);
    setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
    setWinner(null);
    setIsSpectator(false);
    setWsUrl(null);
    setError('');
  };

  // Figure out if this user can move
  const canMove =
    status === 'in_progress' && !isSpectator && turn === playerSymbol;

  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      <header className="App-header" style={{ minHeight: 'unset', paddingTop: 50 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div style={{ marginBottom: 22 }}></div>
        {step === 'menu' ? (
          <CreateJoinGame onGameReady={handleGameReady} />
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: 310,
                margin: '0 auto 4px',
                fontSize: 15,
                color: 'var(--text-secondary)',
                opacity: 0.8,
                gap: 8,
                fontWeight: 500,
              }}
            >
              <span>
                Code:&nbsp;
                <span
                  style={{
                    fontWeight: 600,
                    background: 'var(--border-color)',
                    padding: '3px 9px',
                    borderRadius: 6,
                  }}
                >
                  {gameId}
                </span>
              </span>
              <span>
                You:&nbsp;
                <span style={{ color: 'var(--text-secondary)' }}>{playerSymbol || '?'}</span>
              </span>
            </div>
            <GameBoard
              board={board}
              onMove={handleMove}
              playerSymbol={playerSymbol}
              canMove={canMove}
              disabled={status !== 'in_progress'}
            />

            <StatusBar
              status={status}
              turn={turn}
              playerSymbol={playerSymbol}
              winner={winner}
              onRestart={handleRestart}
              isSpectator={isSpectator}
            />
            {error && (
              <div style={{ color: '#e53935', marginTop: 10, fontSize: 15 }}>{error}</div>
            )}
          </>
        )}
        <footer style={{ marginTop: 40, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>Powered by KAVIA &mdash; Modern Tic Tac Toe Demo</span>
        </footer>
      </header>
    </div>
  );
}

export default App;
