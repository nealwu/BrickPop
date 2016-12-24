#include <cstdio>
#include <cstring>
#include <vector>
using namespace std;

const int GRID_ARRAY_SIZE = 12;

int GRID_SIZE, NUM_COLORS;

struct grid_state {
    char grid[GRID_ARRAY_SIZE][GRID_ARRAY_SIZE];
    int score;
    vector<pair<int, int> > pops;

    long long hash() const {
        long long h = 0;

        for (int i = 1; i <= GRID_SIZE; i++) {
            for (int j = 1; j <= GRID_SIZE; j++) {
                h = h * 1000000007 + grid[i][j];
            }
        }

        return h;
    }
};

int main() {
    scanf("%d %d", &GRID_SIZE, &NUM_COLORS);
    grid_state initial_state;
    initial_state.score = 0;
    memset(initial_state.grid, '.', sizeof(initial_state.grid));

    for (int i = 1; i <= GRID_SIZE; i++) {
        scanf("%s", initial_state.grid[i] + 1);
    }

    return 0;
}
