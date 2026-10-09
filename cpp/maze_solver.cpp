// Maze / 01 companion: an object-oriented shortest-path solver for exported ASCII mazes.
// Build: g++ -std=c++17 -O2 cpp/maze_solver.cpp -o maze_solver
// Run:   ./maze_solver maze01-easy-12345.txt
#include <algorithm>
#include <fstream>
#include <iostream>
#include <queue>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

class Maze {
public:
    explicit Maze(const std::string& filename) {
        std::ifstream input(filename);
        if (!input) throw std::runtime_error("Could not open maze file: " + filename);
        std::string line;
        while (std::getline(input, line)) {
            if (!line.empty() && line.back() == '\r') line.pop_back();
            if (!line.empty()) grid_.push_back(line); // Keep spaces: they are the paths.
        }
        if (grid_.empty()) throw std::runtime_error("Maze file is empty.");
        width_ = static_cast<int>(grid_[0].size());
        height_ = static_cast<int>(grid_.size());
        int starts = 0, exits = 0;
        for (int y = 0; y < height_; ++y) {
            if (static_cast<int>(grid_[y].size()) != width_)
                throw std::runtime_error("Maze rows must have the same width.");
            for (int x = 0; x < width_; ++x) {
                if (grid_[y][x] == 'S') { start_ = {x, y}; ++starts; }
                if (grid_[y][x] == 'E') { exit_ = {x, y}; ++exits; }
            }
        }
        if (starts != 1 || exits != 1) throw std::runtime_error("Maze needs exactly one S and one E.");
    }

    // Breadth-first search explores all positions one step away before going further.
    std::vector<std::pair<int, int>> shortestPath() const {
        const int total = width_ * height_;
        std::vector<int> parent(total, -1);
        std::queue<int> frontier;
        const int first = index(start_.first, start_.second);
        const int last = index(exit_.first, exit_.second);
        frontier.push(first);
        parent[first] = first;
        const int dx[] = {0, 1, 0, -1};
        const int dy[] = {-1, 0, 1, 0};
        while (!frontier.empty()) {
            int current = frontier.front(); frontier.pop();
            if (current == last) break;
            int x = current % width_, y = current / width_;
            for (int direction = 0; direction < 4; ++direction) {
                int nx = x + dx[direction], ny = y + dy[direction];
                if (nx < 0 || ny < 0 || nx >= width_ || ny >= height_) continue;
                int next = index(nx, ny);
                if (grid_[ny][nx] == '#' || parent[next] != -1) continue;
                parent[next] = current;
                frontier.push(next);
            }
        }
        if (parent[last] == -1) return {};
        std::vector<std::pair<int, int>> path;
        for (int current = last; current != first; current = parent[current])
            path.push_back({current % width_, current / width_});
        path.push_back(start_);
        std::reverse(path.begin(), path.end());
        return path;
    }

    void printWithPath(const std::vector<std::pair<int, int>>& path) const {
        auto drawing = grid_;
        for (const auto& [x, y] : path)
            if (drawing[y][x] == ' ') drawing[y][x] = '.';
        for (const auto& row : drawing) std::cout << row << '\n';
    }

private:
    int index(int x, int y) const { return y * width_ + x; }
    std::vector<std::string> grid_;
    int width_ = 0, height_ = 0;
    std::pair<int, int> start_, exit_;
};

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " path/to/exported-maze.txt\n";
        return 1;
    }
    try {
        Maze maze(argv[1]);
        const auto path = maze.shortestPath();
        if (path.empty()) { std::cout << "No route to the exit.\n"; return 2; }
        maze.printWithPath(path);
        // Each browser move crosses one connector tile and arrives in the next cell.
        std::cout << "Shortest route: " << (path.size() - 1) / 2 << " browser moves\n";
    } catch (const std::exception& error) {
        std::cerr << "Error: " << error.what() << '\n';
        return 1;
    }
}
