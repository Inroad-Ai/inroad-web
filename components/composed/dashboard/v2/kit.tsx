import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { ICON_PATHS } from "./icon-paths";

type IconSize = "" | "s" | "xs" | "l";
type Tone = "" | "amber" | "teal" | "green" | "rose" | "blue" | "violet" | "ochre";

export function Ic({ n, size = "" }: { n: string; size?: IconSize }) {
  return (
    <svg
      className={`i ${size}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[n] ?? ICON_PATHS.dots }}
    />
  );
}

export function Tag({
  tone = "",
  icon,
  children,
}: {
  tone?: Tone;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <span className={`tag ${tone}`}>
      {icon ? <Ic n={icon} size="xs" /> : null}
      {children}
    </span>
  );
}

export function Status({
  tone = "",
  children,
}: {
  tone?: "" | "amber" | "rose" | "teal" | "faint" | "ochre";
  children?: ReactNode;
}) {
  return (
    <span className={`st ${tone}`}>
      <i />
      {children}
    </span>
  );
}

export function Pill({
  on = false,
  icon,
  children,
}: {
  on?: boolean;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <span className={`pill ${on ? "on" : ""}`}>
      {on && !icon ? <Ic n="check" size="xs" /> : icon ? <Ic n={icon} size="xs" /> : null}
      {children}
    </span>
  );
}

export function Btn({
  kind = "",
  icon,
  end = false,
  href,
  onClick,
  disabled,
  children,
}: {
  kind?: string;
  icon?: string;
  end?: boolean;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const inner = (
    <>
      {icon && !end ? <Ic n={icon} size="s" /> : null}
      {children}
      {icon && end ? <Ic n={icon} size="s" /> : null}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={`btn ${kind}`}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={`btn ${kind}`} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}

export function Av({
  i,
  c = 1,
  size = "",
}: {
  i: string;
  c?: number;
  size?: "" | "lg" | "xl" | "xs";
}) {
  return <span className={`av ${size} c${c}`}>{i}</span>;
}

export function Lm({
  i,
  c = 1,
  size = "",
  round = false,
  children,
}: {
  i?: string;
  c?: number;
  size?: "" | "lg" | "xl" | "xs";
  round?: boolean;
  children?: ReactNode;
}) {
  return (
    <span className={`lm ${size} c${c}`} style={round ? { borderRadius: "50%" } : undefined}>
      {children ?? i}
    </span>
  );
}

export function Bar({
  v,
  tone = "",
  w = "100%",
}: {
  v: number;
  tone?: "" | "teal" | "green";
  w?: string;
}) {
  return (
    <div className={`bar ${tone}`} style={{ width: w }}>
      <i style={{ width: `${v}%` }} />
    </div>
  );
}

export interface ViewItem {
  l: string;
  n?: number;
  on?: boolean;
  icon?: string;
  href?: string;
  /** Makes the tab a button that switches a view in place. */
  onSelect?: () => void;
}

export function Views({ items, className = "" }: { items: ViewItem[]; className?: string }) {
  return (
    <div className={`views ${className}`} role="tablist">
      {items.map((v) => {
        const inner = (
          <>
            {v.icon ? <Ic n={v.icon} size="s" /> : null}
            {v.l}
            {v.n != null ? <span className="n">{v.n}</span> : null}
          </>
        );
        if (v.href) {
          return (
            <Link
              key={v.l}
              href={v.href}
              className={v.on ? "on" : ""}
              role="tab"
              aria-selected={!!v.on}
            >
              {inner}
            </Link>
          );
        }
        if (v.onSelect) {
          return (
            <button
              key={v.l}
              type="button"
              className={v.on ? "on" : ""}
              role="tab"
              aria-selected={!!v.on}
              onClick={v.onSelect}
            >
              {inner}
            </button>
          );
        }
        return (
          <div key={v.l} className={v.on ? "on" : ""} role="tab" aria-selected={!!v.on}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export function Section({
  title,
  right,
  className = "",
  style,
  children,
}: {
  title: string;
  right?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <section className={`sec ${className}`} style={style}>
      <div className="hd">
        <h2>{title}</h2>
        {right ? <span className="link">{right}</span> : null}
      </div>
      {children}
    </section>
  );
}

export function PageHead({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <div className="row head">
      <div>
        <h1 className="t">{title}</h1>
        {sub ? <div className="sub">{sub}</div> : null}
      </div>
      <span className="sp" />
      {children}
    </div>
  );
}

export function Props({ rows }: { rows: [string, ReactNode, string?][] }) {
  return (
    <div className="props">
      {rows.map(([k, v, icon]) => (
        <div key={k} style={{ display: "contents" }}>
          <div className="k">
            {icon ? <Ic n={icon} size="s" /> : null}
            {k}
          </div>
          <div>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function Toggle({ on = false, label }: { on?: boolean; label: string }) {
  return (
    <span
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`toggle ${on ? "on" : ""}`}
    />
  );
}

export function Warmth({ w, width = 14 }: { w: number; width?: number }) {
  return (
    <span className="row" style={{ gap: 3 }} aria-label={`Warmth ${w} of 3`}>
      {[1, 2, 3].map((i) => (
        <i
          key={i}
          style={{
            width,
            height: 4,
            borderRadius: 2,
            background: i <= w ? "rgb(var(--color-signal-teal))" : "rgb(var(--color-line))",
          }}
        />
      ))}
    </span>
  );
}

export function Spark({ pts, w = 120, h = 32 }: { pts: number[]; w?: number; h?: number }) {
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const d = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - 3 - ((p - min) / (max - min || 1)) * (h - 6);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="rgb(var(--color-signal-amber))"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Hair({ my = 0 }: { my?: number }) {
  return <div className="hair" style={{ margin: `${my}px 0` }} />;
}
