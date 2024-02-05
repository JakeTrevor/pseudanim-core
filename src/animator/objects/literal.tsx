import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Literal } from "~/types/IR";

import { MultiLabel } from "./multi-label";

export function Literal({
  obj: { key, value, label, from },
}: {
  obj: Literal;
}) {
  const container = useRef(null);

  useGSAP(
    () => {
      if (!from) return;

      const { left, top, width, height } = getBoundsFromKey(from);

      gsap.from(`.${key}`, { left, top, width, height });
    },
    { scope: container }
  );

  return (
    <fieldset
      ref={container}
      id={key}
      key={key}
      className={`${key} border-2 border-solid border-slate-600 px-4 py-2 w-fit h-fit group:w-full`}
    >
      <legend>
        <MultiLabel label={label} />
      </legend>
      <div>{value.toString()}</div>
    </fieldset>
  );
}

function getBoundsFromKey(key: string) {
  const elt = document.getElementById(key);
  if (!elt) throw new Error("undefined key");
  return elt.getBoundingClientRect();
}
