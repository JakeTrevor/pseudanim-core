import { StateFrame } from "~/types/IR";
import { MemObject } from "./objects/mem-object";

export function Frame({ frame }: { frame: StateFrame }) {
  return (
    <div className="grid grid-cols-3 place-items-centre p-10 gap-5">
      {frame.map((e) => (
        <MemObject object={e} />
      ))}
    </div>
  );
}
