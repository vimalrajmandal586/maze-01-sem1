/* Browser game: display, controls, local records and export. Maze logic is in maze.js. */
(function () {
  "use strict";
  const M = window.MazeEngine;
  const canvas = document.getElementById("maze-canvas");
  if (!M || !canvas) return;
  const ctx = canvas.getContext("2d");
  const $id = (id) => document.getElementById(id);
  const sizes = { easy: 9, medium: 15, hard: 21 };
  const storageKey = "maze01-runs-v1";
  const bestKey = "maze01-best-v1";
  const renderSize = 600;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = renderSize * dpr;
  canvas.height = renderSize * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  let level = "easy",
    maze,
    player = 0,
    steps = 0,
    hints = 0;
  let startedAt = null,
    elapsedMs = 0,
    finished = false,
    hintTimer = null,
    visiblePath = [];
  let runs = readJSON(storageKey, []);
  let best = readJSON(bestKey, {});
  if (!Array.isArray(runs)) runs = [];
  if (!best || typeof best !== "object" || Array.isArray(best)) best = {};

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      status("Storage is unavailable; this run will not be saved.");
    }
  }
  function status(message) {
    $id("game-status").textContent = message;
  }
  function timeText(seconds) {
    if (seconds == null || !Number.isFinite(seconds)) return "—";
    const whole = Math.floor(seconds);
    return (
      String(Math.floor(whole / 60)).padStart(2, "0") +
      ":" +
      String(whole % 60).padStart(2, "0")
    );
  }
  function secondsNow() {
    return (startedAt === null ? elapsedMs : Date.now() - startedAt) / 1000;
  }
  function updateStats() {
    $id("timer").textContent = timeText(secondsNow());
    $id("steps").textContent = steps;
    $id("hints-used").textContent = hints;
    $id("best-time").textContent =
      best[level] == null ? "—" : timeText(best[level]);
  }
  function newSeed() {
    const value =
      window.crypto && window.crypto.getRandomValues
        ? window.crypto.getRandomValues(new Uint32Array(1))[0]
        : Math.floor(Math.random() * 4294967296);
    return value >>> 0;
  }
  function setup(seed) {
    window.clearTimeout(hintTimer);
    maze = M.generate(sizes[level], seed == null ? newSeed() : seed);
    player = 0;
    steps = 0;
    hints = 0;
    startedAt = null;
    elapsedMs = 0;
    finished = false;
    visiblePath = [];
    $id("win-overlay").hidden = true;
    $id("seed-label").textContent =
      "SEED / " + String(maze.seed).padStart(10, "0");
    $id("hint-button").disabled = false;
    document.querySelectorAll(".difficulty").forEach((button) => {
      const selected = button.dataset.level === level;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    updateStats();
    draw();
    status("A new " + level + " maze is ready. Make your first move!");
  }

  function draw() {
    const size = maze.size,
      gap = 28,
      cell = (renderSize - gap * 2) / size;
    ctx.clearRect(0, 0, renderSize, renderSize);
    ctx.fillStyle = "#203333";
    ctx.fillRect(gap - 4, gap - 4, cell * size + 8, cell * size + 8);
    // Subtle alternating cells make large mazes easier to read.
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = "#273b39";
          ctx.fillRect(
            gap + x * cell + 2,
            gap + y * cell + 2,
            cell - 4,
            cell - 4,
          );
        }
      }
    if (visiblePath.length > 1) {
      ctx.beginPath();
      visiblePath.forEach((position, i) => {
        const x = gap + ((position % size) + 0.5) * cell;
        const y = gap + (Math.floor(position / size) + 0.5) * cell;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.setLineDash([Math.max(3, cell * 0.16), Math.max(5, cell * 0.13)]);
      ctx.strokeStyle = "#e8d2ff";
      ctx.lineWidth = Math.max(3, cell * 0.13);
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // Draw north/west for each cell, then the outer east/south boundary.
    ctx.beginPath();
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const walls = maze.walls[y * size + x];
        const left = gap + x * cell,
          top = gap + y * cell;
        if (walls & M.N) {
          ctx.moveTo(left, top);
          ctx.lineTo(left + cell, top);
        }
        if (walls & M.W) {
          ctx.moveTo(left, top);
          ctx.lineTo(left, top + cell);
        }
        if (x === size - 1 && walls & M.E) {
          ctx.moveTo(left + cell, top);
          ctx.lineTo(left + cell, top + cell);
        }
        if (y === size - 1 && walls & M.S) {
          ctx.moveTo(left, top + cell);
          ctx.lineTo(left + cell, top + cell);
        }
      }
    ctx.strokeStyle = "#a7c3b2";
    ctx.lineWidth = Math.max(2, Math.min(4, cell * 0.075));
    ctx.lineJoin = "round";
    ctx.stroke();
    const exitX = gap + (size - 0.5) * cell,
      exitY = exitX;
    ctx.fillStyle = "#f4a58e";
    ctx.beginPath();
    ctx.roundRect(
      exitX - cell * 0.31,
      exitY - cell * 0.31,
      cell * 0.62,
      cell * 0.62,
      Math.max(3, cell * 0.1),
    );
    ctx.fill();
    ctx.fillStyle = "#263130";
    ctx.font = "bold " + Math.max(11, cell * 0.35) + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✳", exitX, exitY + 1);
    const px = gap + ((player % size) + 0.5) * cell,
      py = gap + (Math.floor(player / size) + 0.5) * cell;
    ctx.fillStyle = "#dcf08c33";
    ctx.beginPath();
    ctx.arc(px, py, cell * 0.43, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#dcf08c";
    ctx.beginPath();
    ctx.arc(px, py, cell * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e3026";
    ctx.beginPath();
    ctx.arc(px, py, Math.max(2, cell * 0.075), 0, Math.PI * 2);
    ctx.fill();
  }

  function move(direction) {
    if (finished) return;
    const next = M.neighbor(maze, player, direction);
    if (next === -1) {
      status("A wall! Try another direction.");
      return;
    }
    if (startedAt === null) startedAt = Date.now() - elapsedMs;
    player = next;
    steps++;
    visiblePath = [];
    window.clearTimeout(hintTimer);
    draw();
    updateStats();
    if (player === maze.size * maze.size - 1) win();
    else status("Keep going — the exit is the peach square.");
  }
  function win() {
    elapsedMs = Date.now() - startedAt;
    startedAt = null;
    finished = true;
    const timeSeconds = Math.round(elapsedMs / 100) / 10;
    const previous = best[level];
    const isBest = previous == null || timeSeconds < previous;
    if (isBest) {
      best[level] = timeSeconds;
      saveJSON(bestKey, best);
    }
    const record = {
      date: new Date().toISOString(),
      difficulty: level,
      seed: maze.seed,
      timeSeconds,
      steps,
      hints,
    };
    runs.unshift(record);
    runs = runs.slice(0, 50);
    saveJSON(storageKey, runs);
    updateStats();
    renderRuns();
    $id("win-summary").textContent =
      timeText(timeSeconds) +
      " · " +
      steps +
      " steps · " +
      hints +
      " hints" +
      (isBest ? " · NEW BEST!" : "");
    $id("win-overlay").hidden = false;
    $id("hint-button").disabled = true;
    status(
      "You reached the exit" + (isBest ? " and set a new personal best!" : "!"),
    );
  }
  function showHint() {
    if (finished) return;
    visiblePath = M.shortestPath(maze, player, maze.size * maze.size - 1);
    hints++;
    updateStats();
    draw();
    status("The dotted line shows the shortest route for a moment.");
    window.clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      visiblePath = [];
      draw();
    }, 2400);
  }
  function renderRuns() {
    const container = $id("recent-runs");
    container.replaceChildren();
    const recent = runs
      .filter((run) => run && typeof run === "object")
      .slice(0, 3);
    if (!recent.length) {
      const empty = document.createElement("p");
      empty.className = "empty-runs";
      empty.textContent =
        "No completed runs yet. Your first one starts above ↗";
      container.append(empty);
    } else
      recent.forEach((run) => {
        const row = document.createElement("div");
        row.className = "run-row";
        const difficulty = document.createElement("span");
        difficulty.textContent = String(run.difficulty || "run");
        const time = document.createElement("strong");
        time.textContent = timeText(Number(run.timeSeconds));
        const detail = document.createElement("small");
        detail.textContent = Number(run.steps || 0) + " steps";
        row.append(difficulty, time, detail);
        container.append(row);
      });
    $id("export-runs").disabled = !runs.length;
  }
  function download(filename, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  document.querySelectorAll("[data-level]").forEach((button) =>
    button.addEventListener("click", () => {
      level = button.dataset.level;
      setup();
    }),
  );
  document
    .querySelectorAll("[data-move]")
    .forEach((button) =>
      button.addEventListener("click", () => move(Number(button.dataset.move))),
    );
  $id("hint-button").addEventListener("click", showHint);
  $id("restart-button").addEventListener("click", () => {
    const seed = maze.seed;
    setup(seed);
    status("Same maze, fresh start.");
  });
  $id("new-button").addEventListener("click", () => setup());
  $id("play-again").addEventListener("click", () => setup());
  $id("export-runs").addEventListener("click", () =>
    download(
      "maze01-runs.json",
      JSON.stringify(runs, null, 2),
      "application/json",
    ),
  );
  $id("export-maze").addEventListener("click", () =>
    download(
      "maze01-" + level + "-" + maze.seed + ".txt",
      M.toAscii(maze),
      "text/plain",
    ),
  );
  const keys = {
    ArrowUp: 0,
    ArrowRight: 1,
    ArrowDown: 2,
    ArrowLeft: 3,
    w: 0,
    d: 1,
    s: 2,
    a: 3,
  };
  document.addEventListener("keydown", (event) => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)
    )
      return;
    const direction = keys[event.key] ?? keys[event.key.toLowerCase()];
    if (direction !== undefined) {
      event.preventDefault();
      move(direction);
    }
  });
  let touchStart = null;
  canvas.addEventListener(
    "touchstart",
    (event) => {
      touchStart = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
    },
    { passive: true },
  );
  canvas.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 18)
        move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : dy > 0 ? 2 : 0);
      touchStart = null;
    },
    { passive: true },
  );
  window.setInterval(() => {
    if (startedAt !== null && !finished) updateStats();
  }, 250);
  renderRuns();
  setup();
})();
