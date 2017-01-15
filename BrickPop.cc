#include <algorithm>
#include <cassert>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <map>
#include <vector>
using namespace std;

const int GRID_ARRAY_SIZE = 12;
const int NUM_CANDIDATES = 5000;
const int INF = 1000000005;

const int DR[] = {-1, 0, 1, 0};
const int DC[] = {0, 1, 0, -1};
const char EMPTY = '.';

int GRID_SIZE, NUM_COLORS;

int visited_id = 0;
int visited[GRID_ARRAY_SIZE][GRID_ARRAY_SIZE];
map<long long, int> hashes;

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

    void print() const {
        fputc('\n', stderr);

        for (int r = 1; r <= GRID_SIZE; r++) {
            for (int c = 1; c <= GRID_SIZE; c++) {
                fputc(grid[r][c], stderr);
            }

            fputc('\n', stderr);
        }

        fputc('\n', stderr);
    }

    void slide_down() {
        int fill_row;
        int fill_col = 1;

        for (int c = 1; c <= GRID_SIZE; c++) {
            fill_row = GRID_SIZE;

            for (int r = GRID_SIZE; r >= 1; r--) {
                if (grid[r][c] != EMPTY) {
                    grid[fill_row][fill_col] = grid[r][c];

                    if (r != fill_row || c != fill_col) {
                        grid[r][c] = EMPTY;
                    }

                    fill_row--;
                }
            }

            if (fill_row < GRID_SIZE) {
                fill_col++;
            }
        }
    }

    int search_and_pop(int row, int col, char color, bool write_grid) {
        visited[row][col] = visited_id;

        if (write_grid) {
            grid[row][col] = EMPTY;
        }

        int count = 1;

        for (int dir = 0; dir < 4; dir++) {
            int nrow = row + DR[dir];
            int ncol = col + DC[dir];

            if (visited[nrow][ncol] != visited_id && grid[nrow][ncol] == color) {
                count += search_and_pop(nrow, ncol, color, write_grid);
            }
        }

        return count;
    }

    bool pop(int row, int col) {
        visited_id++;
        int popped = search_and_pop(row, col, grid[row][col], true);

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

        for (int r = 1; r <= GRID_SIZE; r++) {
            for (int c = 1; c <= GRID_SIZE; c++) {
                if (grid[r][c] != EMPTY) {
                    grid_state neighbor = *this;

                    if (neighbor.pop(r, c)) {
                        long long h = neighbor.hash();

                        if (neighbor.score > hashes[h]) {
                            hashes[h] = neighbor.score;
                            neighbors.push_back(neighbor);
                        }
                    }
                }
            }
        }

        return neighbors;
    }

    int estimated_score_to_finish() {
        visited_id++;
        int total = 0;

        for (int r = 1; r <= GRID_SIZE; r++) {
            for (int c = 1; c <= GRID_SIZE; c++) {
                if (grid[r][c] != EMPTY && visited[r][c] != visited_id) {
                    int popped = search_and_pop(r, c, grid[r][c], false);
                    total += popped * (popped - 1);
                }
            }
        }

        return total;
    }

    double heuristic() {
        int singletons = 0;

        for (int r = 1; r <= GRID_SIZE; r++) {
            for (int c = 1; c <= GRID_SIZE; c++) {
                if (grid[r][c] != EMPTY) {
                    int neighbor_count = 0;

                    for (int dir = 0; dir < 4; dir++) {
                        int nr = r + DR[dir];
                        int nc = c + DC[dir];

                        if (grid[nr][nc] == grid[r][c]) {
                            neighbor_count++;
                        }
                    }

                    if (neighbor_count == 0) {
                        singletons++;
                    }
                }
            }
        }

        int estimated_score = score + estimated_score_to_finish();
        return -10000.0 * singletons + estimated_score;
    }

    bool operator<(grid_state &other) {
        return heuristic() > other.heuristic();
    }

    pair<bool, int> winner_metric() {
        return make_pair(is_empty(), score);
    }
};

int main() {
    int _seed; srand(time(NULL) * (long long) &_seed);
    assert(scanf("%d %d", &GRID_SIZE, &NUM_COLORS) == 2);
    grid_state initial_state;
    initial_state.score = 0;
    memset(initial_state.grid, EMPTY, sizeof(initial_state.grid));

    for (int r = 1; r <= GRID_SIZE; r++) {
        assert(scanf("%s", initial_state.grid[r] + 1) == 1);
    }

    grid_state winning_state;
    winning_state.grid[GRID_SIZE][1] = '0';
    winning_state.score = INF;

    vector<grid_state> candidates;
    candidates.push_back(initial_state);

    while (!candidates.empty()) {
        fprintf(stderr, "%d candidates\n", (int) candidates.size());
        vector<grid_state> new_candidates;

        for (int i = 0; i < (int) candidates.size(); i++) {
            grid_state candidate = candidates[i];

            if (candidate.score < hashes[candidate.hash()]) {
                continue;
            }

            if (candidate.winner_metric() > winning_state.winner_metric()) {
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

    fprintf(stderr, "Succeeds: %d\n", winning_state.is_empty());
    fprintf(stderr, "Score: %d\n", winning_state.score);
    fprintf(stderr, "Moves: %d\n", (int) winning_state.pops.size());

    for (int i = 0; i < (int) winning_state.pops.size(); i++) {
        printf("%d %d\n", winning_state.pops[i].first, winning_state.pops[i].second);
    }

    return 0;
}
