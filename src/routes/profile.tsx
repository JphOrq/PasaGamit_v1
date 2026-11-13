import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, History, Package, Settings, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "@/components/site/ListingCard";
import { StarRating } from "@/components/site/StarRating";
import { COURSES, PROFILE, YEAR_LEVELS, formatPrice } from "@/lib/data";
import { removeListing, useAllListings, usePosted, useSaved, useUser } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — PasaGamit" },
      { name: "description", content: "Manage your PasaGamit profile, listings, saved items, transaction history, and account settings." },
      { property: "og:title", content: "My PasaGamit Profile" },
      { property: "og:description", content: "Your listings, saved items, and transactions in one place." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

const TAB_TRIGGER = "rounded-none border-2 border-ink bg-paper px-4 py-2 font-bold data-[state=active]:bg-ink data-[state=active]:text-ink-foreground";

function Profile() {
  const user = useUser();
  const name = user?.name ?? PROFILE.name;
  const email = user?.email ?? PROFILE.email;
  const all = useAllListings();
  const posted = usePosted();
  const savedIds = useSaved();
  const saved = all.filter((l) => savedIds.includes(l.id));
  const mine = [...posted, ...all.filter((l) => l.seller.name === "Andrei Villanueva" && !posted.includes(l))];
  const initialTab = typeof window !== "undefined" && window.location.hash === "#saved" ? "saved" : "listings";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* ID card style header */}
      <section className="flyer grid gap-6 bg-paper p-6 md:grid-cols-[auto_1fr_auto] md:items-center" aria-label="Student profile">
        <div className="flex h-28 w-28 items-center justify-center border-2 border-ink bg-mustard font-display text-4xl font-black">
          {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
        </div>
        <div>
          <p className="kicker text-sari">Student ID · {PROFILE.studentId}</p>
          <h1 className="mt-1 flex items-center gap-2 text-4xl">
            {name} <BadgeCheck className="h-7 w-7 text-forest" aria-label="Verified student" />
          </h1>
          <p className="text-muted-foreground">{PROFILE.course} · {PROFILE.yearLevel} · {PROFILE.campus}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <StarRating value={PROFILE.rating} /> <span className="font-bold">{PROFILE.rating}</span>
            <span className="text-muted-foreground">· {PROFILE.deals} deals · Member since {PROFILE.memberSince}</span>
          </div>
        </div>
        <div className="flex gap-2 md:flex-col">
          <Button asChild><Link to="/post">Post an Item</Link></Button>
          {!user && <Button asChild variant="outline"><Link to="/login">Sign in</Link></Button>}
        </div>
      </section>

      <Tabs defaultValue={initialTab} className="mt-10">
        <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="listings" className={TAB_TRIGGER}><Package className="h-4 w-4" /> My Listings</TabsTrigger>
          <TabsTrigger value="saved" className={TAB_TRIGGER} id="saved"><Heart className="h-4 w-4" /> Saved ({saved.length})</TabsTrigger>
          <TabsTrigger value="history" className={TAB_TRIGGER}><History className="h-4 w-4" /> Transactions</TabsTrigger>
          <TabsTrigger value="info" className={TAB_TRIGGER}><UserRound className="h-4 w-4" /> Personal Info</TabsTrigger>
          <TabsTrigger value="settings" className={TAB_TRIGGER}><Settings className="h-4 w-4" /> Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((l, i) => (
              <div key={l.id} className="space-y-3">
                <ListingCard listing={l} index={i} />
                {posted.some((p) => p.id === l.id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      removeListing(l.id);
                      toast("Listing removed");
                    }}
                  >
                    <Trash2 /> Remove listing
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-8">
          {saved.length ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
            </div>
          ) : (
            <div className="flyer pin mx-auto max-w-md p-8 text-center">
              <Heart className="mx-auto h-10 w-10 text-sari" aria-hidden />
              <p className="mt-2 font-display text-2xl font-bold">No saved items yet</p>
              <p className="mt-1 text-muted-foreground">Tap the heart on any listing to keep it here.</p>
              <Button asChild className="mt-4"><Link to="/marketplace">Browse Marketplace</Link></Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-8">
          <div className="flyer overflow-x-auto bg-paper">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Transaction history</caption>
              <thead className="bg-ink text-ink-foreground">
                <tr>
                  {["Date", "Item", "With", "Type", "Amount"].map((h) => <th key={h} scope="col" className="kicker px-4 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {PROFILE.transactions.map((t) => (
                  <tr key={t.date + t.item} className="border-b border-dashed border-ink/30 last:border-0">
                    <td className="px-4 py-3">{t.date}</td>
                    <td className="px-4 py-3 font-semibold">{t.item}</td>
                    <td className="px-4 py-3">{t.with}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-sm border-2 border-ink px-2 py-0.5 text-xs font-bold ${t.type === "Sold" ? "bg-mustard" : t.type === "Bought" ? "bg-soft" : "bg-forest text-forest-foreground"}`}>{t.type}</span>
                    </td>
                    <td className="marker px-4 py-3">{t.amount ? formatPrice({ price: t.amount, trade: "sell" }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="info" className="mt-8">
          <PersonalInfo name={name} email={email} />
        </TabsContent>

        <TabsContent value="settings" className="mt-8">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PersonalInfo({ name, email }: { name: string; email: string }) {
  return (
    <form
      className="flyer grid max-w-3xl gap-5 bg-paper p-6 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Profile updated");
      }}
    >
      <div><label htmlFor="pi-name" className="kicker mb-1 block">Full name</label><input id="pi-name" className="field" defaultValue={name} /></div>
      <div><label htmlFor="pi-email" className="kicker mb-1 block">School email</label><input id="pi-email" type="email" className="field" defaultValue={email} /></div>
      <div><label htmlFor="pi-course" className="kicker mb-1 block">Course</label>
        <select id="pi-course" className="field" defaultValue={PROFILE.course}>{COURSES.slice(1).map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      <div><label htmlFor="pi-year" className="kicker mb-1 block">Year level</label>
        <select id="pi-year" className="field" defaultValue={PROFILE.yearLevel}>{YEAR_LEVELS.slice(1).map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      <div className="sm:col-span-2"><label htmlFor="pi-bio" className="kicker mb-1 block">Short bio</label><textarea id="pi-bio" className="field min-h-20" defaultValue="CS student. Mahilig sa gadgets at libro. Fast reply sa umaga!" /></div>
      <div><Button type="submit">Save changes</Button></div>
    </form>
  );
}

function AccountSettings() {
  const [prefs, setPrefs] = useState({ inquiries: true, priceDrops: true, hub: false, publicProfile: true });
  const rows: [keyof typeof prefs, string, string][] = [
    ["inquiries", "Inquiry notifications", "Get notified when someone messages you about a listing."],
    ["priceDrops", "Price drop alerts", "Alerts when saved items get cheaper."],
    ["hub", "Student Hub digest", "Weekly summary of popular discussions."],
    ["publicProfile", "Public profile", "Let other students see your ratings and listings."],
  ];
  return (
    <div className="flyer max-w-3xl divide-y divide-dashed divide-ink/30 bg-paper p-6">
      {rows.map(([k, label, desc]) => (
        <div key={k} className="flex items-center justify-between gap-4 py-4">
          <div>
            <label htmlFor={`set-${k}`} className="font-bold">{label}</label>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
          <Switch id={`set-${k}`} checked={prefs[k]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [k]: v }))} />
        </div>
      ))}
      <div className="pt-4">
        <Button variant="outline" onClick={() => toast("Password reset link sent to your school email")}>Change password</Button>
      </div>
    </div>
  );
}
