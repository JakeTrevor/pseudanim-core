import { Command } from "commander";
import { NodeFileSystem } from "langium/node";
import type {
  Access,
  Expression,
  Module,
  Operation,
} from "../generated/ast.js";
import { isExpression } from "../generated/ast.js";

import { createPseudanimServices } from "../shared/module.js";
import { extractAstNode } from "./cli-util.js";
import visitor from "../shared/visitor.js";

const program = new Command();

const vis = new visitor();

program
  .argument("<file>", "source file to run")
  .action(async (file) => {
    const services = createPseudanimServices(NodeFileSystem).Pseudanim;

    const module = await extractAstNode<Module>(file, services);

    const expressions = module.statements.filter((e) =>
      isExpression(e)
    ) as Expression[];

    expressions.forEach((e) => console.log(vis.Expression(e)));
  })
  .parse();

// function runLine(Statement: Statement, prevState: StateFrame): StateFrame {
//   return [];
// }

// export function generateJavaScript({ statements }: Module) {
//   statements.forEach((e, i) => console.log(`${i + 1}: ${e}`));
// }
