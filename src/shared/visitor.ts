import {
  isBooleanLiteral,
  type ArrayLiteral,
  type BooleanLiteral,
  type Expression,
  type SimpleExpression,
  Operation,
  Access,
  isArrayLiteral,
  isExpression,
} from "../generated/ast.js";

class visitor {
  tokens: Record<string, string | boolean | number> = {};

  resolveRef = (ref: string): string | boolean | number => {
    return this.tokens[ref];
  };

  Expression = (expr: Expression) => {
    let val = this.SimpleExpression(expr.left);
    console.log(typeof val, val);
    if (expr.right) {
      val = this.Operation(val, expr.right);
    }

    return val;
  };

  SimpleExpression = (expr: SimpleExpression): value => {
    if (expr.ref) {
      return this.resolveRef(expr.ref);
    } else if (expr.value) {
      if (isBooleanLiteral(expr.value)) return this.BooleanLiteral(expr.value);
      else if (isArrayLiteral(expr.value)) return this.ArrayLiteral(expr.value);
      else if (isExpression(expr.value)) return this.Expression(expr.value);
      return expr.value;
    }
    throw new Error("simple expression has no value");
  };

  BooleanLiteral = (lit: BooleanLiteral) => {
    return lit.value;
  };

  ArrayLiteral = (lit: ArrayLiteral) => {
    //todo
    return 0;
  };

  Operation = (val: any, { operand, right, access }: Operation) => {
    if (access) {
      val = this.Access(val, access);
      val = this.Operation(val, right as Operation);
    } else if (operand) {
      val = operators[operand](val, this.Expression(right as Expression));
    }
    return val;
  };

  Access = (val: value, { path }: Access): value => {
    return "ok";
  };
}

type value = number | string | boolean;
const operators: Record<
  | "!=="
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
  (a: value, b: value) => value
> = {
  "!==": (a, b) => a !== b,
  "%": (a, b) => (a as number) % (b as number),
  "*": (a, b) => (a as number) * (b as number),
  "+": (a, b) => (a as number) + (b as number),
  "-": (a, b) => (a as number) - (b as number),
  "/": (a, b) => (a as number) / (b as number),
  "<": (a, b) => (a as number) < (b as number),
  "^": (a, b) => (a as number) ^ (b as number),
  "<=": (a, b) => a <= b,
  "==": (a, b) => a === b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  and: (a, b) => a && b,
  or: (a, b) => a || b,
};

export default visitor;
