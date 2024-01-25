import { Array } from "~/types/IR";
import { MemObject } from "./mem-object";
import { MultiLabel } from "./multi-label";

export function Array({ obj: { key, value, label } }: { obj: Array }) {
  return (
    <fieldset
      key={key}
      className="border-2 border-solid border-slate-600 px-4 py-2 w-fit group"
    >
      <legend>
        <MultiLabel label={label} />
      </legend>
      {value.map((e) => (
        <MemObject object={e} />
      ))}
    </fieldset>
  );
}
