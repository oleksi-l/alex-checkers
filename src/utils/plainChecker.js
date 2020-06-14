import { letters } from "./initial";

const getCoords = (checker, action = "turns", freeCells) => {
  let { x, y, to } = checker;
  y = y - 1;
  let res = [];
  if (action === "turns") {
    let add = to === "down" ? 1 : -1;
    res = [`${letters[y - 1]}${x + add}`, `${letters[y + 1]}${x + add}`];
  } else {
    res = [
      `${letters[y - 1]}${x + 1}`,
      `${letters[y + 1]}${x + 1}`,
      `${letters[y - 1]}${x - 1}`,
      `${letters[y + 1]}${x - 1}`,
    ];
  }

  let result = [];

  for (let i = 0; i < res.length; i++) {
    if (action === "turns" && !freeCells.includes(res[i])) continue;
    if (res[i].indexOf("undefined") < 0) result.push(res[i]);
  }

  return result;
};

const getBitedFields = (checker, checkers, freeCells) => {
  let curCoords = getCoords(checker, "bite", freeCells);
  let result = {};
  let turns = [];
  let bited = [];
  for (let i = 0; i < curCoords.length; i++) {
    if (checkers[curCoords[i]]) {
      if (checkers[curCoords[i]].color === checker.color) continue;
      else {
        let enemyY = checkers[curCoords[i]].y;
        let enemyX = checkers[curCoords[i]].x;
        let checkY = checker.y < enemyY ? enemyY + 1 : enemyY - 1;
        let checkX = checker.x < enemyX ? enemyX + 1 : enemyX - 1;
        let end = `${letters[checkY - 1]}${checkX}`;
        if (end.indexOf("undefined") > -1 || !freeCells.includes(end)) continue;
        turns.push(end);
        bited.push({ [end]: checkers[curCoords[i]].name });
      }
      result[checker.name] = bited;
    }
  }
  return { bited: result, turns: turns };
};

export { getCoords, getBitedFields };