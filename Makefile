all: BrickPop GenerateGrid

BrickPop: BrickPop.cc
	g++ -Wno-unused-result -O2 -o BrickPop BrickPop.cc

GenerateGrid: GenerateGrid.cc
	g++ -O2 -o GenerateGrid GenerateGrid.cc

clean:
	rm BrickPop GenerateGrid
