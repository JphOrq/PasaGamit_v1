import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, BookOpen, Megaphone, MessagesSquare, Plus, Repeat, Search, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard, SaveButton, TradeBadge } from "@/components/site/ListingCard";
import { ItemArt } from "@/components/site/ItemArt";
import { SectionHeading } from "@/components/site/PageMasthead";
import { SafetyTips } from "@/components/site/SafetyTips";
import { ANNOUNCEMENTS, NOTIFICATIONS, formatPrice, categoryName } from "@/lib/data";
import { useAllListings } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PasaGamit — Buy, Sell & Trade School Stuff on Campus" },
      { name: "description", content: "PasaGamit is the campus marketplace for pre-loved textbooks, uniforms, calculators, lab gear, and school supplies." },
      { property: "og:title", content: "PasaGamit — The Student Marketplace" },
      { property: "og:description", content: "Pasa mo, gamit ko. Buy, sell, and trade school items within your college community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const QUICK_ACTIONS = [
  { label: "Post an Item", icon: Plus, to: "/post", variant: "default" },
  { label: "Browse Marketplace", icon: Search, to: "/marketplace", variant: "ink" },
  { label: "Trade an Item", icon: Repeat, to: "/marketplace", search: { trade: "trade" }, variant: "forest" },
  { label: "View Featured Deals", icon: Star, to: "/", hash: "featured", variant: "mustard" },
  { label: "Join Student Discussions", icon: MessagesSquare, to: "/hub", variant: "outline" },
] as const;

function Home() {
  const listings = useAllListings();
  const featured = listings.filter((l) => l.featured);
  const [lead, ...sideFeatured] = featured;
  const recent = [...listings].sort((a, b) => b.postedAt.localeCompare(a.postedAt)).slice(0, 4);
  const trending = listings.filter((l) => l.trending).slice(0, 5);

  return (
    <>
      {/* ---------- HERO: front page ---------- */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6" aria-labelledby="hero-title">
        <div className="flex flex-wrap items-center justify-between gap-2 border-y-2 border-ink py-1.5 text-xs font-semibold uppercase tracking-widest">
          <span>Vol. 1 · Blg. 47</span>
          <span className="hidden sm:inline">Ang Pahayagan ng Pasahan sa Kampus</span>
          <span>Biyernes, Nobyembre 13, 2026</span>
        </div>

        <div className="grid gap-10 py-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="stamp text-sari text-sm">Extra! Extra!</span>
            <h1 id="hero-title" className="mt-4 text-5xl sm:text-6xl md:text-7xl xl:text-8xl">
              Pasa mo,
              <br />
              <span className="relative inline-block">
                gamit ko.
                <svg className="absolute -bottom-3 left-0 h-4 w-full text-sari" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 10 C 60 2, 120 16, 180 7 S 270 4, 298 9" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="drop-cap mt-8 max-w-xl text-lg leading-relaxed">
              PasaGamit is your campus's very own sari-sari store for school stuff. Buy, sell, and trade textbooks, uniforms,
              calculators, and lab gear with fellow students — mas mura, mas malapit, and every item gets a second life.
            </p>

            <nav aria-label="Quick actions" className="mt-8 flex flex-wrap gap-3">
              {QUICK_ACTIONS.map(({ label, icon: Icon, variant, ...link }) => (
                <Button key={label} asChild variant={variant} size="lg">
                  <Link {...link}>
                    <Icon /> {label}
                  </Link>
                </Button>
              ))}
            </nav>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t-2 border-ink pt-4">
              {[
                ["2,480+", "items na-pasa"],
                ["₱1.2M", "naipon ng students"],
                ["38", "orgs & blocks"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl font-black">{n}</dd>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Cork board with pinned flyers */}
          <div className="cork relative min-h-[26rem] rounded-sm border-[10px] border-cork p-6 shadow-flyer-lg lg:col-span-5" aria-label="Bulletin board preview">
            <div className="grid grid-cols-2 gap-6">
              {listings.slice(0, 4).map((l, i) => (
                <Link
                  key={l.id}
                  to="/item/$id"
                  params={{ id: l.id }}
                  className={`flyer pin block bg-paper p-2 ${i % 2 ? "rotate-3 mt-6" : "-rotate-2"}`}
                >
                  <div className="aspect-square border border-ink">
                    <ItemArt category={l.category} tone={l.tone} photo={l.photo} alt={l.title} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs font-bold leading-tight">{l.title}</p>
                  <p className="marker text-sari">{formatPrice(l)}</p>
                </Link>
              ))}
            </div>
            <div className="flyer absolute -bottom-6 -left-4 rotate-[-4deg] bg-mustard px-4 py-2">
              <p className="marker text-lg">Bawal ang scam! ✋</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURED: front-page headlines ---------- */}
      <section id="featured" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-12 sm:px-6" aria-labelledby="featured-title">
        <div className="rule-double mb-6 pt-2 text-center">
          <p className="marker text-sari text-lg">Front Page Deals</p>
          <h2 id="featured-title" className="text-4xl sm:text-5xl">Mga Sulit na Balita</h2>
        </div>
        {lead && (
          <div className="grid gap-8 lg:grid-cols-3">
            <article className="relative border-ink lg:col-span-2 lg:border-r-2 lg:pr-8">
              <Link to="/item/$id" params={{ id: lead.id }} className="group block">
                <div className="relative aspect-[16/9] border-2 border-ink">
                  <ItemArt category={lead.category} tone={lead.tone} photo={lead.photo} alt={lead.title} label={categoryName(lead.category)} />
                  <span className="price-tag absolute right-4 bottom-4 text-3xl">{formatPrice(lead)}</span>
                </div>
                <p className="kicker mt-4 text-sari">Headline Deal · {lead.course}</p>
                <h3 className="mt-1 text-3xl group-hover:underline sm:text-5xl">{lead.title}</h3>
              </Link>
              <p className="mt-3 text-muted-foreground md:columns-2 newspaper-cols">{lead.description}</p>
              <div className="mt-4 flex items-center gap-3">
                <TradeBadge trade={lead.trade} />
                <span className="text-sm">by {lead.seller.name}</span>
                <SaveButton id={lead.id} title={lead.title} />
              </div>
            </article>
            <div className="divide-y-2 divide-ink">
              {sideFeatured.map((l) => (
                <article key={l.id} className="py-4 first:pt-0">
                  <Link to="/item/$id" params={{ id: l.id }} className="group flex gap-4">
                    <div className="h-24 w-24 shrink-0 border-2 border-ink">
                      <ItemArt category={l.category} tone={l.tone} photo={l.photo} alt={l.title} />
                    </div>
                    <div>
                      <p className="kicker text-cork">{categoryName(l.category)}</p>
                      <h3 className="text-xl group-hover:underline">{l.title}</h3>
                      <p className="marker mt-1 text-sari">{formatPrice(l)}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ---------- RECENTLY POSTED ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-labelledby="recent-title">
        <SectionHeading
          kicker="Bagong dating"
          title={<span id="recent-title">Recently Posted</span>}
          action={
            <Link to="/marketplace" className="inline-flex items-center gap-1 font-bold text-sari hover:underline">
              See all listings <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((l, i) => (
            <ListingCard key={l.id} listing={l} index={i} />
          ))}
        </div>
      </section>

      {/* ---------- TRENDING + ANNOUNCEMENTS + NOTIFICATIONS ---------- */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div className="flyer bg-paper p-6" aria-labelledby="trending-title">
          <div className="flex items-center gap-2 border-b-2 border-ink pb-2">
            <TrendingUp className="h-6 w-6 text-sari" aria-hidden />
            <h2 id="trending-title" className="text-3xl">Trending</h2>
          </div>
          <ol className="mt-2">
            {trending.map((l, i) => (
              <li key={l.id} className="border-b border-dashed border-ink/30 last:border-0">
                <Link to="/item/$id" params={{ id: l.id }} className="group flex items-center gap-4 py-3">
                  <span className="font-display text-4xl font-black text-sari/80">{i + 1}</span>
                  <span className="flex-1">
                    <span className="block font-bold leading-tight group-hover:underline">{l.title}</span>
                    <span className="text-xs text-muted-foreground">{categoryName(l.category)}</span>
                  </span>
                  <span className="marker text-sm">{formatPrice(l)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="cork rounded-sm border-8 border-cork p-6 lg:col-span-2" aria-labelledby="announce-title">
          <div className="mb-6 inline-flex items-center gap-2 bg-paper px-3 py-1 shadow-flyer">
            <Megaphone className="h-5 w-5 text-sari" aria-hidden />
            <h2 id="announce-title" className="text-2xl">Campus Bulletin</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              {ANNOUNCEMENTS.map((a, i) => (
                <article key={a.title} className={`flyer pin bg-paper p-4 ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
                  <p className="marker text-sari">{a.date}</p>
                  <h3 className="text-lg">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                </article>
              ))}
            </div>
            <div className="flyer tape rotate-1 bg-mustard p-4" aria-labelledby="notif-title">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" aria-hidden />
                <h3 id="notif-title" className="text-xl">Notifications</h3>
              </div>
              <ul className="mt-3 space-y-3">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="border-b border-ink/30 pb-2 text-sm last:border-0">
                    <p className={n.unread ? "font-bold" : ""}>{n.text}</p>
                    <p className="text-xs opacity-75">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SAFETY + CTA ---------- */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <SafetyTips />
        <div className="flyer flex flex-col justify-center gap-4 bg-sari p-8 text-primary-foreground">
          <BookOpen className="h-10 w-10" aria-hidden />
          <h2 className="text-4xl">May lumang libro sa bahay?</h2>
          <p className="opacity-90">Ipasa mo na. Post it in under a minute — your blockmates might be looking for it right now.</p>
          <div>
            <Button asChild variant="mustard" size="lg">
              <Link to="/post">
                <Plus /> Post an Item
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
