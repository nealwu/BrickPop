#include <cstdio>
#include <cstdlib>
#include <ctime>

int main(int argc, char **argv) {
    int _seed; srand(time(NULL) * (long long) &_seed);

    if (argc < 3) {
        puts("Need two arguments: board size and number of colors");
        return 1;
    }

    int grid_size = atoi(argv[1]);
    int num_colors = atoi(argv[2]);

    char **grid = new char*[grid_size];

    for (int i = 0; i < grid_size; i++) {
        grid[i] = new char[grid_size + 1];
    }

    for (int i = 0; i < grid_size; i++) {
        for (int j = 0; j < grid_size; j++) {
            grid[i][j] = '0' + rand() % num_colors;
        }
    }

    printf("%d %d\n", grid_size, num_colors);

    for (int i = 0; i < grid_size; i++) {
        puts(grid[i]);
    }

    for (int i = 0; i < grid_size; i++) {
        delete[] grid[i];
    }

    delete[] grid;
    return 0;
}
