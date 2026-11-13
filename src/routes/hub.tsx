import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageSquare, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageMasthead, SectionHeading } from "@/components/site/PageMasthead";
import { TONE_BG } from "@/components/site/ItemArt";
import { HUB_BOARDS, HUB_GROUPS, HUB_POSTS } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hub")({
  head: () => ({
    meta: [
      { title: "Student Hub — PasaGamit" },
      { name: "description", content: "Discussion boards, student groups, and community posts for buying, swapping, and campus life tips." },
      { property: "og:title", content: "PasaGamit Student Hub" },
      { property: "og:description", content: "Join student discussions, groups, and community posts on PasaGamit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Hub,
});

function Hub() {
  const [posts, setPosts] = useState(HUB_POSTS);
  const [liked, setLiked] = useState<number[]>([]);
  const [joined, setJoined] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [board, setBoard] = useState(HUB_BOARDS[0].name);

  return (
    <>
      <PageMasthead kicker="Kwentuhan sa Kanto" title="Student Hub" subtitle="Ang tambayan ng komunidad — ask, share, swap tips, and find your people." />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3">
        <section className="lg:col-span-2" aria-labelledby="feed-title">
          <SectionHeading kicker="Usap-usapan" title={<span id="feed-title">Community Posts</span>} />

          <form
            className="flyer mb-8 space-y-3 bg-paper p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim().length < 3) return;
              setPosts((p) => [{ author: "Juan Dela Cruz", course: "BSCS 3", board, time: "now", text: draft.trim(), replies: 0, likes: 0 }, ...p]);
              setDraft("");
              toast.success("Posted to " + board);
            }}
          >
            <label htmlFor="hub-post" className="kicker block">Share something</label>
            <textarea id="hub-post" className="field min-h-20" placeholder="Ano'ng balita? Ask for a book, share a tip…" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm">
                <span className="sr-only">Board</span>
                <select className="field w-auto py-1.5" value={board} onChange={(e) => setBoard(e.target.value)} aria-label="Board">
                  {HUB_BOARDS.map((b) => <option key={b.name}>{b.name}</option>)}
                </select>
              </label>
              <Button type="submit" disabled={draft.trim().length < 3}>Post</Button>
            </div>
          </form>

          <ul className="space-y-6">
            {posts.map((p, i) => (
              <li key={i} className={cn("flyer pin bg-paper p-5", i % 2 ? "md:rotate-[0.4deg]" : "md:-rotate-[0.4deg]")}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-mustard font-bold">
                    {p.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold leading-tight">{p.author}</p>
                    <p className="text-xs text-muted-foreground">{p.course} · in <span className="font-semibold text-cork">{p.board}</span> · {p.time}</p>
                  </div>
                </div>
                <p className="mt-3">{p.text}</p>
                <div className="mt-3 flex gap-4 border-t border-dashed border-ink/30 pt-2 text-sm">
                  <button
                    className={cn("inline-flex items-center gap-1 font-semibold", liked.includes(i) && "text-sari")}
                    aria-pressed={liked.includes(i)}
                    onClick={() => setLiked((l) => (l.includes(i) ? l.filter((x) => x !== i) : [...l, i]))}
                  >
                    <Heart className={cn("h-4 w-4", liked.includes(i) && "fill-current")} aria-hidden /> {p.likes + (liked.includes(i) ? 1 : 0)}
                  </button>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" aria-hidden /> {p.replies} replies
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-10">
          <section className="cork rounded-sm border-8 border-cork p-5" aria-labelledby="boards-title">
            <h2 id="boards-title" className="mb-4 inline-block bg-paper px-3 py-1 text-2xl shadow-flyer">Discussion Boards</h2>
            <ul className="space-y-4">
              {HUB_BOARDS.map((b, i) => (
                <li key={b.name} className={cn("flyer pin bg-paper p-4", i % 2 ? "rotate-1" : "-rotate-1")}>
                  <button className="w-full text-left" onClick={() => setBoard(b.name)}>
                    <h3 className="text-lg">{b.name}</h3>
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                    <p className="marker mt-1 text-sm text-sari">{b.posts} posts</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="groups-title">
            <h2 id="groups-title" className="mb-4 border-b-2 border-ink pb-2 text-2xl">Student Groups</h2>
            <ul className="space-y-3">
              {HUB_GROUPS.map((g) => {
                const isIn = joined.includes(g.name);
                return (
                  <li key={g.name} className="flyer flex items-center gap-3 bg-paper p-3">
                    <div className={cn("flex h-11 w-11 items-center justify-center border-2 border-ink", TONE_BG[g.tone])}>
                      <Users className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold leading-tight">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.members + (isIn ? 1 : 0)} members</p>
                    </div>
                    <Button size="sm" variant={isIn ? "outline" : "forest"} onClick={() => setJoined((j) => (isIn ? j.filter((x) => x !== g.name) : [...j, g.name]))} aria-pressed={isIn}>
                      {isIn ? "Joined" : "Join"}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
