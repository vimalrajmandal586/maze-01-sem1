const assert = require("node:assert/strict");
const M = require("../assets/js/maze.js");

for (const size of [9, 15, 21]) {
  for (const seed of [1, 42, 123456789, 4294967295]) {
    const maze = M.generate(size, seed);
    assert.deepEqual(maze, M.generate(size, seed), "same seed gives same maze");
    const path = M.shortestPath(maze, 0, size * size - 1);
    assert.ok(path.length > 1, "every maze has a route");
    assert.equal(path[0], 0);
    assert.equal(path[path.length - 1], size * size - 1);
    const seen = new Set([0]);
    const queue = [0];
    for (let i = 0; i < queue.length; i++) {
      for (let direction = 0; direction < 4; direction++) {
        const next = M.neighbor(maze, queue[i], direction);
        if (next >= 0 && !seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
        if (next >= 0) {
          const opposite = (direction + 2) % 4;
          assert.equal(
            M.neighbor(maze, next, opposite),
            queue[i],
            "open walls agree on both cells",
          );
        }
      }
    }
    assert.equal(seen.size, size * size, "all cells are connected");
    assert.equal(
      maze.walls.reduce(
        (sum, walls) =>
          sum + [M.N, M.E, M.S, M.W].filter((bit) => !(walls & bit)).length,
        0,
      ) / 2,
      size * size - 1,
      "perfect maze has n-1 passages",
    );
    for (let i = 1; i < path.length; i++) {
      assert.ok(
        [0, 1, 2, 3].some(
          (direction) => M.neighbor(maze, path[i - 1], direction) === path[i],
        ),
        "path crosses only open walls",
      );
    }
    const lines = M.toAscii(maze).trimEnd().split("\n");
    assert.equal(lines.length, size * 2 + 1);
    assert.ok(lines.every((line) => line.length === size * 2 + 1));
    assert.equal(lines[1][1], "S");
    assert.equal(lines[lines.length - 2][lines.length - 2], "E");
  }
}
console.log("Maze generation, connectivity, pathfinding and export: PASS");
