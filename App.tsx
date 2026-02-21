import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PHRASES } from './constants';
import { HeartIcon } from './components/icons';
import Keyboard from './components/Keyboard';

type GameState = 'playing' | 'gameOver';

// Helper component defined outside App to prevent re-creation on re-renders
const LivesTracker: React.FC<{ lives: number }> = ({ lives }) => (
  <div className="flex items-center gap-2">
    {[...Array(3)].map((_, i) => (
      <HeartIcon key={i} filled={i < lives} />
    ))}
  </div>
);

const App: React.FC = () => {
  const [phrases] = useState<string[]>(PHRASES);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [isError, setIsError] = useState<boolean>(false);
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  
  const errorSoundRef = useRef<HTMLAudioElement>(null);
  const errorSoundSrc = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV8vT18AAAC/9/f/6w/3/9s/7//m/+3/0///6v/t/7X/gv+W/4X/r/+B/5H/cf+3/5L/mP+b/1f/v/9V/4H/df9b/7f/iP9p/zL/qf+V/4X/ef+d/1D/uv9c/5L/cv+w/4H/lP+g/0v/rf9v/6T/ov9f/7b/iP+m/2v/sf+E/4X/of+e/2P/tP9e/6T/ff+k/3b/qf9v/6H/df+F/1X/r/+M/3n/iP+V/1v/mP9f/5n/jP+i/57/oP+q/7H/rv+5/7v/u/+5/7T/sf+v/7L/uv+3/7n/uf+2/7L/s/+w/6//q/+p/6f/p/+n/6j/qf+q/6v/rf+u/6//sP+y/7P/tP+1/7X/tv+3/7f/t/+3/7b/tP+y/7D/r/+u/63/qv+p/6f/pv+l/6T/pP+k/6X/pv+n/6j/qf+r/6z/rv+w/7L/tP+2/7f/uf+6/7v/vP+9/7//wP/B/8L/w//F/8b/yP/J/8r/y//M/83/zv/P/9D/0f/S/9P/1P/V/9b/1//Y/9n/2v/b/9z/3f/e/9//4P/h/+L/4//k/+X/5v/n/+j/6f/q/+v/7P/t/+7/7//w//H/8v/z//T/9X/2v/d/+H/5f/p/+z/7//x//P/9f/3//j/+f/6//v//P/9//8AAAAA";

  const selectNewPhrase = useCallback(() => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * phrases.length);
    } while (nextIndex === currentPhraseIndex && phrases.length > 1);
    setCurrentPhraseIndex(nextIndex);
  }, [phrases, currentPhraseIndex]);

  const handleRestart = useCallback(() => {
    setLives(3);
    setScore(0);
    setUserInput('');
    selectNewPhrase();
    setGameState('playing');
    setIsCooldown(false);
    setIsError(false);
  }, [selectNewPhrase]);

  useEffect(() => {
    selectNewPhrase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lives <= 0) {
      setGameState('gameOver');
    }
  }, [lives]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing' || isCooldown) return;

    const { value } = e.target;
    const currentPhrase = phrases[currentPhraseIndex];

    if (currentPhrase.startsWith(value)) {
      setUserInput(value);

      if (value === currentPhrase) {
        setScore(prevScore => prevScore + currentPhrase.length);
        setUserInput('');
        selectNewPhrase();
      }
    } else {
      if (errorSoundRef.current) {
        errorSoundRef.current.currentTime = 0;
        errorSoundRef.current.play().catch(error => console.error("Error playing sound:", error));
      }
      setLives(prevLives => prevLives - 1);
      setUserInput('');
      setIsError(true);
      setIsCooldown(true);
      
      setTimeout(() => setIsError(false), 500);
      setTimeout(() => setIsCooldown(false), 2000);
    }
  };

  const currentPhrase = phrases[currentPhraseIndex] || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 font-sans p-4">
      <audio ref={errorSoundRef} src={errorSoundSrc} preload="auto"></audio>
      <div className="w-full max-w-3xl text-center">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">Mecanografía Rápida</h1>
          <div className="flex justify-around items-center p-4 bg-slate-800 rounded-lg shadow-lg">
            <div>
              <span className="text-sm text-slate-400">PUNTUACIÓN</span>
              <p className="text-3xl font-bold text-white">{score}</p>
            </div>
            <div>
              <span className="text-sm text-slate-400">VIDAS</span>
              <LivesTracker lives={lives} />
            </div>
          </div>
        </header>

        <main className="relative p-8 bg-slate-800 rounded-lg shadow-lg min-h-[450px] flex flex-col justify-center">
          {gameState === 'playing' ? (
            <div className="flex flex-col items-center gap-6">
              <p className="text-xl md:text-2xl font-mono text-slate-300 tracking-wider p-4 border-2 border-dashed border-slate-600 rounded-md">
                {currentPhrase}
              </p>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                autoFocus
                disabled={isCooldown}
                className={`w-full p-4 bg-slate-700 border-2 rounded-md text-xl font-mono text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:border-cyan-500 ${isError ? 'animate-shake border-red-500' : 'border-slate-600'} disabled:cursor-not-allowed disabled:bg-slate-600`}
                placeholder={isCooldown ? 'Espera 2 segundos...' : 'Escribe la frase aquí...'}
              />
              <Keyboard userInput={userInput} />
            </div>
          ) : (
            <div className="absolute inset-0 bg-slate-800/90 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm z-10">
              <h2 className="text-6xl font-extrabold text-red-500 mb-4">GAME OVER</h2>
              <p className="text-2xl text-slate-300 mb-8">Puntuación Final: {score}</p>
              <button
                onClick={handleRestart}
                className="px-8 py-4 bg-green-500 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 transition-transform transform hover:scale-105"
              >
                Reiniciar
              </button>
            </div>
          )}
        </main>
        
        <footer className="mt-8 text-sm text-slate-500">
          <p>Escribe la frase exactamente como aparece. ¡Cada error te cuesta una vida!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
