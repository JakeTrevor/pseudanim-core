import { Command } from "commander";
import { NodeFileSystem } from "langium/node";
import type { Module } from "../generated/ast.js";

import { createPseudanimServices } from "../shared/module.js";
import visitor from "../shared/evaluatorVisitor.js";
import { extractAstNode } from "./cli-util.js";
import { moduleGenerator } from "../shared/visitor.js";

const program = new Command();

const vis = new visitor();

program
  .argument("<file>", "source file to run")
  .action(async (file) => {
    const services = createPseudanimServices(NodeFileSystem).Pseudanim;

    const module = await extractAstNode<Module>(file, services);

    const generator = moduleGenerator(module);

    const frames = [...generator];
    console.log(JSON.stringify(frames));
  })
  .parse();
