import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";

export function ProfileSaveBar({
  isDirty,
  saving,
  saved,
  saveError,
  onSave,
}: {
  isDirty: boolean;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
  onSave: () => void;
}) {
  const isUpToDate = saved || !isDirty;

  return (
    <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-card bg-surface p-3 pl-5 shadow-pop sm:flex-row sm:items-center sm:justify-between sm:rounded-full">
      <p className="flex items-center gap-2.5 text-sm font-sans-semibold" aria-live="polite">
        {saveError ? (
          <>
            <StatusDot state="failed" />
            <span className="text-error">{saveError}</span>
          </>
        ) : isUpToDate ? (
          <>
            <StatusDot state="done" />
            <span className="text-ink-muted">Your profile is up to date.</span>
          </>
        ) : (
          <>
            <StatusDot state="pending" />
            <span className="text-ink">Save changes to update your matching profile.</span>
          </>
        )}
      </p>
      <Button type="button" onClick={onSave} loading={saving} disabled={!isDirty && !saveError}>
        {saving ? "Saving..." : "Save profile"}
      </Button>
    </div>
  );
}
