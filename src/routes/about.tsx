import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Leaf, Recycle, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageMasthead } from "@/components/site/PageMasthead";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — PasaGamit" },
      { name: "description", content: "Why PasaGamit exists: our story, mission, vision, goals, and commitment to a sustainable, zero-waste campus." },
      { property: "og:title", content: "About PasaGamit" },
      { property: "og:description", content: "Built by students to make school more affordable and sustainable." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const GOALS = [
  "Help students save at least ₱5,000 per school year on required materials.",
  "Keep 10,000 school items in circulation and out of landfills by 2028.",
  "Make every transaction safe through student verification and on-campus Pasa Points.",
  "Grow a culture of bayanihan — upperclassmen passing tools down to the next batch.",
];

function About() {
  return (
    <>
      <PageMasthead kicker="Ang Aming Kwento" title="About PasaGamit" subtitle="Isang palengke na gawa ng estudyante, para sa estudyante." />

      <article className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="kicker text-cork">Background</p>
            <h2 className="mt-1 text-4xl">It started with a ₱2,800 textbook.</h2>
            <div className="newspaper-cols mt-6 space-y-4 text-lg leading-relaxed md:columns-2">
              <p className="drop-cap">
                Every June, the same story: freshmen lining up to buy brand-new books, uniforms, and calculators — while seniors
                had the exact same items gathering dust sa bahay. Group chats and Facebook posts helped a little, but listings
                got buried and meetups felt sketchy.
              </p>
              <p>
                So a few students from Computer Science, Accountancy, and Nursing built PasaGamit: a single, verified place
                inside the campus community where anyone can ipasa their pre-loved school items. Think of it as the neighborhood
                sari-sari store — familiar, trusted, and always nearby — meets the campus bulletin board.
              </p>
              <p>
                Today, PasaGamit connects thousands of students across departments. Every listing is posted by a verified
                student, every meetup happens at a safe on-campus Pasa Point, and every pasa means one less item thrown away.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flyer pin bg-sari p-6 text-primary-foreground">
              <Target className="h-8 w-8" aria-hidden />
              <h3 className="mt-2 text-2xl">Mission</h3>
              <p className="mt-2">To make college more affordable by helping students buy, sell, and trade academic items safely within their own school community.</p>
            </div>
            <div className="flyer pin rotate-1 bg-mustard p-6">
              <Eye className="h-8 w-8" aria-hidden />
              <h3 className="mt-2 text-2xl">Vision</h3>
              <p className="mt-2">A campus where no student skips a class requirement because of cost, and no useful item ends up in the trash.</p>
            </div>
          </div>
        </div>

        <section className="mt-16 border-t-4 border-double border-ink pt-8" aria-labelledby="goals-title">
          <h2 id="goals-title" className="text-4xl">Our Goals</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2">
            {GOALS.map((g, i) => (
              <li key={g} className="flyer flex gap-4 bg-paper p-5">
                <span className="font-display text-5xl font-black text-sari">{String(i + 1).padStart(2, "0")}</span>
                <p className="self-center">{g}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flyer mt-16 overflow-hidden bg-forest text-forest-foreground" aria-labelledby="sustain-title">
          <div className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <p className="marker text-mustard text-lg">Ang ating pangako</p>
              <h2 id="sustain-title" className="mt-1 text-4xl sm:text-5xl">Gamit na gamit, hindi itatapon.</h2>
              <p className="mt-4 max-w-2xl text-lg opacity-90">
                Each textbook reused saves roughly 3kg of paper. Each uniform passed on saves thousands of liters of water. When
                you ipasa instead of throw away, you are part of a circular campus economy — sustainable, community-driven, at
                makatao.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="mustard" size="lg"><Link to="/post">Ipasa ang gamit mo</Link></Button>
                <Button asChild variant="outline" size="lg"><Link to="/marketplace" search={{ trade: "free" }}>Browse free items</Link></Button>
              </div>
            </div>
            <ul className="grid grid-cols-3 gap-4 self-center md:grid-cols-1">
              {[
                [Recycle, "2,480", "items reused"],
                [Leaf, "7.4t", "waste avoided"],
                [Users, "5,100", "students"],
              ].map(([Icon, n, l]) => {
                const I = Icon as typeof Leaf;
                return (
                  <li key={l as string} className="text-center md:text-left">
                    <I className="mx-auto h-6 w-6 md:mx-0" aria-hidden />
                    <p className="font-display text-3xl font-black">{n as string}</p>
                    <p className="text-xs opacity-80">{l as string}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </article>
    </>
  );
}
