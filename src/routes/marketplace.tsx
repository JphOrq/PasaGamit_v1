import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/site/ListingCard";
import { PageMasthead } from "@/components/site/PageMasthead";
import { CATEGORIES, CONDITIONS, COURSES, YEAR_LEVELS, filterListings } from "@/lib/data";
import { useAllListings } from "@/lib/store";

export interface MarketSearch {
  q?: string;
  category?: string;
  course?: string;
  year?: string;
  condition?: string;
  min?: number;
  max?: number;
  trade?: string;
  sort?: string;
}

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v !== "" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export const Route = createFileRoute("/marketplace")({
  validateSearch: (s: Record<string, unknown>): MarketSearch => ({
    q: str(s.q),
    category: str(s.category),
    course: str(s.course),
    year: str(s.year),
    condition: str(s.condition),
    min: num(s.min),
    max: num(s.max),
    trade: str(s.trade),
    sort: str(s.sort),
  }),
  head: () => ({
    meta: [
      { title: "Marketplace — PasaGamit" },
      { name: "description", content: "Browse every textbook, uniform, gadget, and lab item listed by students. Filter by course, year level, price, and condition." },
      { property: "og:title", content: "PasaGamit Marketplace" },
      { property: "og:description", content: "Search and filter pre-loved school items from your campus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/marketplace" });
  const all = useAllListings();
  const [showFilters, setShowFilters] = useState(false);

  const set = (patch: Partial<MarketSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  const results = useMemo(() => {
    const r = filterListings(all, {
      q: search.q,
      category: search.category,
      course: search.course,
      year: search.year,
      condition: search.condition,
      minPrice: search.min,
      maxPrice: search.max,
      trade: search.trade,
    });
    if (search.sort === "price-asc") return [...r].sort((a, b) => a.price - b.price);
    if (search.sort === "price-desc") return [...r].sort((a, b) => b.price - a.price);
    return [...r].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  }, [all, search]);

  const activeCount = [search.category, search.course, search.year, search.condition, search.min, search.max, search.trade].filter(
    (v) => v !== undefined,
  ).length;

  return (
    <>
      <PageMasthead
        kicker="Ang Palengke"
        title="Marketplace"
        subtitle="Every item na pinasa ng mga estudyante, all in one board. Hanapin ang kailangan mo."
      >
        <form role="search" className="mt-6 flex max-w-2xl gap-2" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="mk-q" className="sr-only">Search listings</label>
          <input
            id="mk-q"
            type="search"
            className="field h-12 text-base"
            placeholder="Search e.g. calculator, Kozier, PE uniform…"
            value={search.q ?? ""}
            onChange={(e) => set({ q: e.target.value || undefined })}
          />
          <Button
            type="button"
            variant="ink"
            size="lg"
            className="lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="filters"
          >
            <SlidersHorizontal /> Filters{activeCount ? ` (${activeCount})` : ""}
          </Button>
        </form>
      </PageMasthead>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside id="filters" className={`${showFilters ? "block" : "hidden"} lg:block`} aria-label="Filters">
          <div className="flyer space-y-5 bg-paper p-5 lg:sticky lg:top-36">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">Filters</h2>
              {activeCount > 0 && (
                <button
                  className="inline-flex items-center gap-1 text-xs font-bold text-sari underline"
                  onClick={() => navigate({ search: { q: search.q }, replace: true })}
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            <FilterSelect label="Category" id="f-cat" value={search.category} onChange={(v) => set({ category: v })} options={CATEGORIES.map((c) => [c.slug, c.name])} />
            <FilterSelect label="Course" id="f-course" value={search.course} onChange={(v) => set({ course: v })} options={COURSES.slice(1).map((c) => [c, c])} />
            <FilterSelect label="Year level" id="f-year" value={search.year} onChange={(v) => set({ year: v })} options={YEAR_LEVELS.slice(1).map((c) => [c, c])} />
            <FilterSelect label="Condition" id="f-cond" value={search.condition} onChange={(v) => set({ condition: v })} options={CONDITIONS.map((c) => [c, c])} />
            <FilterSelect
              label="Deal type"
              id="f-trade"
              value={search.trade}
              onChange={(v) => set({ trade: v })}
              options={[
                ["trade", "Open to trade"],
                ["free", "Libre / Free"],
              ]}
            />

            <fieldset>
              <legend className="kicker mb-1">Price range (₱)</legend>
              <div className="flex items-center gap-2">
                <label htmlFor="f-min" className="sr-only">Minimum price</label>
                <input id="f-min" type="number" min={0} inputMode="numeric" className="field" placeholder="Min" value={search.min ?? ""} onChange={(e) => set({ min: num(e.target.value) })} />
                <span aria-hidden>–</span>
                <label htmlFor="f-max" className="sr-only">Maximum price</label>
                <input id="f-max" type="number" min={0} inputMode="numeric" className="field" placeholder="Max" value={search.max ?? ""} onChange={(e) => set({ max: num(e.target.value) })} />
              </div>
            </fieldset>
          </div>
        </aside>

        <section aria-labelledby="results-title">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 id="results-title" className="text-xl" aria-live="polite">
              <span className="marker text-sari">{results.length}</span> item{results.length === 1 ? "" : "s"} sa board
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="f-sort" className="kicker">Sort</label>
              <select id="f-sort" className="field w-auto py-1.5" value={search.sort ?? "new"} onChange={(e) => set({ sort: e.target.value === "new" ? undefined : e.target.value })}>
                <option value="new">Newest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>

          {results.length ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((l, i) => (
                <ListingCard key={l.id} listing={l} index={i} />
              ))}
            </div>
          ) : (
            <div className="flyer pin mx-auto max-w-md p-8 text-center">
              <p className="marker text-2xl text-sari">Wala pa dito…</p>
              <p className="mt-2 text-muted-foreground">No items match those filters yet. Try clearing some, or be the first to post one!</p>
              <Button className="mt-4" onClick={() => navigate({ search: {}, replace: true })}>Clear all filters</Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function FilterSelect({
  label,
  id,
  value,
  onChange,
  options,
}: {
  label: string;
  id: string;
  value?: string;
  onChange: (v: string | undefined) => void;
  options: (readonly [string, string])[] | [string, string][];
}) {
  return (
    <div>
      <label htmlFor={id} className="kicker mb-1 block">{label}</label>
      <select id={id} className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)}>
        <option value="">All</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </div>
  );
}
