import Link from "next/link";
import type { Post } from "@/app/generated/prisma/client";
import { EVENT_SYMBOL_LABELS } from "@/lib/content/eventSymbols";

const SECTOR_COLORS: Record<string, string> = {
  SE: "bg-violet-600",
  VET: "bg-cyan-500",
  HE: "bg-orange-500",
  AE: "bg-lime-600",
};

function PersonIcon() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white">
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" d="M4 21v-1a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v1" />
      </svg>
    </span>
  );
}

function OnlineIcon() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white">
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path strokeLinecap="round" d="M8 20h8M12 16v4" />
      </svg>
    </span>
  );
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function SaltoEventCard({ post }: { post: Post }) {
  const sectors = post.eventSectors.split(",").filter(Boolean);
  const symbols = post.eventSymbols.split(",").filter(Boolean);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 bg-blue-900 px-5 py-4">
        <h3 className="text-base font-semibold leading-snug text-white">{post.title}</h3>
        {post.eventFormat === "ONLINE" ? <OnlineIcon /> : <PersonIcon />}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-5 py-4 text-sm">
        {post.eventStartDate && post.eventEndDate && (
          <p>
            <span className="font-medium text-foreground">Event date: </span>
            <span className="text-muted-foreground">
              {formatDate(post.eventStartDate)} - {formatDate(post.eventEndDate)}
            </span>
          </p>
        )}

        {sectors.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-foreground">Sector:</span>
            {sectors.map((code) => (
              <span
                key={code}
                className={`rounded px-2 py-0.5 text-xs font-semibold text-white ${SECTOR_COLORS[code] ?? "bg-muted-foreground"}`}
              >
                {code}
              </span>
            ))}
          </div>
        )}

        {post.eventVenue && (
          <p>
            <span className="font-medium text-foreground">Event venue: </span>
            <span className="text-muted-foreground">{post.eventVenue}</span>
          </p>
        )}

        {post.eventPriority && (
          <p>
            <span className="font-medium text-foreground">Priority: </span>
            <span className="text-muted-foreground">{post.eventPriority}</span>
          </p>
        )}

        {post.eventApplicationDeadline && (
          <p>
            <span className="font-medium text-foreground">Application deadline: </span>
            <span className="text-muted-foreground">{formatDate(post.eventApplicationDeadline)}</span>
          </p>
        )}

        {post.eventLanguage && (
          <p>
            <span className="font-medium text-foreground">Language: </span>
            <span className="text-muted-foreground">{post.eventLanguage}</span>
          </p>
        )}

        {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}

        {symbols.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {symbols.map((code) => (
              <span
                key={code}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {EVENT_SYMBOL_LABELS[code] ?? code}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex justify-end pt-3">
          <Link
            href={`/haberler/${post.slug}`}
            className="cursor-pointer rounded-full border border-blue-900 px-4 py-1.5 text-sm font-medium text-blue-900 transition-colors duration-200 hover:bg-blue-900 hover:text-white dark:border-accent dark:text-accent dark:hover:bg-accent dark:hover:text-accent-foreground"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
