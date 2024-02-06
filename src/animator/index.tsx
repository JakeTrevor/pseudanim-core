import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { FrameGenerator } from "~/generator/generator";
import { type StateFrame } from "~/types/IR";
import { Frame } from "./state-frame";

export function Animator({ generator }: { generator: FrameGenerator }) {
  const [frame, setFrame] = useState<StateFrame>([]);
  const [done, setDone] = useState(false);

  const [animationParent] = useAutoAnimate();

  const nextFrame = () => {
    const res = generator.next();
    if (res.done) setDone(true);
    else setFrame(res.value);
  };

  return (
    <div className="p-10">
      <button
        disabled={done}
        onClick={nextFrame}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-grey-200 active:bg-blue-700"
      >
        next
      </button>
      <div ref={animationParent}>
        <Frame frame={frame} />
      </div>
      <div></div>
    </div>
  );
}
