#!/bin/env node
import { Command } from "commander";
import { NodeFileSystem } from "langium/node";
import { green, red } from "kleur/colors";

import { moduleGenerator } from "~/generator/generator";
import type { Module } from "~/language/generated/ast";
import { createPseudanimServices } from "~/language/pseudanim-module";

import { extractAstNode, extractDocument, toJSON } from "./utils";
import { validateFile } from "./validateFile";
import { createServer } from "vite";
import { fileURLToPath } from "url";
import { join, resolve } from "path";
import { writeFile } from "fs/promises";

const program = new Command();

export const services = createPseudanimServices(NodeFileSystem).Pseudanim;

//* plan:
// 2 commands:
// dev - host the
// build - produce some kind of portable bundle

program
  .command("check")
  .argument("<file>", "source file to run", validateFile)
  .action(async (file) => {
    const document = await extractDocument(file, services);
    const parseResult = document.parseResult;
    if (
      parseResult.lexerErrors.length === 0 &&
      parseResult.parserErrors.length === 0
    ) {
      console.log(green(`Parsed and validated ${file} successfully!`));
    } else {
      console.log(red(`Failed to parse and validate ${file}!`));
    }
  });

program
  .command("generate")
  .argument("<file>", "source file to run", validateFile)
  .action(async (file) => {
    const module = await extractAstNode<Module>(file, services);
    const generator = moduleGenerator(module);
    const frames = [...generator];
    console.log(JSON.stringify(frames));
  });

program
  .command("dev")
  .argument("<file>", "source file to run", validateFile)
  .action(async (file) => {
    const ast = await toJSON(file, services);
    const dir = fileURLToPath(new URL("../src/app", import.meta.url));

    const outFile = join(dir, "./ast.json");

    await writeFile(outFile, ast);

    console.log(dir);
    const server = await createServer({
      configFile: false,
      root: dir,
      resolve: {
        alias: {
          "~": resolve(dir, "../"),
        },
      },
      server: {
        port: 3000,
      },
    });

    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  });

program.parse();
