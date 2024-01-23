import React from "react";
import { Literal } from "./literal";
import { Array } from "./array";

export const components = {
  literal: Literal,
  array: Array,
  pointer: () => <div>pointer</div>,
  struct: () => <div>struct</div>,
} as const;
