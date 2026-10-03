import { Button } from "@/components/ui/Button";
import { AlertCircleIcon, CheckCircleIcon } from "@/components/ui/Icons";

export function ConnectionNotice({
  message,
  tone,
  action,
  onAction,
  busy = false,
}: {
  message: string;
  tone: "error" | "success";
  action?: string;
  onAction?: () => void;
  busy?: boolean;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex flex-wrap items-center justify-between gap-3 rounded-sm border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-muted-rose/30 bg-muted-rose-subtle text-muted-rose"
          : "border-success/40 bg-success-subtle text-success"
      }`}
    >
      <span className="flex items-center gap-2">
        {tone === "error" ? <AlertCircleIcon /> : <CheckCircleIcon />}
        {message}
      </span>
      {action && onAction ? (
        <Button type="button" variant="quiet" size="sm" onClick={onAction} disabled={busy}>
          {busy ? "Trying again..." : action}
        </Button>
      ) : null}
    </div>
  );
}
