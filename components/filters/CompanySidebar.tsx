import { useEffect, useMemo, useRef, useState } from "react";
import { Star, PanelLeftOpen, PanelLeftClose, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Company } from "@/lib/data/testimonials";

const LS_KEY = "itwrapped_starred_companies";

export function CompanySidebar({
  companies,
  selected,
  onSelect,
}: {
  companies: Company[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [starred, setStarred] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) setStarred(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(starred));
  }, [starred]);

  const sorted = useMemo(() => {
    const base = [...companies].sort((a, b) => a.name.localeCompare(b.name));
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter((c) => c.name.toLowerCase().includes(q));
  }, [companies, query]);

  const toggleStar = (slug: string) => {
    setStarred((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const starredSet = new Set(starred);

  return (
    <aside className={cn("fixed left-3 top-24 z-40")}>
      <button
        className="h-10 w-10 rounded-full border bg-card shadow flex items-center justify-center"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        {open ? <PanelLeftClose /> : <PanelLeftOpen />}
      </button>
      {open && (
        <>
          {/* backdrop closes on outside click */}
          <button
            className="fixed inset-0 z-30 bg-transparent"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="relative z-40 mt-3 w-72 rounded-xl border bg-card shadow-xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Companies
              </div>
              <button
                className="text-sm underline"
                onClick={() => onSelect(null)}
              >
                All
              </button>
            </div>

            <div className="px-3 py-2 border-b">
              <div className="flex items-center">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search companies…"
                  className="h-9 w-full rounded-l-md border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
                <span className="h-9 w-9 -ml-px rounded-r-md border border-border bg-card grid place-items-center">
                  <Search className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-auto py-2">
              {sorted.map((c) => (
                <div
                  key={c.slug}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent",
                    selected === c.slug && "bg-accent"
                  )}
                  onClick={() => onSelect(c.slug)}
                >
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="h-6 w-6 rounded-sm border object-contain"
                  />
                  <span className="flex-1 text-sm">{c.name}</span>
                  <button
                    className={cn(
                      "p-1 rounded hover:bg-black/5",
                      starredSet.has(c.slug) && "text-brand-gold"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(c.slug);
                    }}
                    aria-label={
                      starredSet.has(c.slug) ? "Unstar company" : "Star company"
                    }
                  >
                    <Star
                      className={cn(starredSet.has(c.slug) && "fill-current")}
                    />
                  </button>
                </div>
              ))}
              {sorted.length === 0 && (
                <div className="px-3 py-4 text-sm opacity-70">No matches</div>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
