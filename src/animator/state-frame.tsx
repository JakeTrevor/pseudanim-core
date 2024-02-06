import { StateFrame } from "~/types/IR";
import { MemObject } from "./objects/mem-object";

export function Frame({ frame }: { frame: StateFrame }) {
  return (
    <div className="p-10 gap-5">
      {frame.map((e) => (
        <MemObject object={e} />
      ))}
    </div>
  );
}
