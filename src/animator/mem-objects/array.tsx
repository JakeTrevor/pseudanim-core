import React from "react";
import { Array } from "../../types/IR";
import { components } from ".";

export function Array({ obj: { key, value, label } }: { obj: Array }) {
  return (
    <div key={key} style={{ border: "solid 1px black" }}>
      {value.map((e) => {
        const Comp = components[e.type];

        // @ts-expect-error TS is not quite smart enough for this to work; but trust me, it does
        return <Comp obj={e} />;
      })}
    </div>
  );
}
