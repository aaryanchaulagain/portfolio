export default function PublicLoading() {
  return (
    <div className="section-padding" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="h-3 w-24 animate-pulse rounded bg-surface-elevated" />
        <div className="h-10 w-2/3 max-w-xl animate-pulse rounded-lg bg-surface-elevated" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-surface-elevated/80" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="aspect-[16/10] animate-pulse bg-surface-elevated" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-surface-elevated" />
                <div className="h-4 w-full animate-pulse rounded bg-surface-elevated/70" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-surface-elevated/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
