import React from 'react';
import { Maze as MazeType, Position } from '../types';
import PlayerIcon from './icons/PlayerIcon';
import TargetIcon from './icons/TargetIcon';

interface MazeProps {
  maze: MazeType;
  playerPosition: Position;
  startPosition: Position;
  endPosition: Position;
  solutionPath: Position[];
}

const Maze: React.FC<MazeProps> = ({ maze, playerPosition, startPosition, endPosition, solutionPath }) => {
  if (!maze || maze.length === 0) {
    return null;
  }
  const width = maze[0].length;
  const height = maze.length;
  const cellSize = 100 / width; // Use a relative unit

  const getCellClasses = (cell: MazeType[0][0]) => {
    const classes = ['relative', 'transition-colors', 'duration-300'];
    if (!cell.walls.top) classes.push('border-t-transparent'); else classes.push('themed-wall-color');
    if (!cell.walls.right) classes.push('border-r-transparent'); else classes.push('themed-wall-color');
    if (!cell.walls.bottom) classes.push('border-b-transparent'); else classes.push('themed-wall-color');
    if (!cell.walls.left) classes.push('border-l-transparent'); else classes.push('themed-wall-color');
    return classes.join(' ');
  };

  const solutionPathD = solutionPath
    .map((p, i) => {
      const x = (p.x + 0.5) * cellSize;
      const y = (p.y + 0.5) * cellSize;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
  
  return (
    <div className="themed-maze-bg p-2 sm:p-4 rounded-2xl shadow-lg border-2 border-[rgb(var(--wall-color)/0.5)] aspect-square relative">
      <div 
        className="grid transition-all duration-500 relative"
        style={{ 
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
          width: 'clamp(300px, 80vmin, 800px)',
          height: 'clamp(300px, 80vmin, 800px)',
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`border ${getCellClasses(cell)}`}
            >
              <div className={`w-full h-full flex items-center justify-center transition-all duration-300`}>
                {startPosition.x === x && startPosition.y === y && (
                  <span className="text-xs themed-text-secondary font-bold select-none">START</span>
                )}
                {endPosition.x === x && endPosition.y === y && (
                  <TargetIcon className="w-3/4 h-3/4 themed-target-color" />
                )}
              </div>
            </div>
          ))
        )}

        {/* Player Position */}
        <div
          className="absolute transition-all duration-200 ease-in-out"
          style={{
            width: `${cellSize}%`,
            height: `${cellSize}%`,
            top: `${playerPosition.y * cellSize}%`,
            left: `${playerPosition.x * cellSize}%`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <PlayerIcon className="w-3/4 h-3/4 themed-player-color drop-shadow-lg" />
          </div>
        </div>

        {/* Solution Path SVG */}
        {solutionPath.length > 0 && (
          <svg
            className="absolute top-0 left-0 w-full h-full overflow-visible"
            viewBox={`0 0 ${width * cellSize} ${height * cellSize}`}
            preserveAspectRatio="none"
          >
            <path
              d={solutionPathD}
              fill="none"
              stroke="rgb(var(--solution-path))"
              strokeWidth={cellSize * 0.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="solution-path"
            />
            <style>{`
              .solution-path {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw-path 2s ease-in-out forwards;
              }
              @keyframes draw-path {
                to {
                  stroke-dashoffset: 0;
                }
              }
            `}</style>
          </svg>
        )}
      </div>
    </div>
  );
};

export default Maze;