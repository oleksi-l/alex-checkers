import React, { useContext } from "react";
import Checker from "./Checker";
import { AppContext } from "./App";

const Cell = React.memo((props) => {
  let { checkers, turns, checkersName,moveChecker } = useContext(AppContext);
  let isActive =  turns.length > 0 && turns.includes(props.name) ? "active" : "";
  return (
    <li className={`row-item ${isActive}`} onClick={() => moveChecker(props,isActive)}>
      {checkersName.includes(props.name) && <Checker prop={checkers[props.name]} />}
    </li>
  );
});

export default Cell;
