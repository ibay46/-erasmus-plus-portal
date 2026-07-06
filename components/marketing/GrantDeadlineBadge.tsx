export function GrantDeadlineBadge({ deadline }: { deadline: Date }) {
  const dateStr = new Date(deadline).toLocaleDateString("tr-TR");

  return (
    <span className="absolute right-3 top-3 rounded-full bg-accent-warm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
      Son Başvuru: {dateStr}
    </span>
  );
}
