# 🧩 MAZE / 01

### A Semester-One Side Quest

**A playable maze game built with HTML, CSS and JavaScript, with C++ and Python companion programs.**

Explore randomly generated mazes, discover the shortest route, track your performance, and connect fundamental programming concepts across three languages.

---

## 📌 About the Project

**Maze / 01** is a three-page, browser-based maze website developed as a Semester 1 student project. It combines a simple gaming experience with programming concepts such as algorithms, object-oriented programming, data analysis and browser storage.

The website is completely static, requires no build process, and can be hosted using **GitHub Pages**.

The project also includes a C++ maze solver and a Python data analyzer that work with files exported from the game.

> **Student Name:** VIMAL RAJ MANDAL
> **Course:** BSc Information Technology
> **Semester:** 1
> **Project Type:** Academic Mini Project

---

## ✨ Features

* 🎮 **Playable Maze Game** — Navigate generated mazes and reach the exit.
* 🎚️ **Three Difficulty Levels** — Choose easy, medium or hard.
* 🧠 **Maze Generation Algorithm** — Generate connected mazes using randomized depth-first search.
* 🧭 **Shortest-Path Hints** — Find a shortest route using breadth-first search (BFS).
* ⏱️ **Performance Tracking** — Record completion times, moves and hint usage.
* 💾 **Browser Storage** — Save personal run history using `localStorage`.
* 📤 **Data Export** — Export maze layouts and game history for external programs.
* 💻 **C++ Maze Solver** — Solve exported mazes using a `Maze` class and BFS.
* 📊 **Python Data Analyzer** — Analyze actual game runs using NumPy.
* 📱 **Responsive Design** — Navigate the website on desktop and mobile screens.
* 🌐 **GitHub Pages Ready** — Publish the static website without a backend.

---

## 🗂️ Project Structure

```text
mazequest/
│
├── index.html                 # Home and project introduction
├── play.html                  # Playable maze game
├── behind.html                # Project explanation and learning notes
├── README.md                  # Project documentation
│
├── assets/
│   ├── css/
│   │   └── style.css          # Styling and animations
│   │
│   ├── js/
│   │   ├── maze.js             # Generation, movement and pathfinding
│   │   ├── game.js             # Rendering, controls and game records
│   │   └── site.js             # Navigation and scroll effects
│   │
│   └── vendor/
│       └── jquery-3.7.1.min.js # Locally stored jQuery library
│
├── cpp/
│   └── maze_solver.cpp        # C++ maze-solving program
│
├── tools/
│   └── analyze_runs.py        # Python run-history analyzer
│
└── tests/
    └── maze.test.js           # Maze algorithm tests
```

---

## 🚀 Getting Started

### Option 1: Open the Website Directly

1. Download or clone this repository.
2. Open the project folder.
3. Double-click `index.html`.
4. Navigate to the Play page and start exploring.

### Option 2: Run a Local Development Server

If Python is installed, open a terminal in the project directory and run:

```bash
python -m http.server 8000
```

Open the following address in your browser:

**http://localhost:8000**

This address is for local development only. It is not the public website URL.

---

## 🕹️ How to Play

1. Open the **Play** page.
2. Select your preferred difficulty.
3. Navigate through the maze to reach the exit.
4. Use the available controls to move and request hints.
5. Complete the maze and review your performance.
6. Export the maze or your run history to use the companion programs.

**Note:** Browser-based records are stored on the player's device. They are not shared between users or automatically synchronized across browsers.

---

## 🧠 Programming Concepts Used

| Concept              | Implementation                                             |
| -------------------- | ---------------------------------------------------------- |
| HTML                 | Page structure and game interface                          |
| CSS                  | Layout, responsive styling and animations                  |
| JavaScript           | Game controls, maze generation and rendering               |
| Randomized DFS       | Generates connected mazes without loops                    |
| Breadth-First Search | Finds shortest paths through the maze                      |
| `localStorage`       | Saves personal game records in the browser                 |
| C++ OOP              | Uses a `Maze` class to load and solve exported mazes       |
| Python               | Processes exported game-run data                           |
| NumPy                | Supports numerical analysis of run statistics              |
| Software Testing     | Checks connectivity, reproducible seeds and shortest paths |

---

## 💻 C++ Maze Solver

The C++ companion program solves a maze exported from the website.

### Step 1 — Export a Maze

Open the Play page and select **Export this maze for the C++ solver**.

The exported text file represents walls, the starting point and the exit.

### Step 2 — Compile the Program

From the project directory, run:

```bash
g++ -std=c++17 -O2 cpp/maze_solver.cpp -o maze_solver
```

### Step 3 — Solve the Exported Maze

Replace the example path with the location of your downloaded file:

```bash
./maze_solver path/to/your-downloaded-maze.txt
```

On Windows, run the compiled program as:

```powershell
.\maze_solver.exe path\to\your-downloaded-maze.txt
```

The solver loads the maze into a `Maze` object, uses breadth-first search to find a shortest route, displays the solution and reports the number of moves.

---

## 📊 Python Run Analyzer

The Python companion tool analyzes game records exported by the website.

### Step 1 — Export Run History

Complete a few mazes, then select **Export runs as JSON** on the Play page.

### Step 2 — Install NumPy

```bash
python -m pip install numpy
```

### Step 3 — Run the Analyzer

```bash
python tools/analyze_runs.py path/to/maze01-runs.json
```

Depending on the exported data, the analyzer calculates:

* Fastest completion time
* Average and median completion time
* Average number of moves
* Hint usage by difficulty level

**Important:** The analysis uses the supplied run-history file. It does not generate fictional gameplay results. If no runs are available, the script reports that no data is available.

---

## 🧪 Running the Tests

The project includes automated tests for the maze-generation logic.

Make sure Node.js is installed, then run:

```bash
node tests/maze.test.js
```

The tests cover maze connectivity, repeatability with the same seed, and shortest-path behavior.

Run the tests yourself before documenting their results. Do not describe them as passing unless you have verified the output.

---

## 🌐 Deploying with GitHub Pages

You can publish the website for free using GitHub Pages.

1. Create a new repository on GitHub.
2. Upload the project files, keeping `index.html` in the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select your main branch and the `/(root)` folder.
6. Save your settings and wait for deployment.
7. Open the published URL and test all three pages.

Your website URL will generally follow this format:

`https://YOUR-USERNAME.github.io/YOUR-REPO/`

Replace the placeholders with your GitHub username and repository name.

### Hosting Limitations

GitHub Pages hosts static files. It does not execute Python or C++ programs on the server, run PHP, or provide a database.

The maze game runs in the browser, while the C++ solver and Python analyzer must be executed locally.

---

## 📁 Technical Notes

* The website uses HTML, CSS and JavaScript without a mandatory build step.
* Website assets are stored locally, including the vendored jQuery library.
* The C++ solver and Python analyzer are independent companion programs.
* Exported JSON files connect the browser game to the Python analyzer.
* Exported maze text files connect the browser game to the C++ solver.
* Browser records remain local unless the player exports them manually.
* The project does not provide a shared online leaderboard or server-side database.

---

## 🤖 AI Assistance & Academic Integrity

This initial version was developed with AI assistance based on a student-provided project brief. The student defined the project direction, subject scope and requested functionality, while AI assisted in drafting the initial design, written content and code.

Before submitting the project, the student should:

* Play-test all difficulty levels and game controls.
* Read and understand the relevant source code.
* Make and document their own modifications.
* Test the C++ and Python companion programs.
* Record genuine bugs, fixes and lessons learned.
* Follow the institution's rules for AI-assisted academic work.

**Personal contribution statement:** Update this section after making and verifying your own changes. Describe specific decisions, code modifications, tests and concepts you learned. Do not invent personal contributions or claim an arbitrary percentage of authorship.

---

## 📝 Future Improvements

Possible extensions for future versions include:

* Additional maze themes and visual styles
* More difficulty levels and maze sizes
* Improved accessibility and keyboard controls
* A persistent leaderboard backed by a server
* More detailed performance charts
* Additional automated tests

These are possible future ideas, not claims about features already implemented.

---

## 📜 License & Attribution

The project may be adapted for academic use, subject to your institution's rules and the applicable licenses of its dependencies.

The vendored **jQuery 3.7.1** library is distributed under the MIT License. See the [official jQuery license information](https://jquery.org/license/).

Review the licenses of any additional dependencies before redistributing the project.

---

<p align="center">

**MAZE / 01**

*A small maze. A bigger learning journey.*

Built as a Semester 1 learning project.

</p>
