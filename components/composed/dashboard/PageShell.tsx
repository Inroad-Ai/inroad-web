import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: string;
  action?: ReactNode;
  /** Narrower reading width, for pages that are mostly one column of text. */
  maxWidth?: number;
  children: ReactNode;
}

/** The page header every dashboard screen shares: a title, one line under it
 * and the page's primary action opposite. The shell owns the gutters. */
export function PageShell({ title, description, action, maxWidth, children }: PageShellProps) {
  return (
    <div style={maxWidth ? { maxWidth } : undefined}>
      <div className="row head wrap">
        <div style={{ minWidth: 0 }}>
          <h1 className="t">{title}</h1>
          {description ? <div className="sub">{description}</div> : null}
        </div>
        <span className="sp" />
        {action ? <div className="row wrap">{action}</div> : null}
      </div>
      <div style={{ marginTop: 24 }}>{children}</div>
    </div>
  );
}
