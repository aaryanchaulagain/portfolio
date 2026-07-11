export type DashboardStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisMonth: number;
};

const cards: Array<{
  key: keyof DashboardStats;
  label: string;
  hint: string;
  accent?: boolean;
}> = [
  { key: "total", label: "Total", hint: "All enquiries" },
  { key: "pending", label: "Pending", hint: "Awaiting review", accent: true },
  { key: "approved", label: "Approved", hint: "Email sent / accepted" },
  { key: "rejected", label: "Rejected", hint: "Declined requests" },
  { key: "thisMonth", label: "This month", hint: "New this month" },
];

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`relative overflow-hidden rounded-2xl border px-5 py-4 shadow-soft ${
            card.accent
              ? "border-accent/25 bg-gradient-to-br from-accent/15 via-surface to-surface"
              : "border-border bg-surface"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {card.label}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight">
            {stats[card.key]}
          </p>
          <p className="mt-1 text-xs text-muted">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
