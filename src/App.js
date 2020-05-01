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

    for(let i = 0; i < res.length; i++){
      if(action === "turns" && !freeCells.includes(res[i])) continue;
      if(res[i].indexOf("undefined") < 0) result.push(res[i]);
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

  biteAgain = (field, player) => {
    let res = this.scanBoard(player);
    if (
      Object.keys(res.turns).length > 0 &&
      Object.keys(res.willBeBited).length > 0
    ) {
      this.setState({
        turns: res.turns,
        toBite: res.willBeBited,
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
      if (wasBited === 1) {
        this.setState(
          (prev) => ({
            ...prev.state,
            activeChecker: field.name,
            checkers: checkers,
            freeCells: freeCells,
          }),
          () => this.biteAgain(this.state.activeChecker, player)
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