import type { ReactNode } from "react";

import { Btn, Ic, Lm, Views } from "../kit";

function Item({
  unread,
  icon,
  c,
  head,
  text,
  time,
  children,
}: {
  unread: boolean;
  icon: string;
  c: number;
  head: string;
  text: string;
  time: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: "16px 0",
        borderBottom: "1px solid rgb(var(--color-line) / .7)",
        alignItems: "flex-start",
      }}
    >
      <span style={{ width: 8, paddingTop: 9 }}>
        {unread ? (
          <span
            style={{
              display: "block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "rgb(var(--color-signal-amber))",
            }}
          />
        ) : null}
      </span>
      <Lm c={c} round>
        <Ic n={icon} size="s" />
      </Lm>
      <div style={{ flex: 1 }}>
        <div className="row">
          <span className="m" style={{ fontSize: 15 }}>
            {head}
          </span>
          <span className="sp" />
          <span className="xs faint">{time}</span>
        </div>
        <div className="sm muted" style={{ marginTop: 3, lineHeight: 1.5 }}>
          {text}
        </div>
        <div className="row wrap" style={{ gap: 10, marginTop: 10 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function NotificationsPage() {
  return (
    <div style={{ maxWidth: 820 }}>
      <div className="row head">
        <div>
          <h1 className="t">Notifications</h1>
          <div className="sub">What needs you comes first. Everything else is calm.</div>
        </div>
        <span className="sp" />
        <Btn kind="t">Mark all read</Btn>
        <Btn kind="t" icon="sliders" href="/settings">
          Settings
        </Btn>
      </div>

      <div style={{ marginTop: 22 }}>
        <Views
          items={[
            { l: "Needs you", n: 3, on: true },
            { l: "All", n: 14 },
            { l: "Coach", n: 1 },
            { l: "Data checks", n: 2 },
            { l: "System", n: 2 },
          ]}
        />
      </div>

      <div className="xs faint" style={{ padding: "6px 0 0 24px" }}>
        Today
      </div>
      <Item
        unread
        icon="mail"
        c={2}
        head="Priya Nair replied"
        text={'"Thanks, can we talk Thursday?" Replying within 24 hours keeps your odds high.'}
        time="2h"
      >
        <Btn kind="p sm" href="/contacts/priya-nair">
          Draft reply
        </Btn>
        <Btn kind="t sm" href="/contacts/priya-nair">
          Open thread
        </Btn>
      </Item>
      <Item
        unread
        icon="flag"
        c={4}
        head="Is this correct?"
        text="We found Ledgerline has 120 employees, from a LinkedIn estimate with low confidence."
        time="3h"
      >
        <Btn kind="sm" icon="check">
          Yes
        </Btn>
        <Btn kind="sm">No, fix it</Btn>
      </Item>
      <Item
        unread
        icon="spark"
        c={3}
        head="Your coach has a question"
        text="What would make your next role a clear win in 18 months?"
        time="5h"
      >
        <Btn kind="sm" href="/coach">
          Answer
        </Btn>
        <Btn kind="t sm">Later</Btn>
      </Item>
      <Item
        unread={false}
        icon="trend"
        c={1}
        head="Fieldstone AI raised $42M"
        text="Series B, hiring 6 backend roles. Fits you 88%."
        time="6h"
      >
        <Btn kind="sm">Research it</Btn>
        <Btn kind="t sm">Dismiss</Btn>
      </Item>

      <div className="xs faint" style={{ padding: "18px 0 0 24px" }}>
        Yesterday
      </div>
      <Item
        unread={false}
        icon="plug"
        c={5}
        head="Gmail needs a quick reconnect"
        text="Google asked us to refresh access. Drafts and sending are paused until then."
        time="1d"
      >
        <Btn kind="p sm" href="/integrations">
          Reconnect
        </Btn>
      </Item>
    </div>
  );
}
