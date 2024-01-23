import React from "react";
import { StateFrame } from "../types/IR";
import { components } from "./mem-objects";

export function Frame({ frame }: { frame: StateFrame }) {
  return frame.map((e) => {
    const Comp = components[e.type];

    // @ts-expect-error TS is not quite smart enough for this to work; but trust me, it does
    return <Comp obj={e} />;
  });
}
