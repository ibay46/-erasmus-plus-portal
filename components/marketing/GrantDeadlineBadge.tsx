export function GrantDeadlineBadge({ deadline }: { deadline: Date }) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const deadlineDay = new Date(deadline);
  deadlineDay.setHours(0, 0, 0, 0);
  const expired = deadlineDay.getTime() < startOfToday.getTime();
  const dateStr = new Date(deadline).toLocaleDateString("tr-TR");

  return (
    <span
      className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${
        expired ? "bg-red-600/85" : "bg-black/55"
      }`}
    >
      Son Başvuru: {dateStr}
    </span>
  );
}
