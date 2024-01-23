import React, { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { FrameGenerator } from "../generator/generator";
import { type StateFrame } from "../types/IR";
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
    <div>
      <div ref={animationParent}>
        <Frame frame={frame} />
      </div>
      <div>
        <button disabled={done} onClick={nextFrame}>
          next
        </button>
      </div>
    </div>
  );
}
