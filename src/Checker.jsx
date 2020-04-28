import React, { useContext } from "react";
import { AppContext } from "./App";

const Checker = ({ prop }) => {
  const { activeChecker, toggleActive } = useContext(AppContext);
  const isActive = prop.name === activeChecker ? "active" : "";
  return (
    <div
      onClick={() => toggleActive(prop)}
      className={`checker ${prop.color} ${isActive}`}
    ></div>
  );
};

export default Checker;