import React, { useState, useEffect, useCallback } from 'react';
import { Maze as MazeType, Position } from './types';
import { generateMaze } from './services/mazeGenerator';
import { solveMaze } from './services/mazeSolver';
import Maze from './components/Maze';
import Controls from './components/Controls';
import Modal from './components/Modal';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';
type Theme = 'forest' | 'twilight';

const difficultySettings = {
  'Easy': 10,
  'Medium': 20,
  'Hard': 30,
  'Insane': 40
};

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [mazeSize, setMazeSize] = useState({ width: 10, height: 10 });
  const [theme, setTheme] = useState<Theme>('forest');
  const [maze, setMaze] = useState<MazeType | null>(null);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [startPosition] = useState<Position>({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState<Position>({ x: 9, y: 9 });
  const [solutionPath, setSolutionPath] = useState<Position[]>([]);
  const [isSolving, setIsSolving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);

  const createNewMaze = useCallback((width: number, height: number) => {
    setIsGenerating(true);
    setSolutionPath([]);
    setShowWinModal(false);
    
    setTimeout(() => {
        const newMaze = generateMaze(width, height);
        setMaze(newMaze);
        setPlayerPosition({ x: 0, y: 0 });
        setEndPosition({ x: width - 1, y: height - 1 });
        setIsGenerating(false);
    }, 50);
  }, []);

  useEffect(() => {
    createNewMaze(mazeSize.width, mazeSize.height);
  }, [mazeSize, createNewMaze]);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSolve = () => {
    if (!maze || isSolving || isGenerating) return;
    setIsSolving(true);
    const path = solveMaze(maze, startPosition, endPosition);
    setSolutionPath(path);
    // The animation is now handled by CSS in Maze.tsx
    // We just need to know when it's roughly over to re-enable buttons.
    setTimeout(() => {
        setIsSolving(false);
    }, 2000); // Corresponds to animation duration
  };
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!maze || isSolving || isGenerating || showWinModal) return;
    
    const { x, y } = playerPosition;
    const currentCell = maze[y][x];
    let newPos = { ...playerPosition };

    if (e.key === 'ArrowUp' && !currentCell.walls.top) newPos.y -= 1;
    else if (e.key === 'ArrowDown' && !currentCell.walls.bottom) newPos.y += 1;
    else if (e.key === 'ArrowLeft' && !currentCell.walls.left) newPos.x -= 1;
    else if (e.key === 'ArrowRight' && !currentCell.walls.right) newPos.x += 1;


    if(newPos.x !== playerPosition.x || newPos.y !== playerPosition.y) {
      if (solutionPath.length > 0) {
        setSolutionPath([]); // Clear solution path on player move
      }
      setPlayerPosition(newPos);
    }
  }, [maze, playerPosition, isSolving, isGenerating, showWinModal, solutionPath.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (maze && playerPosition.x === endPosition.x && playerPosition.y === endPosition.y) {
       setShowWinModal(true);
    }
  }, [playerPosition, endPosition, maze]);

  const handlePlayAgain = () => {
    const newSize = difficultySettings[difficulty];
    setMazeSize({ width: newSize, height: newSize });
  };

  return (
    <div className="min-h-screen themed-bg-primary themed-text-primary flex flex-col lg:flex-row items-center justify-center p-4 selection:bg-[rgb(var(--accent-primary)/0.5)] selection:text-white">
      <main className="w-full lg:w-auto flex-grow flex items-center justify-center p-4">
        {isGenerating ? (
          <div className="w-[80vmin] h-[80vmin] flex items-center justify-center themed-bg-secondary/50 rounded-2xl shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[rgb(var(--accent-primary))] mx-auto"></div>
              <p className="mt-4 text-[rgb(var(--text-primary))] text-xl">Conjuring a new forest...</p>
            </div>
          </div>
        ) : maze && (
          <Maze 
            maze={maze}
            playerPosition={playerPosition}
            startPosition={startPosition}
            endPosition={endPosition}
            solutionPath={solutionPath}
          />
        )}
      </main>
      <aside className="w-full lg:w-96 p-6 themed-bg-secondary/70 backdrop-blur-sm rounded-2xl shadow-xl border border-[rgb(var(--text-primary)/0.1)]">
        <Controls 
          mazeSize={mazeSize}
          setMazeSize={setMazeSize}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          theme={theme}
          setTheme={setTheme}
          onNewMaze={handlePlayAgain}
          onSolve={handleSolve}
          isBusy={isSolving || isGenerating}
        />
      </aside>
      <Modal 
        isOpen={showWinModal} 
        onClose={handlePlayAgain}
      >
          <div className="text-center themed-bg-secondary rounded-xl p-4">
            <h2 className="text-4xl font-bold text-[rgb(var(--accent-primary))] mb-4">Congratulations!</h2>
            <p className="themed-text-secondary mb-6">You have found your way through the enchanted maze.</p>
            <button
                onClick={handlePlayAgain}
                className="themed-accent-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 focus:outline-none themed-ring-accent-primary transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                Play Again
            </button>
          </div>
      </Modal>
    </div>
  );
};

export default App;