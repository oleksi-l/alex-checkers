import React from "react";
import "./App.css";
import Board from "./Board";
import {checkers} from './utils';

const AppContext = React.createContext();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      activeChecker: null,
      freeCells: [],
      checkers: checkers,
      currentPlayer: "white",
    };
  }
  render() {
    return (
      <AppContext.Provider>
        <div className="App">
          <h3>{this.state.currentPlayer}</h3>
          <Board />
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;
