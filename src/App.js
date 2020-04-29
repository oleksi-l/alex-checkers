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
      bitedFields: {},
    };
  }

  componentDidMount() {
    this.setState({ turns: this.scanBoard(this.state.player) });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.player !== this.state.player) {
      this.setState({ turns: this.scanBoard(this.state.player) });
    }
  }

  toggleActive = ({ name, color }) => {
    let {player,turns} = this.state;
    if (player === color && Object.keys(turns).includes(name)) {
      this.setState({ activeChecker: name });
    }
  };

  scanBoard = (color) => {
    let turns = {};
    for (let key in this.state.checkers) {
      if (this.state.checkers[key].color === color) {
        let coords = this.getCoords(this.state.checkers[key], "turns");
        if (coords.length > 0) turns[key] = coords;
      }
    }
    return turns;
  };

  getCoords = (checker, action = "turns") => {
    let { x, y, to } = checker;
    y = y - 1;
    let result = [];
    let turns = [];
    if (action === "turns") {
      turns =
        to === "down"
          ? [`${letters[y - 1]}${x + 1}`, `${letters[y + 1]}${x + 1}`]
          : [`${letters[y - 1]}${x - 1}`, `${letters[y + 1]}${x - 1}`];
    } else {
      turns = [
        `${letters[y - 1]}${x + 1}`,
        `${letters[y + 1]}${x + 1}`,
        `${letters[y - 1]}${x - 1}`,
        `${letters[y + 1]}${x - 1}`,
      ];
    }
    for (let i = 0; i < turns.length; i++) {
      if (
        turns[i].indexOf("undefined") < 0 &&
        this.state.freeCells.includes(turns[i])
      ) {
        result.push(turns[i]);
      }
    }
    return result;
  };

  moveChecker = (field, isActive) => {
    let { freeCells, activeChecker, checkers, player } = this.state;
    if (freeCells.includes(field.name) && isActive === "active") {
      let activeCheckerProps = {
        ...checkers[activeChecker],
        name: field.name,
        x: field.x,
        y: field.y,
      };
      delete checkers[activeChecker];
      checkers[field.name] = activeCheckerProps;
      freeCells = freeCells.filter((item) => item !== field.name);
      freeCells.push(activeChecker);
      this.setState({
        checkers: checkers,
        freeCells: freeCells,
        activeChecker: null,
        player: player === "white" ? "black" : "white",
      });
    }
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          activeChecker: this.state.activeChecker,
          checkers: this.state.checkers,
          checkersName: Object.keys(this.state.checkers),
          freeCells: this.state.freeCells,
          turns: this.state.activeChecker
            ? this.state.turns[this.state.activeChecker]
            : [],
          toggleActive: this.toggleActive,
          moveChecker: this.moveChecker,
        }}
      >
        <div className="App">
          <h3>{this.state.player}</h3>
          <Board />
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;