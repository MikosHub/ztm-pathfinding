import { useState } from "react";

const gridSize = 75;

function MazeGrid() {
  const [maze, setMaze] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [timeoutIds, setTimeoutIds] = useState([]);

  function pathFinding(startNode, isBFS) {
    let toCheck = [startNode];
    let visited = new Map();
    visited.set(`${startNode[0]},${startNode[1]}`, null);

    const drawPath = (end) => {
      const newMaze = maze.map((row) => row.slice());
      let x = end[0];
      let y = end[1];
      while (visited.get(`${x},${y}`)) {
        const next = visited.get(`${x},${y}`);
        const cell = newMaze[y][x];
        if (cell === "visited") newMaze[y][x] = "correct";

        x = next[0];
        y = next[1];
      }

      setMaze(newMaze);
    };

    const visitCell = ([x, y]) => {
      if (maze[y][x] === "end") {
        drawPath([x, y]);
        return true;
      }

      maze[y][x] = "visited";
      setMaze(maze);

      return false;
    };

    const step = () => {
      if (toCheck.length === 0) {
        return;
      }
      const [x, y] = isBFS ? toCheck.shift() : toCheck.pop();

      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        const key = `${nx},${ny}`;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(key)
        ) {
          visited.set(key, [x, y]);

          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) {
              return true;
            }
            toCheck.push([nx, ny]);
          }
        }
      }

      const timeout = setTimeout(step, 1);
      setTimeoutIds((previousIds) => [...previousIds, timeout]);
    };

    step();
    return false;
  }

  function generateMaze(height, width) {
    let matrix = [];

    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push("wall");
      }

      matrix.push(row);
    }

    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    const isCellValid = (x, y) => {
      return (
        y > 0 &&
        x > 0 &&
        x < width - 1 &&
        y < height - 1 &&
        matrix[y][x] === "wall"
      );
    };

    const carvePath = (x, y) => {
      matrix[y][x] = "path";

      const directions = dirs.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (!isCellValid(nx, ny)) continue;
        matrix[y + dy][x + dx] = "path";
        carvePath(nx, ny);
      }
    };

    carvePath(1, 1);

    matrix[1][0] = "start";
    matrix[height - 2][width - 1] = "end";

    setWidth(matrix[0].length);
    setHeight(matrix.length);
    setMaze(matrix);
  }

  function refreshMaze() {
    resetMaze();
    generateMaze(gridSize, gridSize);
  }

  function resetMaze() {
    timeoutIds.forEach(clearTimeout);
    setTimeoutIds([]);
    setMaze((prevMaze) => {
      prevMaze.map((row) => {
        return row.map((cell) => {
          return ["visited", "correct"].includes(cell) ? "path" : cell;
        });
      });
    });
  }

  return (
    <div className="maze-grid">
      <div className="controls">
        <button
          className="maze-button"
          onClick={() => refreshMaze()}
        >
          Refresh Maze
        </button>
        <button
          className="maze-button"
          onClick={() => pathFinding([0, 1], true)}
        >
          Breadth-First Search
        </button>
        <button
          className="maze-button"
          onClick={() => pathFinding([0, 1], false)}
        >
          Depth-First Search
        </button>
      </div>
      <div className={"maze"}>
        {maze.map((row, rowIdx) => (
          <div
            className="row"
            key={rowIdx}
          >
            {row.map((cell, cellIdx) => (
              <div
                className={`cell ${cell}`}
                key={cellIdx}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MazeGrid;
