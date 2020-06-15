import React from "react";
import "./css/App.css";
import Board from "./components/Board";
import { checkers, freeCells } from "./utils/initial";
import {
  filterPrevCoord,
  extractCoordsQueen,
  getTurnCoordsQueen,
  getDiagonal,
} from "./utils/queen";
import { getCoords, getBitedFields } from "./utils/plainChecker";

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

  checkWinner = (player) => {
    let { checkers, toBite, turns } = this.state;
    let playerCheckers = [];
    for (let name in checkers) {
      if (checkers[name].color === player) playerCheckers.push(name);
    }
    if (
      playerCheckers.length === 0 || Object.keys(turns).length === 0){
      return player;
      }
    else return false;
  };

  componentDidUpdate(prevProps, prevState) {
    let { player, activeChecker, checkers, toBite } = this.state;
    if (prevState.player !== player) {
      let fields = this.scanBoard(player);
      let flag = this.checkWinner(player);
      if (!flag) {
        this.setState({ turns: fields.turns, toBite: fields.willBeBited });
      } else {
        alert(`Player ${player.toUpperCase()}, you lose!!! (`);
      }
    } else {
      if (activeChecker && checkers[activeChecker].isQueen) {
        if (
          toBite[activeChecker] &&
          Object.keys(toBite[activeChecker]).length > 0
        ) {
          if (prevState.toBite !== toBite) {
            let coords = filterPrevCoord(
              prevState.toBite,
              toBite,
              activeChecker
            );
            if (coords.turns.length > 0) {
              this.setState({
                toBite: coords.bited,
                turns: { [activeChecker]: coords.turns },
              });
            } else {
              this.setState(
                (prev) => ({
                  player: player === "white" ? "black" : "white",
                  activeChecker: null,
                }),
                () => this.scanBoard(this.state.player)
              );
            }
          }
        }
      }
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
    let { checkers, freeCells, player } = this.state;
    for (let key in checkers) {
      if (checkers[key].color === color) {
        let bited = getBitedFields(checkers[key], checkers, freeCells);
        let coords = getCoords(checkers[key], "turns", freeCells);
        if (checkers[key].isQueen) {
          let tmp = getTurnCoordsQueen({
            coords: getDiagonal(checkers[key]),
            checker: checkers[key],
            freeCells: freeCells,
            checkers: checkers,
            player: player,
          });
          if (Object.keys(tmp.toBite).length > 0) {
            bited.turns = extractCoordsQueen(tmp.toBite);
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
      return { turns: require, willBeBited: willBeBited };
    return { turns: turns, willBeBited: willBeBited };
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

  biteAgain = (player, checkerName) => {
    let { turns, willBeBited } = this.scanBoard(player);
    if (
      Object.keys(turns).length > 0 &&
      Object.keys(willBeBited).includes(checkerName)
    ) {
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
        if (
          (checkers[field.name].to === "down" && field.x === 8) ||
          (checkers[field.name].to === "up" && field.x === 1)
        ) {
          checkers[field.name].isQueen = true;
          wasBited = 1;
        }
      }
      if (wasBited === 1) {
        this.setState(
          (prev) => ({
            ...prev.state,
            activeChecker: field.name,
            checkers: checkers,
            freeCells: freeCells,
          }),
          () => this.biteAgain(player, field.name)
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
