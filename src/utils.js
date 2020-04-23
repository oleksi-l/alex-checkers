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

const filterCheckers = (row, num) => {
  let result = row.filter((item, i) => {
    if (num % 2 === 0) {
      if (i % 2 === 0) return item;
    } else {
      if (i % 2 !== 0) return item;
    }
  });
  return result;
};

const makeCheckers = () => {
  let checkersArr = [];
  for (let i = 0; i < rows.length; i++) {
    if (i <= 2 || i >= 5) {
      checkersArr[i] = filterCheckers(rows[i], i);
    }
  }
  let result = checkersArr.filter((item, i) => {
    if (i <= 2 || i >= 5) {
      item.color = i <= 2 ? "white" : "black";
      item.direction = i <= 2 ? "down" : "up";
      item.isQueen = false;
      return item;
    }
  });
  return result.flat();
};

const checkers = makeCheckers();

export { letters, rows, checkers };
