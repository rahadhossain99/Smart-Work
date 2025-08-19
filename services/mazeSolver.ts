import { Maze, Position } from '../types';

export const solveMaze = (maze: Maze, start: Position, end: Position): Position[] => {
  const width = maze[0].length;
  const height = maze.length;
  const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [start] }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    const { x, y } = pos;

    if (x === end.x && y === end.y) {
      return path;
    }

    const currentCell = maze[y][x];
    const neighbors = [];

    // Top
    if (!currentCell.walls.top && y > 0) neighbors.push({ x, y: y - 1 });
    // Right
    if (!currentCell.walls.right && x < width - 1) neighbors.push({ x: x + 1, y });
    // Bottom
    if (!currentCell.walls.bottom && y < height - 1) neighbors.push({ x, y: y + 1 });
    // Left
    if (!currentCell.walls.left && x > 0) neighbors.push({ x: x - 1, y });

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        const newPath = [...path, neighbor];
        queue.push({ pos: neighbor, path: newPath });
      }
    }
  }

  return []; // No path found
};
