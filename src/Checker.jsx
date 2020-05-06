import React, { useContext } from "react";
import { AppContext } from "./App";
import queen from "./queen.svg";

const Checker = ({ prop }) => {
  const { activeChecker, toggleActive } = useContext(AppContext);
  const isActive = prop.name === activeChecker ? "active" : "";
  return (
    <div
      onClick={() => toggleActive(prop)}
      className={`checker ${prop.color} ${isActive}`}
    >
      {prop.isQueen && <img className="checker-icon" src={queen} alt="queen" />}
    </div>
  );
};

export default Checker;
