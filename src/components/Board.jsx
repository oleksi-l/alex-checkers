import React from "react";
import Row from "./Row";
import { rows } from "../utils/initial";

const Board = () => (
  <div className="board">
    {rows.map((row, num) => {
      return <Row key={`row#${num + 1}`} cells={row} />;
    })}
  </div>
);

export default Board;
