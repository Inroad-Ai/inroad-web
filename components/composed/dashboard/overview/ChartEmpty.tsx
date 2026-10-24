export function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-nest bg-surface-raised px-6 text-center">
      <p className="text-sm text-ink-muted">{message}</p>
    </div>
  );
}
