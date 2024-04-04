import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MazeGrid from "./MazeGrid";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MazeGrid />
  </React.StrictMode>
);
