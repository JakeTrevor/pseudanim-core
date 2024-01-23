import React from "react";
import { Literal } from "../../types/IR";

export function Literal({ obj: { key, value, label } }: { obj: Literal }) {
  return <div key={key}>{value}</div>;
}
