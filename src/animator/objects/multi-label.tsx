export function MultiLabel({ label }: { label?: string }) {
  const visible = label
    ? "border-2 border-solid border-slate-600 px-1 py-0.5 text-sm"
    : "invisible";
  return <div className={visible}>{label}</div>;
}
