import { letters, cells } from "./initial";

const filterPrevCoord = (prev, current, activeChecker) => {
  let previous = [];
  let turns = [];
  for (let key in prev) {
    for (let i = 0; i < prev[key].length; i++) {
      previous = previous.concat(Object.keys(prev[key][i]));
    }
  }
  if (current[activeChecker]) {
    current[activeChecker] = current[activeChecker].filter((item) => {
      let coord = Object.keys(item).join("");
      if (!previous.includes(coord)) {
        turns.push(coord);
        return item;
      }
    });
  }

  return { bited: current, turns: turns };
};

const extractCoordsQueen = (arr) => {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result = result.concat(Object.keys(arr[i]));
  }
  return result;
};

const getTurnCoordsQueen = (params) => {
  let { freeCells, checkers, player, coords, checker } = params;
  let turns = [];
  let toBite = {};
  let opposite = {};
  for (let key in coords) {
    let params = {
      checker: checker,
      coords: coords[key],
      freeCells: freeCells,
      checkers: checkers,
      player: player,
      to: key,
    };
    let tmp = checkForQueen(params);
    key = key === "left" ? "right" : "left";
    params = {
      ...params,
      coords: tmp.bited,
      to: key,
    };
    opposite = hasPerspectiveToBite(params);
    if (Object.keys(opposite).length > 0) {
      toBite = Object.assign(toBite, opposite);
    }
    turns = turns.concat(tmp.turns);
    toBite = Object.assign(toBite, tmp.bited);
  }

  if (Object.keys(toBite).length > 0) {
    let res = [];
    for (let y in toBite) {
      res.push({ [y]: toBite[y] });
    }
    return { turns: [], toBite: res };
  } else return { turns: turns, toBite: [] };
};

const getDiagonal = (checker) => {
  checker = { ...checker, x: checker.x - 1, y: checker.y - 1 };
  return {
    left: getLeftDiagonal(checker),
    right: getRightDiagonal(checker),
  };
};

const buildDiagonal = (flag, obj) => {
  let { beginX, beginY, endY, checker } = obj;
  let before = [];
  let after = [];
  beginX = beginX + 1;
  for (let i = beginY; i <= endY; i++) {
    if (beginX === 0 && flag === "right") break;
    let xNum = flag === "right" ? beginX-- : beginX++;
    if (xNum > 8) break;
    let name = `${letters[i]}${xNum}`;
    checker.x + 1 > xNum ? after.push(name) : before.push(name);
  }
  let tmp = before.concat(after);
  tmp = tmp.filter((item) => item.indexOf("undefined") < 0);
  return tmp.sort();
};

const getLeftDiagonal = (checker) => {
  let { x, y } = checker;
  let beginX = 0;
  let beginY = 0;
  let endX = 0;
  let endY = 0;
  if (x === y) {
    endX = 7;
    endY = 7;
  }
  if (x < y) {
    beginY = x === 0 ? y : y - x;
    beginX = x === 0 ? 0 : x - x;
    endY = 7;
    endX = 7 - beginY;
  }
  if (x > y) {
    beginX = x - y;
    beginY = y - y;
    endY = 7 - beginX;
    endX = beginY === 0 || x === 7 ? 7 : 7 - beginY;
  }
  let obj = {
    beginY: beginY,
    beginX: beginX,
    endY: endY,
    endx: endX,
    checker: checker,
  };
  return buildDiagonal("left", obj);
};

const getRightDiagonal = (checker) => {
  let { x, y } = checker;
  let beginX = 0;
  let beginY = 0;
  let endX = 0;
  let endY = 0;
  if (x === y) {
    if (y === 0 || y === 7) beginY = y;
    beginY = y > 0 && y <= 3 ? y - y : y - (7 - x);
    beginY = beginY < 0 ? 0 : beginY;
    beginX = x === 0 ? 0 : x + x;
    beginX = beginX > 7 ? 7 : beginX;
  }

  if (x < y) {
    if (x === 0) beginY = 0;
    else {
      beginY = y < 4 ? y - y : y - (7 - x);
    }
    beginX = y === 7 ? 7 : x + y;
  }

  if (x > y) {
    if (x === 7) beginY = y;
    else {
      beginY = y === 0 ? 0 : y - (7 - x);
    }
    beginX = x + y;
  }

  beginX = beginX > 7 ? 7 : beginX;
  beginY = beginY < 0 ? 0 : beginY;
  endY = beginX;
  endX = beginY;

  let obj = {
    beginY: beginY,
    beginX: beginX,
    endY: endY,
    endx: endX,
    checker: checker,
  };
  return buildDiagonal("right", obj);
};

const getCFCheck = (coord, freeCells, checkers, player) => {
  let counter = 0;
  let turns = [];
  let bited = {};
  for (let i = 0; i < coord.length; i++) {
    if (freeCells.includes(coord[i])) {
      if (counter > 1) break;
      turns.push(coord[i]);
      if (Object.keys(bited).includes(coord[i - 1])) {
        bited[coord[i]] = bited[coord[i - 1]];
      }
    } else {
      if (checkers[coord[i]]) {
        if (checkers[coord[i]].color !== player) {
          counter++;
          if (counter > 1) break;
          if (coord[i + 1] && checkers[coord[i + 1]]) {
            if (checkers[coord[i + 1]].color === player) break;
          }
          if (coord[i + 1] && freeCells.includes(coord[i + 1])) {
            if (+coord[i][1] === 8 || +coord[i][1] === 1) break;
            if (coord[i][0] === "a" || coord[i][0] === "h") break;
            bited[coord[i + 1]] = coord[i];
          }
        } else break;
      }
    }
  }

  return { bited: bited, turns: turns };
};

const hasPerspectiveToBite = (params) => {
  let { coords, freeCells, checkers, player, to } = params;
  let coords1 = Object.keys(coords);
  let res = {};
  for (let i = 0; i < coords1.length; i++) {
    let checker = {
      name: coords1[i],
      x: cells[coords1[i]].x,
      y: cells[coords1[i]].y,
      color: player,
    };

    let newCoords = getDiagonal(checker);
    let bited = checkForQueen({
      checker: checker,
      coords: newCoords[to],
      freeCells: freeCells,
      checkers: checkers,
      player: player,
    });

    if (Object.keys(bited.bited).length > 0) {
      res[checker.name] = Object.keys(bited.bited);
    }
  }
  return res;
};

const checkForQueen = (params) => {
  let { checker, coords, freeCells, checkers, player } = params;
  let turns = [];
  let bited = {};
  const ch = coords.indexOf(checker.name);
  let before = coords.slice(0, ch);
  before = before.reverse();
  let after = coords.slice(ch + 1);
  let beforeCoords = getCFCheck(before, freeCells, checkers, player);
  let afterCoords = getCFCheck(after, freeCells, checkers, player);
  bited = Object.assign({}, beforeCoords.bited, afterCoords.bited);
  turns = [...new Set(turns.concat(beforeCoords.turns, afterCoords.turns))];
  return { turns: turns, bited: bited };
};

export {
  filterPrevCoord,
  extractCoordsQueen,
  getTurnCoordsQueen,
  getDiagonal,
  buildDiagonal,
  getLeftDiagonal,
};