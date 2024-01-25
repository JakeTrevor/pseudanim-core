import { Literal } from "../../types/IR";

import { MultiLabel } from "./multi-label";

export function Literal({ obj: { key, value, label } }: { obj: Literal }) {
  return (
    <fieldset
      key={key}
      className="border-2 border-solid border-slate-600 px-4 py-2 w-fit h-fit group:w-full"
    >
      <legend>
        <MultiLabel label={label} />
      </legend>
      <div>{value.toString()}</div>
    </fieldset>
  );
}
