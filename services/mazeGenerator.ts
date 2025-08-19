import { Maze, Position } from '../types';

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateMaze = (width: number, height: number): Maze => {
  const maze: Maze = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
    }))
  );

  const stack: Position[] = [];
  const start: Position = { x: 0, y: 0 };
  maze[start.y][start.x].visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack.pop()!;
    const { x, y } = current;

    const neighbors = [];
    // Top
    if (y > 0 && !maze[y - 1][x].visited) neighbors.push({ x, y: y - 1, dir: 'top' });
    // Right
    if (x < width - 1 && !maze[y][x + 1].visited) neighbors.push({ x: x + 1, y, dir: 'right' });
    // Bottom
    if (y < height - 1 && !maze[y + 1][x].visited) neighbors.push({ x, y: y + 1, dir: 'bottom' });
    // Left
    if (x > 0 && !maze[y][x - 1].visited) neighbors.push({ x: x - 1, y, dir: 'left' });

    if (neighbors.length > 0) {
      stack.push(current);
      const randomNeighbor = shuffle(neighbors)[0];
      const { x: nx, y: ny, dir } = randomNeighbor;

      // Remove walls
      if (dir === 'top') {
        maze[y][x].walls.top = false;
        maze[ny][nx].walls.bottom = false;
      } else if (dir === 'right') {
        maze[y][x].walls.right = false;
        maze[ny][nx].walls.left = false;
      } else if (dir === 'bottom') {
        maze[y][x].walls.bottom = false;
        maze[ny][nx].walls.top = false;
      } else if (dir === 'left') {
        maze[y][x].walls.left = false;
        maze[ny][nx].walls.right = false;
      }
      
      maze[ny][nx].visited = true;
      stack.push({ x: nx, y: ny });
    }
  }
  return maze;
};
