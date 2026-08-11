// Measured against stripe.com on a home connection: homepage 1093ms, news
// 296ms, hiring 1455ms. Run one after another that is their sum; run together
// it is the slowest one, plus overhead.
const SEQUENTIAL_MS = 2843;
const CONCURRENT_MS = 765;

export function SpeedComparison() {
  const ratio = (CONCURRENT_MS / SEQUENTIAL_MS) * 100;

  return (
    <section id="speed" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p className="utility-label text-text-secondary">Why it is quick</p>
        <h2 className="mt-4 max-w-2xl font-display text-2xl leading-snug text-ink sm:text-3xl">
          The three checks do not wait for each other.
        </h2>

        <div className="mt-10 max-w-3xl space-y-6 sm:mt-14">
          <Bar
            label="One at a time"
            ms={SEQUENTIAL_MS}
            widthPercent={100}
            tone="bg-line"
          />
          <Bar
            label="All at once"
            ms={CONCURRENT_MS}
            widthPercent={ratio}
            tone="bg-signal-amber"
          />
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Both bars are the same three checks. Waiting on each in turn costs
          their total; starting them together costs the slowest one. If a source
          is down, it stops at its own deadline and the other two still come
          back.
        </p>
      </div>
    </section>
  );
}

function Bar({
  label,
  ms,
  widthPercent,
  tone,
}: {
  label: string;
  ms: number;
  widthPercent: number;
  tone: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="utility-label text-text-secondary">{label}</span>
        <span className="font-sans text-sm text-ink">
          {(ms / 1000).toFixed(2)}s
        </span>
      </div>
      <div className="mt-2 h-3 w-full rounded-full bg-surface-raised">
        <div
          className={`h-3 rounded-full ${tone}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
}
