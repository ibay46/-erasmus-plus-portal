export function GrantDeadlineBadge({ deadline, locale = "tr" }: { deadline: Date; locale?: "tr" | "en" }) {
  const dateStr = new Date(deadline).toLocaleDateString(locale === "en" ? "en-GB" : "tr-TR");

  return (
    <span className="absolute right-3 top-3 rounded-full bg-accent-warm px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide text-black">
      {dateStr}
    </span>
  );
}
