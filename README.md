# minesweeper
Classic minesweeper game implementation

###Development instructions

Requirements:
- nodejs
- npm

To run the project:
- `npm install` To install dependencies
- `node app` To run the application

###Production instructions

Requirements:
- docker engine

To run the project:
- `docker build -t minesweeper .` To create the image
- `docker run --name minesweeper -e PORT=80 -p 80:80 -d minesweeper`
