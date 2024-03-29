import {
  Assignment,
  isAssignment,
  isExpression,
  isFor,
  isIf,
  isWhile,
  type For,
  type If,
  type Module,
  type Statement,
  type While,
} from "~/language/generated/ast";
import { type StateFrame } from "~/types/IR";
import { Context, type ContextPath } from "./context";
import { expression } from "./evaluator";

export type FrameGenerator = Generator<StateFrame, void, void>;

export function* moduleGenerator(m: Module): FrameGenerator {
  const context = new Context();

  yield* BlockGenerator(m.statements, context);
}

function* AssignmentGenerator(a: Assignment, context: Context): FrameGenerator {
  const path =
    a.path?.path.map((e) => {
      if (isExpression(e)) return expression(e, context);
      return e;
    }) ?? [];
  path.unshift(a.name);

  const value = expression(a.val, context);

  context.set([...path] as ContextPath, value);

  let association = undefined;

  if (a.from) {
    const fromPath =
      a.from.path?.path.map((e) => {
        if (isExpression(e)) return expression(e, context);
        return e;
      }) ?? [];
    fromPath.unshift(a.from.name);

    association = {
      from: fromPath as ContextPath,
      to: path as ContextPath,
    };
  }

  yield context.makeFrame(association);
}

function* ForGenerator(f: For, parentContext: Context): FrameGenerator {
  const context = new Context(parentContext);
  const arr = expression(f.arr, context) as string[] | number[] | boolean[];

  for (const elem of arr) {
    context.set([f.var], elem);
    yield context.makeFrame();

    yield* BlockGenerator(f.statements, context);
  }
}

function* IfGenerator(ifStatement: If, parentContext: Context): FrameGenerator {
  const context = new Context(parentContext);
  const cond = expression(ifStatement.condition, context) as boolean;
  if (cond) {
    yield* BlockGenerator(ifStatement.statements, context);
  }
}

function* WhileGenerator(
  whileStatement: While,
  parentContext: Context
): FrameGenerator {
  const context = new Context(parentContext);

  let cond = expression(whileStatement.condition, context);

  while (cond) {
    yield* BlockGenerator(whileStatement.statements, context);
    cond = expression(whileStatement.condition, context);
  }
}

function* BlockGenerator(block: Statement[], context: Context): FrameGenerator {
  for (const statement of block) {
    // one of:
    // VariableAssignment | Expression | For | If | While
    if (isAssignment(statement)) yield* AssignmentGenerator(statement, context);
    if (isFor(statement)) yield* ForGenerator(statement, context);
    if (isIf(statement)) yield* IfGenerator(statement, context);
    if (isWhile(statement)) yield* WhileGenerator(statement, context);
  }
}
