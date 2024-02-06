import { MemObject, type StateFrame } from "~/types/IR";

export type Value = string | number | boolean | string[] | number[] | boolean[];
export type ContextPath = (string | number)[];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Scope extends Record<string | number, Value | Scope> {}

export class Context {
  scope: Scope;
  parent?: Context;

  constructor(parent?: Context) {
    if (parent) this.parent = parent;
    this.scope = {};
  }

  get = (path: ContextPath): Value | undefined => {
    // @ts-expect-error - cast is not type safe in general, but for well typed programs its OK
    let result: Value | undefined = path.reduce((acc, val) => {
      if (acc !== undefined) return acc[val] as Scope;
      return acc;
    }, this.scope);

    if (result === undefined && this.parent) {
      result = this.parent.get(path);
    }

    return result;
  };

  set = (path: ContextPath, value: Value) => {
    if (this.parent?.get(path) !== undefined) {
      this.parent.set(path, value);
    } else {
      let s = this.scope;
      while (path.length > 1) {
        const next = path.shift()!;
        s = s[next] as Scope;
      }
      const next = path.pop()!;
      s[next] = value;
    }
  };

  makeFrame = (association?: {
    from: ContextPath;
    to: ContextPath;
  }): StateFrame => {
    let a = association;
    const keys = Object.keys(this.scope);

    if (association?.from[0] && keys.includes(association.from[0].toString())) {
      a = undefined;
    }

    let frame: StateFrame = this.parent?.makeFrame(a) ?? [];

    const fromKey = association?.from.join("-");
    const toKey = association?.to.join("-");

    const extra: MemObject[] = Object.entries(this.scope).map(
      ([varName, value]) => {
        const from = varName === toKey ? fromKey : undefined;
        //currently, we only cover arrays and literals
        // TODO NB this does not handle nested arrays properly
        if (Array.isArray(value)) {
          return {
            label: varName,
            type: "array",
            key: varName,
            from,
            value: value.map((val, i) => {
              const from = `${varName}-${i}` === toKey ? fromKey : undefined;
              return {
                key: `${varName}-${i}`,
                type: "literal",
                value: val,
                from,
              };
            }),
          };
        }

        return {
          label: varName,
          type: "literal",
          key: varName,
          value: value as string | number | boolean,
          from,
        };
      }
    );

    frame = frame.concat(extra);
    return frame;
  };
}
