"use client";

import { useState } from "react";

import { Toggle } from "../v2/kit";

const CATEGORIES: [string, string, boolean, boolean, boolean][] = [
  ["Replies and messages", "When someone answers you", true, true, true],
  ["Follow-ups due", "A message needs a nudge", true, true, false],
  ["Strong matches, 85 and up", "Good fits and hidden roles", true, false, true],
  ["Funding and signals", "Companies you watch", true, true, false],
  ["Coach questions", "Short check-ins", true, false, false],
  ["Data checks", '"Is this correct?" prompts', true, false, false],
];

const CALM: [string, string, boolean][] = [
  ["Daily digest", "One email at 08:30 on weekdays, only if something needs you.", true],
  ["Quiet hours", "No alerts from 20:00 to 08:00 and on weekends.", true],
  [
    "Let urgent replies through",
    "A reply from a decision maker can break through quiet hours.",
    true,
  ],
];

/** The notification choices from the design. They are kept in this browser
 * only for now; the account-level alert switch below is the saved one. */
export function NotificationMatrix() {
  const [matrix, setMatrix] = useState(() => CATEGORIES.map(([, , a, b, c]) => [a, b, c]));
  const [calm, setCalm] = useState(() => CALM.map(([, , on]) => on));

  function flip(row: number, column: number, next: boolean) {
    setMatrix((current) =>
      current.map((values, r) =>
        r === row ? values.map((v, c) => (c === column ? next : v)) : values,
      ),
    );
  }

  return (
    <div>
      <div className="tablewrap">
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 380 }}>Tell me about</th>
              <th style={{ textAlign: "center" }}>In app</th>
              <th style={{ textAlign: "center" }}>Email</th>
              <th style={{ textAlign: "center" }}>Push</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(([name, hint], row) => (
              <tr key={name}>
                <td>
                  <div className="m">{name}</div>
                  <div className="xs faint" style={{ marginTop: 1 }}>
                    {hint}
                  </div>
                </td>
                {["In app", "Email", "Push"].map((channel, column) => (
                  <td key={channel} style={{ textAlign: "center" }}>
                    <Toggle
                      on={matrix[row][column]}
                      label={`${name}, ${channel}`}
                      onChange={(next) => flip(row, column, next)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="b" style={{ marginBottom: 4 }}>
          Calm controls
        </div>
        {CALM.map(([title, text], index) => (
          <div
            key={title}
            className="row"
            style={{
              gap: 20,
              padding: "14px 0",
              borderBottom: "1px solid rgb(var(--color-line) / .7)",
            }}
          >
            <div style={{ flex: 1 }}>
              <div className="m">{title}</div>
              <div className="sm muted" style={{ marginTop: 2 }}>
                {text}
              </div>
            </div>
            <Toggle
              on={calm[index]}
              label={title}
              onChange={(next) =>
                setCalm((current) => current.map((v, i) => (i === index ? next : v)))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
