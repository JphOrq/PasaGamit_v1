import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Calendar, Flag, GraduationCap, MapPin, MessageCircle, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ItemArt } from "@/components/site/ItemArt";
import { InquiryDialog } from "@/components/site/InquiryDialog";
import { ListingCard, SaveButton, TradeBadge } from "@/components/site/ListingCard";
import { SafetyTips } from "@/components/site/SafetyTips";
import { StarInput, StarRating } from "@/components/site/StarRating";
import { categoryName, formatPrice, timeAgo, type Listing } from "@/lib/data";
import { addReview, reportListing, useAllListings, useExtraReviews, useReports } from "@/lib/store";

export const Route = createFileRoute("/item/$id")({
  head: () => ({
    meta: [
      { title: "Item Details — PasaGamit" },
      { name: "description", content: "See item details, seller ratings, and reviews, then message the seller to arrange a safe campus meetup." },
      { property: "og:title", content: "Item on PasaGamit" },
      { property: "og:description", content: "A pre-loved school item listed by a fellow student on PasaGamit." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ItemPage,
});

function ItemPage() {
  const { id } = Route.useParams();
  const all = useAllListings();
  const listing = all.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="flyer pin p-8">
          <p className="marker text-2xl text-sari">Na-pasa na!</p>
          <h1 className="mt-2 text-3xl">Item not found</h1>
          <p className="mt-2 text-muted-foreground">This listing may have been sold, traded, or taken down.</p>
          <Button asChild className="mt-6">
            <Link to="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const related = all.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm font-bold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="flyer pin relative bg-paper p-3">
          <div className="aspect-square border-2 border-ink">
            <ItemArt category={listing.category} tone={listing.tone} photo={listing.photo} alt={listing.title} label={categoryName(listing.category)} />
          </div>
          <span className="price-tag absolute -right-2 bottom-8 text-4xl">{formatPrice(listing)}</span>
        </div>

        <div>
          <p className="kicker text-sari">{categoryName(listing.category)}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{listing.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <TradeBadge trade={listing.trade} />
            <span className="rounded-sm border-2 border-ink bg-soft px-2 py-0.5 text-xs font-bold">{listing.condition}</span>
            <span className="text-sm text-muted-foreground">Posted {timeAgo(listing.postedAt)}</span>
          </div>

          <p className="drop-cap mt-6 text-lg leading-relaxed">{listing.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y-2 border-ink py-4 text-sm">
            <Meta icon={GraduationCap} label="Course" value={listing.course} />
            <Meta icon={Calendar} label="Year level" value={listing.yearLevel} />
            <Meta icon={MapPin} label="Meetup" value={listing.meetup} />
            <Meta icon={Tag} label="Deal" value={formatPrice(listing)} />
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <InquiryDialog
              listing={listing}
              trigger={
                <Button size="lg">
                  <MessageCircle /> Inquire / Message Seller
                </Button>
              }
            />
            <SaveButton id={listing.id} title={listing.title} className="h-12 w-12" />
            <ReportDialog listing={listing} />
          </div>

          <div className="flyer mt-8 flex items-center gap-4 bg-paper p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-mustard font-display text-xl font-black">
              {listing.seller.name.split(" ").map((p) => p[0]).join("")}
            </div>
            <div className="flex-1">
              <p className="flex items-center gap-1 font-bold">
                {listing.seller.name} <BadgeCheck className="h-4 w-4 text-forest" aria-label="Verified student" />
              </p>
              <p className="text-xs text-muted-foreground">{listing.seller.course} · {listing.seller.deals} successful pasa</p>
              <StarRating value={listing.seller.rating} className="mt-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-3">
        <Reviews listing={listing} />
        <SafetyTips />
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-6 border-b-2 border-ink pb-2 text-3xl">Iba pang {categoryName(listing.category)}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l, i) => (
              <ListingCard key={l.id} listing={l} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof Tag; label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-cork" aria-hidden />
      <div>
        <dt className="kicker text-muted-foreground">{label}</dt>
        <dd className="font-semibold">{value}</dd>
      </div>
    </div>
  );
}

function Reviews({ listing }: { listing: Listing }) {
  const extra = useExtraReviews(listing.id);
  const reviews = [...extra, ...listing.reviews];
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  return (
    <section className="lg:col-span-2" aria-labelledby="reviews-title">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-ink pb-2">
        <h2 id="reviews-title" className="text-3xl">Ratings & Reviews</h2>
        <div className="flex items-center gap-2">
          <StarRating value={avg} />
          <span className="text-sm font-bold">{reviews.length ? avg.toFixed(1) : "—"}</span>
          <span className="text-sm text-muted-foreground">({reviews.length})</span>
        </div>
      </div>

      <ul className="divide-y divide-dashed divide-ink/30">
        {reviews.length === 0 && <li className="py-6 text-muted-foreground">No reviews yet. Be the first after your meetup!</li>}
        {reviews.map((r, i) => (
          <li key={i} className="py-4">
            <div className="flex items-center justify-between">
              <p className="font-bold">{r.author}</p>
              <span className="text-xs text-muted-foreground">{r.date}</span>
            </div>
            <StarRating value={r.rating} />
            <p className="mt-1 text-sm">{r.text}</p>
          </li>
        ))}
      </ul>

      <form
        className="flyer mt-6 space-y-4 bg-paper p-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!rating) return setError("Pick a star rating.");
          if (!name.trim()) return setError("Add your name.");
          if (text.trim().length < 5) return setError("Write a short review (at least 5 characters).");
          addReview(listing.id, { author: name.trim(), rating, text: text.trim(), date: new Date().toISOString().slice(0, 10) });
          setRating(0);
          setName("");
          setText("");
          setError("");
          toast.success("Salamat! Your review is posted.");
        }}
      >
        <h3 className="text-xl">Write a review</h3>
        <StarInput value={rating} onChange={setRating} />
        <div>
          <label htmlFor="rv-name" className="kicker mb-1 block">Name</label>
          <input id="rv-name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="rv-text" className="kicker mb-1 block">Review</label>
          <textarea id="rv-text" className="field min-h-24" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}
        <Button type="submit" variant="ink">Post review</Button>
      </form>
    </section>
  );
}

const REASONS = ["Suspected scam", "Prohibited item", "Wrong category or misleading info", "Offensive content", "Already sold"];

function ReportDialog({ listing }: { listing: Listing }) {
  const reported = useReports().includes(listing.id);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" disabled={reported}>
          <Flag /> {reported ? "Reported" : "Report"}
        </Button>
      </DialogTrigger>
      <DialogContent className="flyer rounded-none sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Report this listing</DialogTitle>
          <DialogDescription>Our student moderators review reports within 24 hours.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reason) return;
            reportListing(listing.id);
            setOpen(false);
            toast("Report submitted", { description: "Salamat for keeping PasaGamit safe." });
          }}
        >
          <fieldset className="space-y-2">
            <legend className="kicker mb-2">Reason</legend>
            {REASONS.map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-3 rounded-sm border-2 border-ink/20 p-2 has-[:checked]:border-sari has-[:checked]:bg-sari/10">
                <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-sari" />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </fieldset>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={!reason}>Submit report</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
