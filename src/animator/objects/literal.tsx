import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { Literal } from "~/types/IR";

import { MultiLabel } from "./multi-label";
import { useRef } from "react";

export function Literal({
  obj: { key, value, label, from },
}: {
  obj: Literal;
}) {
  const ref = useRef<HTMLFieldSetElement>(null);
  useGSAP(() => {
    if (!from) return;
    if (!ref.current) return;

    const fromRect = getBoundsFromKey(from);
    const toRect = ref.current.getBoundingClientRect();

    gsap.from(`#${key}`, {
      x: fromRect.x - toRect.x,
      y: fromRect.y - toRect.y,
      width: fromRect.width - toRect.width,
      height: fromRect.height - toRect.height,
      position: "absolute",
    });
  }, [from]);

  return (
    <fieldset
      ref={ref}
      key={key}
      className={`border-2 border-solid border-slate-600 px-4 py-2 w-fit h-fit min-h-4 group:w-full`}
    >
      <legend>
        <MultiLabel label={label} />
      </legend>
      <div className="absolute" id={key}>
        {value.toString()}
      </div>
    </fieldset>
  );
}

function getBoundsFromKey(key: string) {
  const elt = document.getElementById(key);
  if (!elt) throw new Error("undefined key");
  return elt.getBoundingClientRect();
}
