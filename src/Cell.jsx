import React, { useContext } from "react";
import Checker from "./Checker";
import { AppContext } from "./App";

const Cell = ({ name }) => {
  let { checkers } = useContext(AppContext);
  let checkersList = Object.keys(checkers);
  return (
    <li className="row-item">
      {checkersList.includes(name) && <Checker prop={checkers[name]} />}
    </li>
  );
};

export default Cell;