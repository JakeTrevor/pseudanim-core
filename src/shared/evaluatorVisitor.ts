import {
  Access,
  Assignment,
  For,
  If,
  Literal,
  RangeExpression,
  Reference,
  Statement,
  While,
  isArrayLiteral,
  isAssignment,
  isBinaryExpression,
  isBooleanLiteral,
  isExpression,
  isFor,
  isIf,
  isLiteral,
  isRangeExpression,
  isReference,
  isSubExpression,
  isWhile,
  type ArrayLiteral,
  type BooleanLiteral,
  type Expression,
  type SimpleExpression,
} from "../generated/ast.js";

class visitor {
  tokens: Record<any, any> = {};

  updateContext = (context: Record<any, any>, path: any[], val: any): void => {
    if (path.length === 1) {
      context[path[0]] = val;
    } else {
      const [idx, ...rest] = path;
      return this.updateContext(context[idx], rest, val);
    }
  };

  fetchFromContext = (context: Record<any, any>, path: any[]): any => {
    if (path.length === 1) {
      return context[path[0]];
    } else {
      const [idx, ...rest] = path;
      return this.fetchFromContext(context[idx], rest);
    }
  };

  Statement = (statement: Statement): string[] => {
    if (isExpression(statement)) {
      return [this.Expression(statement)];
    }
    if (isFor(statement)) return this.For(statement);
    if (isWhile(statement)) return this.While(statement);
    if (isIf(statement)) return this.If(statement);
    if (isAssignment(statement)) this.Assignment(statement);
    return [];
  };

  Assignment = (assn: Assignment) => {
    const accessPath =
      assn.path?.path.map((e) => {
        if (isExpression(e)) return this.Expression(e);
        return e;
      }) || [];
    accessPath.unshift(assn.var);

    const val = this.Expression(assn.val);

    this.updateContext(this.tokens, accessPath, val);
  };

  For = (fr: For) => {
    const arr = this.Expression(fr.arr);
    if (!Array.isArray(arr)) {
      throw new Error(`Cannot iterate over value: "${arr}"`);
    }

    let a: string[] = [];
    arr.forEach((e) => {
      // @ts-ignore
      this.tokens[fr.var] = e;

      a = a.concat(fr.code.statements.flatMap((e) => this.Statement(e)));
    });
    return a;
  };

  While = (whle: While) => {
    let a: string[] = [];
    while (this.Expression(whle.condition)) {
      a = a.concat(whle.code.statements.flatMap((e) => this.Statement(e)));
    }
    return a;
  };

  If = (statement: If) => {
    if (this.Expression(statement.condition)) {
      return statement.code.statements.flatMap((e) => this.Statement(e));
    }
    return [];
  };

  Expression = (expr: Expression): any => {
    let val;
    if (isBinaryExpression(expr)) {
      val = this.Expression(expr.left);
      let v2 = this.Expression(expr.right);

      val = this.binaryOp(val, expr.op, v2);
    } else {
      val = this.SimpleExpression(expr);
    }
    return val;
  };

  Literal = (l: Literal) => {
    if (isBooleanLiteral(l.value)) return this.BooleanLiteral(l.value);
    else if (isArrayLiteral(l.value)) return this.ArrayLiteral(l.value);
    else if (isExpression(l.value)) return this.Expression(l.value);
    return l.value;
  };

  Reference = (ref: Reference) => {
    ref.ref;

    const accessPath =
      ref.access?.path.map((e) => {
        if (isExpression(e)) return this.Expression(e);
        return e;
      }) || [];
    accessPath.unshift(ref.ref);

    return this.fetchFromContext(this.tokens, accessPath);
  };

  SimpleExpression = (expr: SimpleExpression): value => {
    if (isLiteral(expr)) return this.Literal(expr);
    if (isSubExpression(expr)) return this.Expression(expr.value);
    if (isReference(expr)) return this.Reference(expr);

    throw new Error("simple expression has no value");
  };

  BooleanLiteral = (lit: BooleanLiteral) => {
    return lit.value;
  };

  ArrayLiteral = (lit: ArrayLiteral) => {
    const flat = lit.contents.flatMap((e) => {
      if (isRangeExpression(e)) return this.RangeExpression(e);
      return e;
    });
    return flat.map((e) => {
      if (isExpression(e)) return this.Expression(e);
      return e;
    });
  };

  RangeExpression = (expr: RangeExpression) => {
    let start = this.Expression(expr.start);
    let end = this.Expression(expr.end);
    let len = end - start;
    return [...Array(len).keys()].map((e) => e + start);
  };

  binaryOp = (val: any, operand: keyof typeof operators, right: any) => {
    return operators[operand](val, right);
  };

  Access = (val: value, { path }: Access): value => {
    return "ok";
  };
}

type value = number | string | boolean | (number | string | boolean)[];
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
  (a: value, b: value) => value
> = {
  "!=": (a, b) => a !== b,
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
