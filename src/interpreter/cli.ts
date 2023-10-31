import { Command } from "commander";
import { NodeFileSystem } from "langium/node";
import type { Module } from "../generated/ast.js";

import { createPseudanimServices } from "../shared/module.js";
import visitor from "../shared/visitor.js";
import { extractAstNode } from "./cli-util.js";

const program = new Command();

const vis = new visitor();

program
  .argument("<file>", "source file to run")
  .action(async (file) => {
    const services = createPseudanimServices(NodeFileSystem).Pseudanim;

    const module = await extractAstNode<Module>(file, services);

    module.statements
      .flatMap((e) => vis.Statement(e))
      .forEach((e) => console.log(e));
  })
  .parse();

// function runLine(Statement: Statement, prevState: StateFrame): StateFrame {
//   return [];
// }

// export function generateJavaScript({ statements }: Module) {
//   statements.forEach((e, i) => console.log(`${i + 1}: ${e}`));
// }
