const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

const makeRows = () => {
  let row = new Array(8).fill(0, 0, 8);
  let result = row.map((item, y) => {
    return row.map((cell, x) => {
      return {
        name: `${letters[x]}${y + 1}`,
        x: y + 1,
        y: x + 1,
      };
    });
  });
  return result;
};

let rows = makeRows();

const getCellsCoords = (rows) => {
  rows = rows.flat();
  let result = {};
  for (let i = 0; i < rows.length; i++) {
    result[rows[i].name] = { x: rows[i].x, y: rows[i].y };
  }
  return result;
};

let cells = getCellsCoords(rows);

const filterCheckers = (row, num) => {
  let result = {};
  row.filter((item, i) => {
    if (num % 2 === 0) {
      if (i % 2 === 0) result[item.name] = item;
    } else {
      if (i % 2 !== 0) result[item.name] = item;
    }
  });
  return result;
};

const makeCheckers = () => {
  let result = {};
  for (let i = 0; i < rows.length; i++) {
    if (i <= 2 || i >= 5) {
      result = Object.assign(result, filterCheckers(rows[i], i));
    }
  }
  for (let checker in result) {
    result[checker].color = result[checker].x <= 3 ? "white" : "black";
    result[checker].to = result[checker].x <= 3 ? "down" : "up";
    result[checker].isQueen = false;
  }
  return result;
};

const checkers = makeCheckers();

const freeCells = ["b4", "d4", "f4", "h4", "a5", "c5", "e5", "g5"];

export { letters, rows, checkers, freeCells, cells };