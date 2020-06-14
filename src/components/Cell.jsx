import React, { useContext } from "react";
import Checker from "./Checker";
import { AppContext } from "../App";

const checkIsActive = (turns, freeCells, name) => {
  if (!turns || turns.length === 0) return "";
  let isActive =
    turns.includes(name) && freeCells.includes(name) ? "active" : "";
  return isActive;
};

const Cell = React.memo((props) => {
  let { checkers, turns, checkersName, moveChecker, freeCells } = useContext(
    AppContext
  );
  let isActive = checkIsActive(turns, freeCells, props.name);
  return (
    <li
      className={`row-item ${isActive}`}
      onClick={() => moveChecker(props, isActive)}
    >
      {checkersName.includes(props.name) && (
        <Checker prop={checkers[props.name]} />
      )}
    </li>
  );
});

export default Cell;
