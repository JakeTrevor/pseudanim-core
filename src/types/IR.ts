export type IR = StateFrame[];

export type StateFrame = MemObject[];

interface MemObjectBase {
  label?: string;
  key: string;
}

export interface Literal extends MemObjectBase {
  type: "literal";
  value: string | number | boolean;
}

export interface Pointer extends MemObjectBase {
  type: "pointer";
  value: string;
}

export interface Array extends MemObjectBase {
  type: "array";
  value: MemObject[];
}

export interface Struct extends MemObjectBase {
  type: "struct";
  value: Record<string, MemObject>;
}

type MemObject = Literal | Pointer | Array | Struct;
