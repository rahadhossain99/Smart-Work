import React, { useState } from 'react';
import PlayerIcon from './icons/PlayerIcon';
import TargetIcon from './icons/TargetIcon';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';
type Theme = 'forest' | 'twilight';

interface ControlsProps {
  mazeSize: { width: number; height: number };
  setMazeSize: (size: { width: number; height: number }) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onNewMaze: () => void;
  onSolve: () => void;
  isBusy: boolean;
}

const difficultySettings = {
  'Easy': 10,
  'Medium': 20,
  'Hard': 30,
  'Insane': 40
};

const AccordionItem: React.FC<{title: string, children: React.ReactNode, defaultOpen?: boolean}> = ({ title, children, defaultOpen=false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-t border-[rgb(var(--text-primary)/0.2)]">
            <button 
                className="w-full flex justify-between items-center py-4 text-left themed-text-primary"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <h2 className="text-2xl font-bold">{title}</h2>
                <svg className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="pb-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Controls: React.FC<ControlsProps> = ({ mazeSize, setMazeSize, difficulty, setDifficulty, theme, setTheme, onNewMaze, onSolve, isBusy }) => {
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMazeSize({ width: value, height: value });
    // Find matching difficulty
    const newDifficulty = Object.entries(difficultySettings).find(([, size]) => size === value)?.[0] as Difficulty | undefined;
    if (newDifficulty) {
      setDifficulty(newDifficulty);
    }
  };
  
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    const newSize = difficultySettings[newDifficulty];
    setMazeSize({ width: newSize, height: newSize });
  };

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-4xl font-bold text-center themed-text-primary">Enchanted Forest</h1>
      
      <AccordionItem title="Difficulty" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-2">
            {Object.keys(difficultySettings).map((level) => (
                <button 
                    key={level}
                    onClick={() => handleDifficultyChange(level as Difficulty)}
                    disabled={isBusy}
                    className={`p-2 rounded-lg text-center transition-all duration-300 disabled:opacity-50 ${difficulty === level ? 'themed-accent-primary' : 'themed-bg-primary themed-text-secondary hover:bg-[rgb(var(--text-primary)/0.1)]'}`}
                >
                    {level}
                </button>
            ))}
        </div>
      </AccordionItem>
      
      <AccordionItem title="Customize">
        <div>
          <label htmlFor="size" className="block mb-2 text-md font-medium themed-text-secondary">
            Maze Size: <span className="font-bold themed-text-primary">{mazeSize.width}x{mazeSize.height}</span>
          </label>
          <input
            id="size"
            type="range"
            min="5"
            max="40"
            step="1"
            value={mazeSize.width}
            onChange={handleSizeChange}
            disabled={isBusy}
            className="w-full h-2 themed-bg-primary rounded-lg appearance-none cursor-pointer themed-accent-range disabled:opacity-50"
          />
        </div>
      </AccordionItem>

      <AccordionItem title="Theme">
        <div className="grid grid-cols-2 gap-2">
            <button 
                onClick={() => setTheme('forest')}
                className={`p-2 rounded-lg text-center transition-all duration-300 flex items-center justify-center space-x-2 ${theme === 'forest' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
            >
                <div className="w-4 h-4 rounded-full bg-emerald-300"></div><span>Forest</span>
            </button>
             <button 
                onClick={() => setTheme('twilight')}
                className={`p-2 rounded-lg text-center transition-all duration-300 flex items-center justify-center space-x-2 ${theme === 'twilight' ? 'bg-violet-500 text-white' : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'}`}
            >
                 <div className="w-4 h-4 rounded-full bg-violet-300"></div><span>Twilight</span>
            </button>
        </div>
      </AccordionItem>

      <div className="flex flex-col space-y-4 pt-4 border-t border-[rgb(var(--text-primary)/0.2)]">
        <h2 className="text-2xl font-bold themed-text-primary">Actions</h2>
        <button
          onClick={onNewMaze}
          disabled={isBusy}
          className="w-full themed-accent-primary font-bold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none themed-ring-accent-primary transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-stone-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isBusy ? 'Working...' : 'New Maze'}
        </button>
        <button
          onClick={onSolve}
          disabled={isBusy}
          className="w-full themed-accent-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none themed-ring-accent-secondary transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-stone-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isBusy ? 'Solving...' : 'Solve Maze'}
        </button>
      </div>

       <div className="pt-4 border-t border-[rgb(var(--text-primary)/0.2)] themed-text-secondary">
          <h3 className="text-xl font-bold themed-text-primary mb-2">How to Play</h3>
          <p className="flex items-center space-x-1">
            <span>Use your</span>
            <span className="font-bold">arrow keys</span>
            <span>to navigate the player (</span>
            <PlayerIcon className="inline h-5 w-5 themed-player-color" />
            <span>) from the start to the target (</span>
            <TargetIcon className="inline h-5 w-5 themed-target-color" />
            <span>).</span>
          </p>
      </div>
    </div>
  );
};

export default Controls;