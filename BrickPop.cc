#include <algorithm>
#include <cstdio>
#include <cstring>
#include <set>
#include <vector>
using namespace std;

const int GRID_ARRAY_SIZE = 12;
const int NUM_CANDIDATES = 1000;

const int DR[] = {-1, 0, 1, 0};
const int DC[] = {0, 1, 0, -1};
const char EMPTY = '.';

int GRID_SIZE, NUM_COLORS;

bool visited[GRID_ARRAY_SIZE][GRID_ARRAY_SIZE];

struct grid_state {
    char grid[GRID_ARRAY_SIZE][GRID_ARRAY_SIZE];
    int score;
    vector<pair<int, int> > pops;

    bool is_empty() const {
        for (int r = 1; r <= GRID_SIZE; r++) {
            for (int c = 1; c <= GRID_SIZE; c++) {
                if (grid[r][c] != EMPTY) {
                    return false;
                }
            }
        }

        return true;
    }

    long long hash() const {
        long long h = 0;

        for (int r = 1; r <= GRID_SIZE; r++) {
            for (int c = 1; c <= GRID_SIZE; c++) {
                h = h * 1000000007 + grid[r][c];
            }
        }

        return h;
    }

    void slide_down() {
        int fill_row = GRID_SIZE, fill_col = 1;

        for (int c = 1; c <= GRID_SIZE; c++) {
            for (int r = GRID_SIZE; r >= 1; r--) {
                if (grid[r][c] != EMPTY) {
                    grid[fill_row][fill_col] = grid[r][c];
                    fill_row--;
                }
            }

            if (fill_row < GRID_SIZE) {
                fill_col++;
            }
        }
    }

    int search_and_pop(int row, int col, char color) {
        visited[row][col] = true;
        grid[row][col] = EMPTY;

        int count = 1;

        for (int dir = 0; dir < 4; dir++) {
            int nrow = row + DR[dir];
            int ncol = col + DC[dir];

            if (!visited[nrow][ncol] && grid[nrow][ncol] == color) {
                count += search_and_pop(nrow, ncol, color);
            }
        }

        return count;
    }

    bool pop(int row, int col) {
        memset(visited, false, sizeof(visited));
        int popped = search_and_pop(row, col, grid[row][col]);

        if (popped <= 1) {
            return false;
        }

        score += popped * (popped - 1);
        slide_down();
        pops.push_back(make_pair(row, col));
        return true;
    }

    vector<grid_state> get_neighbors() const {
        vector<grid_state> neighbors;
        set<long long> hashes;

        for (int r = 1; r <= GRID_SIZE; r++) {
            for (int c = 1; c <= GRID_SIZE; c++) {
                if (grid[r][c] != EMPTY) {
                    grid_state neighbor = *this;

                    if (neighbor.pop(r, c)) {
                        if (hashes.insert(neighbor.hash()).second) {
                            neighbors.push_back(neighbor);
                        }
                    }
                }
            }
        }

        return neighbors;
    }

    double heuristic() const {
        return score;
    }

    bool operator<(const grid_state &other) const {
        return heuristic() > other.heuristic();
    }
};

int main() {
    scanf("%d %d", &GRID_SIZE, &NUM_COLORS);
    grid_state initial_state;
    initial_state.score = 0;
    memset(initial_state.grid, EMPTY, sizeof(initial_state.grid));

    for (int r = 1; r <= GRID_SIZE; r++) {
        scanf("%s", initial_state.grid[r] + 1);
    }

    grid_state winning_state;
    winning_state.grid[GRID_SIZE][1] = '0';
    winning_state.score = 0;

    vector<grid_state> candidates;
    candidates.push_back(initial_state);

    while (!candidates.empty()) {
        vector<grid_state> new_candidates;

        for (int i = 0; i < (int) candidates.size(); i++) {
            grid_state candidate = candidates[i];

            if (make_pair(candidate.is_empty(), candidate.score) >
                make_pair(winning_state.is_empty(), winning_state.score)) {
                winning_state = candidate;
            }

            vector<grid_state> neighbors = candidate.get_neighbors();
            new_candidates.insert(new_candidates.end(), neighbors.begin(), neighbors.end());
        }

        if ((int) new_candidates.size() > NUM_CANDIDATES) {
            nth_element(new_candidates.begin(),
                new_candidates.begin() + NUM_CANDIDATES,
                new_candidates.end());
            new_candidates.resize(NUM_CANDIDATES);
        }

        candidates = new_candidates;
    }

    printf("Score: %d\n", winning_state.score);
    puts("Moves:");

    for (int i = 0; i < (int) winning_state.pops.size(); i++) {
        printf("%d %d\n", winning_state.pops[i].first, winning_state.pops[i].second);
    }

    return 0;
}
