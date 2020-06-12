import React from "react";
import "./App.css";
import Board from "./Board";
import { checkers, freeCells, letters, cells } from "./utils";

export const AppContext = React.createContext();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      activeChecker: null,
      freeCells: freeCells,
      checkers: checkers,
      player: "white",
      turns: {},
      toBite: {},
      diagonalCounter:0
    };
  }

  componentDidMount() {
    let fields = this.scanBoard(this.state.player);
    this.setState({ turns: fields.turns, toBite: fields.willBeBited });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.player !== this.state.player) {
      let fields = this.scanBoard(this.state.player);
      this.setState({ turns: fields.turns, toBite: fields.willBeBited, diagonalCounter: 0 });
    }
  }

  toggleActive = ({ name, color }) => {
    let { player, turns } = this.state;
    if (player === color && Object.keys(turns).includes(name)) {
      this.setState({ activeChecker: name });
    }
  };

  extractCoordsQueen = (arr) => {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      result = result.concat(Object.keys(arr[i]));
    }
    return result;
  };

  scanBoard = (color) => {
    let turns = {};
    let willBeBited = {};
    let require = {};
    let queenTo = {};
    let { checkers } = this.state;
    for (let key in checkers) {
      if (checkers[key].color === color) {
        let bited = this.getBitedFields(checkers[key]);
        let coords = this.getCoords(checkers[key], "turns");

        if (checkers[key].isQueen) {
          let tmp = this.getTurnCoordsQueen({
            coords: this.getDiagonal(checkers[key]),
            checker: checkers[key],
          });
          queenTo = Object.assign(queenTo,tmp.queenTo);
          if (Object.keys(tmp.toBite).length > 0) {
            bited.turns = this.extractCoordsQueen(tmp.toBite);
            bited.bited[key] = tmp.toBite;
          } else {
            bited.turns = tmp.turns;
          }
          coords = tmp.turns;
        }
        if (Object.keys(bited.bited).length > 0) {
          willBeBited = { ...willBeBited, ...bited.bited };
          require[key] = bited.turns;
          continue;
        }
        if (coords.length > 0) turns[key] = coords;
      }
    }
    if (Object.keys(require).length > 0)
      return { turns: require, willBeBited: willBeBited, queenTo:queenTo };
    return { turns: turns, willBeBited: willBeBited,queenTo:queenTo };
  };

  getCoords = (checker, action = "turns") => {
    let { x, y, to } = checker;
    let { freeCells } = this.state;
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

  getBitedFields = (checker) => {
    let curCoords = this.getCoords(checker, "bite");
    let { checkers, freeCells } = this.state;
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
          if (end.indexOf("undefined") > -1 || !freeCells.includes(end))
            continue;
          turns.push(end);
          bited.push({ [end]: checkers[curCoords[i]].name });
        }
        result[checker.name] = bited;
      }
    }
    return { bited: result, turns: turns };
  };

  replaceChecker = (field) => {
    let { activeChecker, checkers, freeCells, toBite } = this.state;
    let activeCheckerProps = {
      ...checkers[activeChecker],
      name: field.name,
      x: field.x,
      y: field.y,
    };
    let wasBited = 0;
    let toDelete = "";
    if (toBite[activeChecker]) {
      for (let i = 0; i < toBite[activeChecker].length; i++) {
        if (Object.keys(toBite[activeChecker][i]).includes(field.name)) {
          toDelete = toBite[activeChecker][i][field.name];
          break;
        }
      }
      delete checkers[toDelete];
      freeCells = freeCells.filter(
        (item) => item !== field.name && item !== toDelete
      );
      freeCells.push(toDelete);
      wasBited = 1;
    } else {
      freeCells = freeCells.filter((item) => item !== field.name);
    }
    delete checkers[activeChecker];
    checkers[field.name] = activeCheckerProps;
    freeCells.push(activeChecker);
    return { checkers: checkers, freeCells: freeCells, wasBited: wasBited };
  };


  biteAgain = (player,isQueen,checkerName=null) => {
    let { turns, willBeBited, queenTo } = this.scanBoard(player);
    if (Object.keys(turns).length > 0 && Object.keys(willBeBited).includes(checkerName)) {
      if(!isQueen){
        this.setState({
          turns: turns,
          toBite: willBeBited,
        });
      } else {
        if(this.state.diagonalCounter === 1){
          this.setState({
            player: player === "white" ? "black" : "white",
            activeChecker: null,
            diagonalCounter:0
          });
        } else {
          if(Object.keys(queenTo).length > 1){
            console.log(queenTo);
            this.setState({
              turns: turns,
              toBite: willBeBited,
              diagonalCounter:1
            });
          } else {
            this.setState({
              turns: turns,
              toBite: willBeBited,
              diagonalCounter:0
            });
          }
        }
      } 
    } else {
      this.setState({
        player: player === "white" ? "black" : "white",
        activeChecker: null,
      });
    }
  };

  moveChecker = (field, isActive) => {
    let { freeCells, player } = this.state;
    let isQueen = false;
    if (freeCells.includes(field.name) && isActive === "active") {
      let { checkers, freeCells, wasBited } = this.replaceChecker(field);
      if (!checkers[field.name].isQueen) {
        if (checkers[field.name].to === "down" && field.x === 8)
          checkers[field.name].isQueen = true;
        if (checkers[field.name].to === "up" && field.x === 1)
          checkers[field.name].isQueen = true;
      } else {
        isQueen = true;
      }
      if (wasBited === 1) {
        this.setState(
          (prev) => ({
            ...prev.state,
            activeChecker: field.name,
            checkers: checkers,
            freeCells: freeCells,
          }),
          () => this.biteAgain(player, isQueen,field.name)
        );
      } else {
        this.setState({
          checkers: checkers,
          freeCells: freeCells,
          activeChecker: null,
          player: player === "white" ? "black" : "white",
        });
      }
    }
  };

  buildDiagonal = (flag, obj) => {
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

  getLeftDiagonal = (checker) => {
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
    return this.buildDiagonal("left", obj);
  };

  getRightDiagonal = (checker) => {
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
    return this.buildDiagonal("right", obj);
  };

  getDiagonal = (checker) => {
    checker = { ...checker, x: checker.x - 1, y: checker.y - 1 };
    return {
      left: this.getLeftDiagonal(checker),
      right: this.getRightDiagonal(checker),
    };
  };

  getCFCheck = (coord, freeCells, checkers, player) => {
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

  hasPerspectiveToBite = (params) => {
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

      let newCoords = this.getDiagonal(checker);
      let bited = this.checkForQueen({
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

  checkForQueen = (params) => {
    let { checker, coords, freeCells, checkers, player, to } = params;
    let turns = [];
    let bited = {};
    const ch = coords.indexOf(checker.name);
    let before = coords.slice(0, ch);
    before = before.reverse();
    let after = coords.slice(ch + 1);
    let beforeCoords = this.getCFCheck(before, freeCells, checkers, player);
    let afterCoords = this.getCFCheck(after, freeCells, checkers, player);
    bited = Object.assign({}, beforeCoords.bited, afterCoords.bited);
    turns = [...new Set(turns.concat(beforeCoords.turns, afterCoords.turns))];
    return { turns: turns, bited: bited };
  };

  convertTo = (coords,to) => {
    let result = {};
    for(let key in coords){
      result[key] = to;
    }
    return result;
  }

  getTurnCoordsQueen = ({ coords, checker }) => {
    let { freeCells, checkers, player } = this.state;
    let turns = [];
    let toBite = {};
    let opposite = {};
    let queenTo = {};
    for (let key in coords) {
      let params = {
        checker: checker,
        coords: coords[key],
        freeCells: freeCells,
        checkers: checkers,
        player: player,
        to: key,
      };
      let tmp = this.checkForQueen(params);
      queenTo = Object.assign(queenTo,this.convertTo(tmp.bited,key));
      key = key === "left" ? "right" : "left";
      params = {
        ...params,
        coords: tmp.bited,
        to: key,
      };
      opposite = this.hasPerspectiveToBite(params);
      if (Object.keys(opposite).length > 0) {
        toBite = Object.assign(toBite, opposite);
        queenTo = Object.assign(queenTo,this.convertTo(opposite,key));
      }
      turns = turns.concat(tmp.turns);
      toBite = Object.assign(toBite, tmp.bited);
    }
    
    if (Object.keys(toBite).length > 0) {
      let res = [];
      for (let y in toBite) {
        res.push({ [y]: toBite[y] });
      }
      return { turns: [], toBite: res, queenTo:queenTo };
    } else return { turns: turns, toBite: [], queenTo: queenTo };
  };

  render() {
    const {
      activeChecker,
      checkers,
      freeCells,
      turns,
      player,
      toBite,
    } = this.state;
    return (
      <AppContext.Provider
        value={{
          activeChecker: activeChecker,
          checkers: checkers,
          checkersName: Object.keys(checkers),
          freeCells: freeCells,
          turns: activeChecker ? turns[activeChecker] : [],
          toBite: toBite,
          toggleActive: this.toggleActive,
          moveChecker: this.moveChecker,
        }}
      >
        <div className="App">
          <h3>{player}</h3>
          <Board />
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;