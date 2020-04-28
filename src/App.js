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
      currentPlayer: "white",
      possibleTurns: {},
      bitedFields: {},
    };
  }

  componentDidMount() {
    this.getTurns(this.state.checkers["a3"]);
  }

  toggleActive = ({ name, color }) => {
    if (this.state.currentPlayer === color) {
      this.setState({ activeChecker: name });
    }
  };

  getTurns = (checker) => {
    const { x, y, direction } = checker;
    let result =
      direction === "down"
        ? [`${letters[y - 1]}${x + 1}`, `${letters[y + 1]}${x + 1}`]
        : [`${letters[y - 1]}${x - 1}`, `${letters[y + 1]}${x - 1}`];
    result = result.filter((item) => item.indexOf("undefined") === -1);
    return result;
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          activeChecker: this.state.activeChecker,
          checkers: this.state.checkers,
          freeCells: this.state.freeCells,
          toggleActive: this.toggleActive,
        }}
      >
        <div className="App">
          <h3>{this.state.currentPlayer}</h3>
          <Board />
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;
