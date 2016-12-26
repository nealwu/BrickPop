#include <cstdio>
#include <cstdlib>
#include <ctime>

int main(int argc, char **argv) {
    int _seed; srand(time(NULL) * (long long) &_seed);

    if (argc < 3) {
        fprintf(stderr, "Need two arguments: grid size and number of colors\n");
        return 1;
    }

    int grid_size = atoi(argv[1]);
    int num_colors = atoi(argv[2]);

    if (grid_size > 20) {
        fprintf(stderr, "Grid size is not allowed to exceed 20\n");
        return 1;
    }

    if (num_colors > 10) {
        fprintf(stderr, "Number of colors is not allowed to exceed 10\n");
        return 1;
    }

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
