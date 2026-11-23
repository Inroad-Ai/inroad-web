"use client";

import { useState } from "react";

import { Bar, Btn, Ic, Lm, Section, Status, Toggle } from "../kit";

const ACCOUNTS: [string, number, string, string][] = [
  ["github", 3, "GitHub", "Authority score, open-source hiring, project ideas"],
  ["linkedin", 2, "LinkedIn", "Profile strength and warm paths. Public profile only"],
];

const STEPS: [string, string, boolean, number][] = [
  ["Public company site", "Free, instant", true, 41],
  ["Hunter", "Your key, 1 credit per find", true, 34],
  ["Apollo", "Rate limited, paused for now", false, 0],
];

/** Parts of the Sources screen with no backend yet. Their switches work in
 * this browser only. */
export function SourceExtras() {
  const [connected, setConnected] = useState<ReadonlySet<string>>(new Set(["GitHub"]));
  const [order, setOrder] = useState(STEPS.map(([name]) => name));
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(STEPS.map(([name, , on]) => [name, on])),
  );

  const byName = Object.fromEntries(STEPS.map((step) => [step[0], step]));
  const total = order.reduce((sum, name) => sum + (enabled[name] ? byName[name][3] : 0), 0);

  function move(name: string, delta: number) {
    setOrder((current) => {
      const index = current.indexOf(name);
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <>
      <Section title="More accounts" style={{ marginTop: 32 }}>
        <div className="list">
          {ACCOUNTS.map(([icon, c, name, note]) => {
            const on = connected.has(name);
            return (
              <div key={name}>
                <Lm c={c}>
                  <Ic n={icon} size="s" />
                </Lm>
                <div style={{ flex: 1 }}>
                  <div className="m">{name}</div>
                  <div className="xs faint">{note}</div>
                </div>
                <Status tone={on ? "" : "amber"}>{on ? "Connected" : "Not connected"}</Status>
                <span style={{ marginLeft: 12 }}>
                  <Btn
                    kind={on ? "sm" : "sm p"}
                    onClick={() =>
                      setConnected((current) => {
                        const next = new Set(current);
                        if (next.has(name)) next.delete(name);
                        else next.add(name);
                        return next;
                      })
                    }
                  >
                    {on ? "Disconnect" : "Connect"}
                  </Btn>
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Contact email: order of sources" right="Waterfall">
        <div>
          {order.map((name, index) => {
            const [, meta, , finds] = byName[name];
            const on = enabled[name];
            return (
              <div
                key={name}
                className="row"
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid rgb(var(--color-line) / .7)",
                  gap: 14,
                }}
              >
                <span className="row" style={{ gap: 2 }}>
                  <button
                    type="button"
                    className="faint"
                    aria-label={`Move ${name} up`}
                    disabled={index === 0}
                    onClick={() => move(name, -1)}
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    <Ic n="chev" size="s" />
                  </button>
                  <button
                    type="button"
                    className="faint"
                    aria-label={`Move ${name} down`}
                    disabled={index === order.length - 1}
                    onClick={() => move(name, 1)}
                    style={{ transform: "rotate(90deg)" }}
                  >
                    <Ic n="chev" size="s" />
                  </button>
                </span>
                <span className="xs faint" style={{ width: 12 }}>
                  {index + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="m">{name}</div>
                  <div className="xs faint">{meta}</div>
                </div>
                <div style={{ width: 80 }}>
                  <Bar v={on ? finds : 0} tone={on ? "teal" : ""} />
                </div>
                <span className="xs muted" style={{ width: 70, textAlign: "right" }}>
                  {on ? `finds ${finds}%` : "paused"}
                </span>
                <Toggle
                  on={on}
                  label={name}
                  onChange={(next) => setEnabled((current) => ({ ...current, [name]: next }))}
                />
              </div>
            );
          })}
        </div>
        <div className="row" style={{ gap: 12, marginTop: 12 }}>
          <span className="sp" />
          <span className="sm muted">
            Stops at the first valid email. Together they find{" "}
            <b style={{ color: "rgb(var(--color-ink))" }}>{total}%</b>. Order and switches are a
            preview and are kept in this browser only.
          </span>
        </div>
      </Section>
    </>
  );
}
