import { createFileRoute, Link } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { useState } from "react";
import { ItemArt } from "@/components/site/ItemArt";
import { PageMasthead, SectionHeading } from "@/components/site/PageMasthead";
import { GALLERY_STORIES, categoryName, formatPrice } from "@/lib/data";
import { useAllListings } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — PasaGamit" },
      { name: "description", content: "Product snapshots, featured deals, and stories of successful student transactions on PasaGamit." },
      { property: "og:title", content: "PasaGamit Gallery" },
      { property: "og:description", content: "See the items and success stories from our campus marketplace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gallery,
});

const FILTERS = ["All", "Featured", "Products"] as const;

function Gallery() {
  const all = useAllListings();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "Featured" ? all.filter((l) => l.featured) : all;

  return (
    <>
      <PageMasthead kicker="Mga Larawan" title="Gallery" subtitle="Snapshots from the board — products, front-page deals, and pasa success stories." />

      <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="photos-title">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 id="photos-title" className="text-3xl">Product Wall</h2>
          <div role="group" aria-label="Filter gallery" className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn("border-2 border-ink px-3 py-1 text-sm font-bold", filter === f ? "bg-ink text-ink-foreground" : "bg-paper hover:bg-mustard")}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="columns-2 gap-5 md:columns-3 lg:columns-4">
          {shown.map((l, i) => (
            <Link
              key={l.id}
              to="/item/$id"
              params={{ id: l.id }}
              className={cn("flyer flyer-hover mb-5 block break-inside-avoid bg-paper p-2", i % 3 === 0 ? "rotate-1" : i % 3 === 1 ? "-rotate-1" : "")}
            >
              <div className={cn("border border-ink", i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]")}>
                <ItemArt category={l.category} tone={l.tone} photo={l.photo} alt={l.title} />
              </div>
              <figcaption className="flex items-center justify-between gap-2 px-1 pt-2 text-xs">
                <span className="line-clamp-1 font-semibold">{l.title}</span>
                {l.featured && <span className="marker shrink-0 text-sari">★ Featured</span>}
              </figcaption>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6" aria-labelledby="stories-title">
        <SectionHeading kicker="Kwentong Pasa" title={<span id="stories-title">Successful Transactions</span>} />
        <div className="cork grid gap-8 rounded-sm border-8 border-cork p-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_STORIES.map((s, i) => (
            <figure key={s.title} className={cn("flyer pin bg-paper p-3", i % 2 ? "rotate-2" : "-rotate-1")}>
              <div className="aspect-[4/3] border border-ink">
                <ItemArt category={s.category} tone={s.tone} alt={s.title} label={categoryName(s.category)} />
              </div>
              <figcaption className="p-2">
                <p className="font-display text-xl font-bold">{s.title}</p>
                <p className="mt-1 flex gap-2 text-sm text-muted-foreground">
                  <Quote className="h-4 w-4 shrink-0 text-sari" aria-hidden /> <span className="marker">{s.quote}</span>
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6" aria-label="Featured deals strip">
        <div className="flyer flex flex-wrap items-center justify-center gap-6 bg-ink p-6 text-ink-foreground">
          <p className="marker text-2xl text-mustard">Featured ngayon:</p>
          {all.filter((l) => l.featured).map((l) => (
            <Link key={l.id} to="/item/$id" params={{ id: l.id }} className="text-sm font-bold underline-offset-4 hover:underline">
              {l.title.split("(")[0].trim()} — <span className="text-mustard">{formatPrice(l)}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
