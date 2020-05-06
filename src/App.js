import React from "react";
import "./App.css";
import Board from "./Board";
import { checkers, freeCells, letters } from "./utils";

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
    };
  }

  componentDidMount() {
    let fields = this.scanBoard(this.state.player);
    this.setState({ turns: fields.turns, toBite: fields.willBeBited });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.player !== this.state.player) {
      let fields = this.scanBoard(this.state.player);
      this.setState({ turns: fields.turns, toBite: fields.willBeBited });
    }
  }

  toggleActive = ({ name, color }) => {
    let { player, turns } = this.state;
    if (player === color && Object.keys(turns).includes(name)) {
      this.setState({ activeChecker: name });
    }
  };

  scanBoard = (color) => {
    let turns = {};
    let willBeBited = {};
    let require = {};
    let { checkers } = this.state;
    for (let key in checkers) {
      if (checkers[key].color === color) {
        let bited = this.getBitedFields(checkers[key]);
        let coords = this.getCoords(checkers[key], "turns");
        if (!checkers[key].isQueen) {
          console.log(key);
          this.getDiagonal(checkers[key]);
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
      return { turns: require, willBeBited: willBeBited };
    return { turns: turns, willBeBited: willBeBited };
  };

  getCoords = (checker, action = "turns") => {
    let { x, y, to } = checker;
    let { freeCells } = this.state;
    y = y - 1;
    let res = [];
    if (action === "turns") {
      res =
        to === "down"
          ? [`${letters[y - 1]}${x + 1}`, `${letters[y + 1]}${x + 1}`]
          : [`${letters[y - 1]}${x - 1}`, `${letters[y + 1]}${x - 1}`];
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
    for (let i = 0; i < curCoords.length; i++) {
      let wrap = {};
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
          wrap[end] = checkers[curCoords[i]].name;
          turns.push(end);
        }
        result[checker.name] = wrap;
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
    if (toBite[activeChecker]) {
      delete checkers[toBite[activeChecker][field.name]];
      freeCells = freeCells.filter(
        (item) =>
          item !== field.name && item !== toBite[activeChecker][field.name]
      );
      freeCells.push(toBite[activeChecker][field.name]);
      wasBited = 1;
    } else {
      freeCells = freeCells.filter((item) => item !== field.name);
    }
    delete checkers[activeChecker];
    checkers[field.name] = activeCheckerProps;
    freeCells.push(activeChecker);
    return { checkers: checkers, freeCells: freeCells, wasBited: wasBited };
  };

  biteAgain = (player) => {
    let { turns, willBeBited } = this.scanBoard(player);
    if (Object.keys(turns).length > 0 && Object.keys(willBeBited).length > 0) {
      this.setState({
        turns: turns,
        toBite: willBeBited,
      });
    } else {
      this.setState({
        player: player === "white" ? "black" : "white",
        activeChecker: null,
      });
    }
  };

  moveChecker = (field, isActive) => {
    let { freeCells, player } = this.state;
    if (freeCells.includes(field.name) && isActive === "active") {
      let { checkers, freeCells, wasBited } = this.replaceChecker(field);
      if (!checkers[field.name].isQueen) {
        if (checkers[field.name].to === "down" && field.x === 8)
          checkers[field.name].isQueen = true;
        if (checkers[field.name].to === "up" && field.x === 1)
          checkers[field.name].isQueen = true;
      }
      if (wasBited === 1) {
        this.setState(
          (prev) => ({
            ...prev.state,
            activeChecker: field.name,
            checkers: checkers,
            freeCells: freeCells,
          }),
          () => this.biteAgain(player)
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

  getLeftDiagonal = (color, x, y) => {
    let beginX = 0;
    let beginY = 0;
    let endX = 0;
    let endY = 0;
    let result = {};
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
      beginX = x === 7 ? 7 : x - y;
      beginY = y - y;
      endY = x === 7 ? y - 1 : 7 - beginX;
      endX = beginY === 0 || x === 7 ? 7 : 7 - beginY;
    }
    console.log({ beginY: beginY, beginX: beginX, endY: endY, endx: endX });
    return { beginY: beginY, beginX: beginX, endY: endY, endx: endX };
  };

  getRightDiagonal = (color, x, y) => {
    let beginX = 0;
    let beginY = 0;
    let endX = 0;
    let endY = 0;
    if (x === y) {
      if(y === 0 || y === 7) beginY = y;
      beginY = y > 0 && y <= 3 ? (y - y) : y - (7 - x);
      beginY = beginY < 0 ? 0 : beginY
      beginX = x === 0 ? 0 : (x + x);
      beginX = beginX > 7 ? 7 : beginX;
    }

    if (x < y) {
      if (x === 0) beginY = 0;
      else {
        beginY = y < 4 ? y - y : y - (7 - x);
        beginY = beginY < 0 ? 7 : beginY;
      }
      beginX = y === 7 ? 7 : x + y;
      beginX = beginX > 7 ? 7 : beginX;
    }

    if (x > y) {
      beginY = y === 0 ? 0 : y - (7 - x);
      if (x === 7) beginY = y;
      else {
        beginY = y < 0 ? 0 : beginY;
      }
      beginX = x + y;
      beginX = beginX > 7 ? 7 : beginX;
    }

    endY = beginX;
    endX = beginY;

    //  console.log({ beginY: beginY, beginX: beginX, endY: endY, endx: endX });
    return { beginY: beginY, beginX: beginX, endY: endY, endx: endX };
  };

  getDiagonal = ({ color, x, y }) => {
    x = x - 1;
    y = y - 1;
    this.getRightDiagonal(color, x, y);
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
