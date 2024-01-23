import React from "react";
import ReactDOM from "react-dom/client";
import ast from "../ast.json";
import { moduleGenerator } from "../../generator/generator";
import { Animator } from "../../animator";

const generator = moduleGenerator(ast);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Animator generator={generator} />
  </React.StrictMode>
);
