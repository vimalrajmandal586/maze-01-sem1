"""Summarize real run data exported from the Maze / 01 browser game.

Usage: python tools/analyze_runs.py path/to/maze01-runs.json
Requires: numpy (pip install numpy)
"""
import json
import sys
from pathlib import Path

import numpy as np


def analyze(path: Path) -> None:
    with path.open(encoding="utf-8") as file:
        runs = json.load(file)
    if not isinstance(runs, list):
        raise ValueError("Expected a JSON list of game runs.")
    if not runs:
        print("No completed runs yet. Finish a maze, then export your runs.")
        return

    print(f"MAZE / 01 — {len(runs)} saved run(s)")
    print("These results come from this exported file, not a shared leaderboard.\n")
    for difficulty in ("easy", "medium", "hard"):
        selected = [run for run in runs if isinstance(run, dict) and run.get("difficulty") == difficulty]
        if not selected:
            continue
        times = np.array([float(run["timeSeconds"]) for run in selected], dtype=float)
        steps = np.array([int(run["steps"]) for run in selected], dtype=int)
        hints = np.array([int(run["hints"]) for run in selected], dtype=int)
        if not np.isfinite(times).all() or (times < 0).any():
            raise ValueError("Times must be finite, non-negative numbers.")
        print(f"{difficulty.upper()} ({len(selected)} run(s))")
        print(f"  Fastest time:      {np.min(times):.1f} s")
        print(f"  Average time:      {np.mean(times):.1f} s")
        print(f"  Median time:       {np.median(times):.1f} s")
        print(f"  Average moves:     {np.mean(steps):.1f}")
        print(f"  Runs using hints:  {np.count_nonzero(hints)} / {len(selected)}\n")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python tools/analyze_runs.py path/to/maze01-runs.json")
    try:
        analyze(Path(sys.argv[1]))
    except (OSError, ValueError, KeyError, TypeError, json.JSONDecodeError) as error:
        raise SystemExit(f"Could not analyze runs: {error}") from error
