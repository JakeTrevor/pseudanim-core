import { NodeFileSystem } from "langium/node";
import { Command } from "commander";
import { Module, Statement } from "../generated/ast.js";

import { StateFrame } from "../types/IR.js";
import { extractAstNode } from "./cli-util.js";
import { createPseudanimServices } from "../shared/module.js";

const program = new Command();

program
  .argument("<file>", "source file to run")
  .action(async (file) => {
    const services = createPseudanimServices(NodeFileSystem).Pseudanim;

    const module = await extractAstNode<Module>(file, services);

    module.statements.forEach((e) => console.log(e.$type));
  })
  .parse();

// function runLine(Statement: Statement, prevState: StateFrame): StateFrame {
//   return [];
// }

// export function generateJavaScript({ statements }: Module) {
//   statements.forEach((e, i) => console.log(`${i + 1}: ${e}`));
// }
