export function DatabaseNotice() {
  return (
    <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm">
      Database is not configured. Set <code>DATABASE_URL</code>, run migrations,
      then refresh this page to manage CMS content.
    </div>
  );
}
