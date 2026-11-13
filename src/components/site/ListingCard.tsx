import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";
import { ItemArt } from "./ItemArt";
import { formatPrice, TRADE_LABELS, timeAgo, type Listing } from "@/lib/data";
import { toggleSaved, useSaved } from "@/lib/store";
import { cn } from "@/lib/utils";

const TILTS = ["md:rotate-[-1deg]", "md:rotate-[0.8deg]", "md:rotate-[-0.4deg]", "md:rotate-[1.2deg]"];

export function SaveButton({ id, title, className }: { id: string; title: string; className?: string }) {
  const saved = useSaved().includes(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const now = toggleSaved(id);
        toast(now ? "Saved to your list" : "Removed from saved", { description: title });
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved items` : `Save ${title}`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink transition-transform hover:scale-110",
        saved && "bg-sari text-primary-foreground",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-current")} />
    </button>
  );
}

export function TradeBadge({ trade, className }: { trade: Listing["trade"]; className?: string }) {
  const style =
    trade === "free"
      ? "bg-forest text-forest-foreground"
      : trade === "trade" || trade === "sell-or-trade"
        ? "bg-paper text-forest border-forest"
        : "bg-ink text-ink-foreground";
  return (
    <span className={cn("kicker inline-block rounded-sm border-2 border-ink px-2 py-0.5 text-[0.65rem]", style, className)}>
      {TRADE_LABELS[trade]}
    </span>
  );
}

export function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  return (
    <article className={cn("flyer flyer-hover pin group flex flex-col", TILTS[index % TILTS.length])}>
      <Link
        to="/item/$id"
        params={{ id: listing.id }}
        className="flex flex-1 flex-col focus-visible:outline-offset-4"
        aria-label={`${listing.title}, ${formatPrice(listing)}`}
      >
        <div className="relative aspect-[4/3] border-b-2 border-ink">
          <ItemArt category={listing.category} tone={listing.tone} photo={listing.photo} alt={listing.title} />
          <span className="price-tag absolute -bottom-4 left-3 text-lg">{formatPrice(listing)}</span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4 pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <TradeBadge trade={listing.trade} />
            <span className="text-xs text-muted-foreground">{listing.condition}</span>
          </div>
          <h3 className="text-lg leading-tight group-hover:underline decoration-sari decoration-2 underline-offset-2">
            {listing.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {listing.course} · {listing.yearLevel}
          </p>
          <div className="mt-auto flex items-center justify-between border-t border-dashed border-ink/30 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden /> {listing.meetup}
            </span>
            <span>{timeAgo(listing.postedAt)}</span>
          </div>
        </div>
      </Link>
      <SaveButton id={listing.id} title={listing.title} className="absolute top-3 right-3" />
    </article>
  );
}
