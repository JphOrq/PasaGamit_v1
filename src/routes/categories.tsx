import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageMasthead } from "@/components/site/PageMasthead";
import { CATEGORY_ICONS, TONE_BG } from "@/components/site/ItemArt";
import { CATEGORIES, formatPrice } from "@/lib/data";
import { useAllListings } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — PasaGamit" },
      { name: "description", content: "Shop by category: textbooks, uniforms, gadgets, school supplies, laboratory equipment, and personal items." },
      { property: "og:title", content: "PasaGamit Categories" },
      { property: "og:description", content: "Find school items by category on your campus marketplace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Categories,
});

function Categories() {
  const all = useAllListings();
  return (
    <>
      <PageMasthead kicker="Mga Paninda" title="Categories" subtitle="Parang mga estante sa sari-sari store — pili ka lang kung saan ka titingin." />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => {
          const Icon = CATEGORY_ICONS[c.slug];
          const items = all.filter((l) => l.category === c.slug);
          return (
            <article key={c.slug} className={cn("flyer pin flyer-hover flex flex-col", i % 2 ? "md:rotate-1" : "md:-rotate-1")}>
              <div className={cn("relative flex items-center gap-4 border-b-2 border-ink p-5", TONE_BG[c.tone])}>
                <div className="halftone absolute inset-0 opacity-50" aria-hidden />
                <Icon className="relative h-12 w-12" strokeWidth={1.6} aria-hidden />
                <div className="relative">
                  <h2 className="text-2xl">{c.name}</h2>
                  <p className="marker text-sm opacity-90">{c.tagalog}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm text-muted-foreground">{c.blurb}</p>
                <ul className="mt-4 space-y-2">
                  {items.slice(0, 3).map((l) => (
                    <li key={l.id}>
                      <Link to="/item/$id" params={{ id: l.id }} className="flex justify-between gap-3 border-b border-dashed border-ink/30 pb-1 text-sm hover:text-sari">
                        <span className="line-clamp-1">{l.title}</span>
                        <span className="marker shrink-0">{formatPrice(l)}</span>
                      </Link>
                    </li>
                  ))}
                  {items.length === 0 && <li className="text-sm text-muted-foreground">No items yet.</li>}
                </ul>
                <Link
                  to="/marketplace"
                  search={{ category: c.slug }}
                  className="mt-auto inline-flex items-center gap-1 pt-5 font-bold text-sari hover:underline"
                >
                  Browse {items.length} item{items.length === 1 ? "" : "s"} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
