/** "Step X of N" plus a thin fill bar. Text first - the bar alone doesn't tell you how many steps are left. */
export function ProgressIndicator({ step, total }: { step: number; total: number }) {
  const percent = Math.round((step / total) * 100);

  return (
    <div className="w-full">
      <span className="utility-label text-text-secondary">
        Step {step} of {total}
      </span>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-sm bg-line">
        <div
          className="h-full bg-signal-amber transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
