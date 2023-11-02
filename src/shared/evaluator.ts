import {
  isReference,
  ArrayLiteral,
  BinaryExpression,
  BooleanLiteral,
  Expression,
  Literal,
  RangeExpression,
  SimpleExpression,
  isArrayLiteral,
  isBooleanLiteral,
  isLiteral,
  isRangeExpression,
  isSimpleExpression,
  Reference,
  isExpression,
} from "../generated/ast.js";
import { Context, ContextPath, Value } from "./context.js";

export const expression = (expr: Expression, context: Context): Value => {
  if (isSimpleExpression(expr)) return simpleExpression(expr, context);
  else return binaryExpression(expr, context);
};

const simpleExpression = (expr: SimpleExpression, context: Context): Value => {
  if (isLiteral(expr)) return literal(expr, context);
  if (isReference(expr)) return reference(expr, context);
  return expression(expr.value, context);
};

const reference = (ref: Reference, context: Context): Value => {
  const path =
    ref.access?.path.map((e) => {
      if (isExpression(e)) return expression(e, context);
      return e;
    }) || [];
  path.unshift(ref.ref);

  const v = context.get(path as ContextPath);

  // TODO proper runtime error
  if (v === undefined) throw Error("unresolvable reference: ", { cause: path });

  return v;
};

const literal = ({ value }: Literal, context: Context): Value => {
  if (isBooleanLiteral(value)) return booleanLiteral(value);
  if (isArrayLiteral(value)) return arrayLiteral(value, context);
  return value;
};

const booleanLiteral = ({ value }: BooleanLiteral) => value;

const arrayLiteral = ({ contents }: ArrayLiteral, context: Context): Value =>
  contents.flatMap((val) => {
    if (isRangeExpression(val)) return rangeExpression(val, context);
    return expression(val, context);
  }) as Value;

const rangeExpression = (expr: RangeExpression, context: Context) => {
  let start = expression(expr.start, context);
  let end = expression(expr.end, context);

  if (typeof start !== "number") {
    //todo proper runtime error
    throw Error("invalid number in range");
  }
  if (typeof end !== "number") {
    //todo proper runtime error
    throw Error("invalid number in range");
  }

  let len = end - start;
  return [...Array(len).keys()].map((e) => e + (start as number));
};

const binaryExpression = (expr: BinaryExpression, context: Context): Value => {
  return operators[expr.op](expr.left, expr.right, context);
};

const operators: Record<
  | "!="
  | "%"
  | "*"
  | "+"
  | "-"
  | "/"
  | "<"
  | "<="
  | "=="
  | ">"
  | ">="
  | "^"
  | "and"
  | "or",
  (a: Expression, b: Expression, context: Context) => Value
> = {
  "!=": (a, b, context) => expression(a, context) !== expression(b, context),
  "%": (a, b, context) =>
    (expression(a, context) as number) % (expression(b, context) as number),
  "*": (a, b, context) =>
    (expression(a, context) as number) * (expression(b, context) as number),
  "+": (a, b, context) =>
    (expression(a, context) as number) + (expression(b, context) as number),
  "-": (a, b, context) =>
    (expression(a, context) as number) - (expression(b, context) as number),
  "/": (a, b, context) =>
    (expression(a, context) as number) / (expression(b, context) as number),
  "<": (a, b, context) =>
    (expression(a, context) as number) < (expression(b, context) as number),
  "^": (a, b, context) =>
    (expression(a, context) as number) ^ (expression(b, context) as number),
  "<=": (a, b, context) => expression(a, context) <= expression(b, context),
  "==": (a, b, context) => expression(a, context) === expression(b, context),
  ">": (a, b, context) => expression(a, context) > expression(b, context),
  ">=": (a, b, context) => expression(a, context) >= expression(b, context),
  and: (a, b, context) => {
    let x = expression(a, context) as boolean;
    if (!x) return x;

    return x && (expression(b, context) as boolean);
  },
  or: (a, b, context) => {
    let x = expression(a, context) as boolean;
    if (x) return x;

    return x || (expression(b, context) as boolean);
  },
};
