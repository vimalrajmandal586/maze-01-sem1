# Maze / 01 — a semester-one side quest

A three-page, playable maze website made for a Sem 1 project. The site is **static** and can be hosted on **GitHub Pages**; the C++ and Python programs are separate companion tools in the repository.

> **Student name:** Your Name — replace this before submission.
>
> **Authorship note:** This first version was created with AI assistance from the student's brief. The idea, subjects, scope and requested direction came from the student; AI drafted the initial design, copy and code. The student should test, understand, modify and accurately document their own subsequent work before presenting this as a final project. Do not claim an arbitrary personal/AI percentage.

## What's in here?

- `index.html` — semester-one introduction and project overview
- `play.html` — playable maze with three difficulties, hints, timer, browser-local records and data export
- `behind.html` — the idea, maze logic, subject-by-subject breakdown and honest AI-use notes
- `assets/css/style.css` — responsive design and animations
- `assets/js/maze.js` — seeded randomized depth-first maze generator, movement rules, breadth-first shortest path, ASCII export
- `assets/js/game.js` — canvas rendering, controls, run history and download buttons
- `assets/js/site.js` — mobile menu and scroll reveals using locally stored jQuery
- `assets/vendor/jquery-3.7.1.min.js` — jQuery 3.7.1, locally vendored from code.jquery.com (MIT license)
- `cpp/maze_solver.cpp` — C++ `Maze` class that solves the maze exported from the browser
- `tools/analyze_runs.py` — Python + NumPy analysis of *actual* exported runs
- `tests/maze.test.js` — tests for maze connectivity, repeatable seeds and shortest paths

## Try the website locally

Open `index.html` in a browser, or serve this folder locally:

```bash
cd mazequest
python3 -m http.server 8000
```

Then visit `http://localhost:8000` on **your own computer**. (This localhost address is only for local development; the deployed site uses GitHub Pages.) All website assets are local; there is no build step and no CDN requirement.

## Publish on GitHub Pages

1. Create a repository on GitHub and upload the **contents of this folder** to the repository root (`index.html` must be at the root). Alternatively, keep the folder and move its contents into a `/docs` directory.
2. Open the repository's **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, your main branch, and **/(root)** (or **/docs** if you used that layout).
3. Save. GitHub will give you a URL like `https://YOUR-USERNAME.github.io/YOUR-REPO/` after publishing.
4. Check all three pages, game controls, downloads and mobile layout at the published URL.

GitHub Pages does **not** run PHP, Python, C++ or a database on the server. Browser saves are local to the player's device; they are not a shared leaderboard.

## Demo the C++ OOP solver

On the **Play** page, click **Export this maze for the C++ solver**. It downloads a `.txt` maze with `#` for walls, `S` for start, and `E` for exit. From the project directory:

```bash
g++ -std=c++17 -O2 cpp/maze_solver.cpp -o maze_solver
./maze_solver path/to/your-downloaded-maze.txt
```

The solver loads the file into a `Maze` object, performs breadth-first search, prints the shortest route as dots, and reports the number of browser-cell moves. The compiled binary is a local artifact, not part of the website.

## Demo the Python + NumPy analyzer

Complete a few mazes and click **Export runs as JSON** on the Play page. Then:

```bash
python3 -m pip install numpy
python3 tools/analyze_runs.py path/to/maze01-runs.json
```

It calculates fastest, average and median time, average moves and how often hints were used per difficulty. It never invents test results: numbers come from the exported file. If there are no runs, it says so.

## Explain the logic to faculty

1. **Generation:** Each cell starts with four walls. Randomized depth-first search visits a new neighbor, removes the shared wall and backtracks when stuck. The output connects every cell and has no loops.
2. **Movement:** A move is legal only if the current cell has no wall in that direction. The controls all use the same movement function.
3. **Hint:** Breadth-first search visits reachable cells in increasing distance and rebuilds a shortest path from parent pointers.
4. **Storage:** Completed runs and best times are saved via browser `localStorage`, so they are personal to that browser. JSON export is input for the Python script.
5. **Cross-language link:** The JS game exports an ASCII maze that the C++ program can solve locally. The Python tool accepts run history exported by the same game.

## Things to change before submitting

- Replace **Your Name** in `index.html` and this README with your name; add your department/college if required.
- Rewrite `behind.html`'s **AI & my work** section after you have actually played, reviewed and modified this project. Record specific fixes and decisions, not guessed percentages.
- Play through easy/medium/hard, check keyboard and phone controls, test the C++ export/solve workflow and Python data analysis.
- Consider adding a `CHANGES.md` listing your own changes and what you learned while making them.

## Run the maze tests

```bash
node tests/maze.test.js
```

## License note

The vendored jQuery copy is distributed under the [MIT license](https://jquery.org/license/). This project can be adapted for your academic submission subject to your institution's AI-use rules.
