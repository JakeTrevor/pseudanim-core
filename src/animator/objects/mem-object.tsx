import { MemObject } from "~/types/IR";
import { Literal } from "./literal";
import { Array } from "./array-object";

export const components = {
  literal: Literal,
  array: Array,
  pointer: () => <div>pointer</div>,
  struct: () => <div>struct</div>,
} as const;

export function MemObject({ object }: { object: MemObject }) {
  const Comp = components[object.type];

  // @ts-expect-error TS is not quite smart enough for this to work; but trust me, it does
  return <Comp obj={object} />;
}
