/* Maze generation and pathfinding. No DOM here, so this file can be tested in Node too. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MazeEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const N = 1,
    E = 2,
    S = 4,
    W = 8;
  const DIRECTIONS = [
    { bit: N, opposite: S, dx: 0, dy: -1 },
    { bit: E, opposite: W, dx: 1, dy: 0 },
    { bit: S, opposite: N, dx: 0, dy: 1 },
    { bit: W, opposite: E, dx: -1, dy: 0 },
  ];

  // A tiny seeded random-number generator: the same seed produces the same maze.
  function randomFromSeed(seed) {
    let state = seed >>> 0;
    return function () {
      state += 0x6d2b79f5;
      let x = state;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generate(size, seed) {
    if (!Number.isInteger(size) || size < 2 || size > 100)
      throw new Error("Invalid maze size");
    const random = randomFromSeed(seed);
    const walls = Array.from({ length: size * size }, () => N | E | S | W);
    const visited = new Uint8Array(size * size);
    const stack = [0];
    visited[0] = 1;

    while (stack.length) {
      const current = stack[stack.length - 1];
      const x = current % size,
        y = Math.floor(current / size);
      const choices = DIRECTIONS.map((dir) => ({
        dir,
        nx: x + dir.dx,
        ny: y + dir.dy,
      })).filter(
        ({ nx, ny }) =>
          nx >= 0 &&
          nx < size &&
          ny >= 0 &&
          ny < size &&
          !visited[ny * size + nx],
      );
      if (!choices.length) {
        stack.pop();
        continue;
      }
      const { dir, nx, ny } = choices[Math.floor(random() * choices.length)];
      const next = ny * size + nx;
      walls[current] &= ~dir.bit;
      walls[next] &= ~dir.opposite;
      visited[next] = 1;
      stack.push(next);
    }
    return { size, seed, walls };
  }

  function neighbor(maze, cell, directionIndex) {
    const dir = DIRECTIONS[directionIndex];
    if (!dir || maze.walls[cell] & dir.bit) return -1;
    const x = (cell % maze.size) + dir.dx;
    const y = Math.floor(cell / maze.size) + dir.dy;
    return x < 0 || y < 0 || x >= maze.size || y >= maze.size
      ? -1
      : y * maze.size + x;
  }

  // Breadth-first search, with a parent array to rebuild the shortest path.
  function shortestPath(maze, from, to) {
    const count = maze.size * maze.size;
    if (from < 0 || from >= count || to < 0 || to >= count) return [];
    const parent = new Int32Array(count).fill(-1);
    const queue = [from];
    parent[from] = from;
    for (let head = 0; head < queue.length; head++) {
      const cell = queue[head];
      if (cell === to) break;
      for (let direction = 0; direction < 4; direction++) {
        const next = neighbor(maze, cell, direction);
        if (next !== -1 && parent[next] === -1) {
          parent[next] = cell;
          queue.push(next);
        }
      }
    }
    if (parent[to] === -1) return [];
    const path = [];
    for (let cell = to; cell !== from; cell = parent[cell]) path.push(cell);
    path.push(from);
    return path.reverse();
  }

  // Export an ASCII maze that the C++ companion program can read.
  function toAscii(maze) {
    const width = maze.size * 2 + 1;
    const grid = Array.from({ length: width }, () => Array(width).fill("#"));
    for (let y = 0; y < maze.size; y++) {
      for (let x = 0; x < maze.size; x++) {
        const index = y * maze.size + x;
        grid[2 * y + 1][2 * x + 1] = " ";
        if (!(maze.walls[index] & E)) grid[2 * y + 1][2 * x + 2] = " ";
        if (!(maze.walls[index] & S)) grid[2 * y + 2][2 * x + 1] = " ";
      }
    }
    grid[1][1] = "S";
    grid[width - 2][width - 2] = "E";
    return grid.map((row) => row.join("")).join("\n") + "\n";
  }

  return { N, E, S, W, DIRECTIONS, generate, neighbor, shortestPath, toAscii };
});
