import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ImagePlus, Trash2 } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageMasthead } from "@/components/site/PageMasthead";
import { SafetyTips } from "@/components/site/SafetyTips";
import { ItemArt } from "@/components/site/ItemArt";
import { CATEGORIES, CONDITIONS, COURSES, TRADE_LABELS, YEAR_LEVELS, formatPrice, type CategorySlug, type Condition, type Listing, type TradePref } from "@/lib/data";
import { addListing, useUser } from "@/lib/store";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Post an Item — PasaGamit" },
      { name: "description", content: "List a textbook, uniform, gadget, or school supply for sale, trade, or free in under a minute." },
      { property: "og:title", content: "Post an Item on PasaGamit" },
      { property: "og:description", content: "Ipasa mo na! List your pre-loved school items for fellow students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostItem,
});

interface FormState {
  title: string;
  description: string;
  price: string;
  condition: Condition | "";
  category: CategorySlug | "";
  course: string;
  yearLevel: string;
  trade: TradePref;
  meetup: string;
}

const INITIAL: FormState = {
  title: "",
  description: "",
  price: "",
  condition: "",
  category: "",
  course: "Any course",
  yearLevel: "Any year",
  trade: "sell",
  meetup: "Main Library lobby",
};

/** Downscale uploaded photo so it fits comfortably in localStorage. */
function resizeImage(file: File, max = 720): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function PostItem() {
  const navigate = useNavigate();
  const user = useUser();
  const [f, setF] = useState<FormState>(INITIAL);
  const [photo, setPhoto] = useState<string>();
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "photo", string>>>({});

  const upd = (k: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErrors((x) => ({ ...x, photo: "Please choose an image file." }));
    if (file.size > 8 * 1024 * 1024) return setErrors((x) => ({ ...x, photo: "Image must be under 8MB." }));
    setErrors((x) => ({ ...x, photo: undefined }));
    setPhoto(await resizeImage(file));
  };

  const priceNeeded = f.trade === "sell" || f.trade === "sell-or-trade";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (f.title.trim().length < 4) err.title = "Title should be at least 4 characters.";
    if (f.description.trim().length < 15) err.description = "Describe the item in at least 15 characters.";
    if (!f.category) err.category = "Choose a category.";
    if (!f.condition) err.condition = "Choose the condition.";
    const price = Number(f.price || 0);
    if (priceNeeded && (!f.price || !Number.isFinite(price) || price <= 0)) err.price = "Enter a price above ₱0.";
    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(`p-${Object.keys(err)[0]}`)?.focus();
      return;
    }
    const tones = { textbooks: "sari", uniforms: "forest", gadgets: "ink", supplies: "mustard", lab: "cork", personal: "sari" } as const;
    const listing: Listing = {
      id: `u${Date.now()}`,
      title: f.title.trim(),
      description: f.description.trim(),
      price: f.trade === "free" ? 0 : price,
      trade: f.trade,
      condition: f.condition as Condition,
      category: f.category as CategorySlug,
      course: f.course,
      yearLevel: f.yearLevel,
      seller: { name: user?.name ?? "Juan Dela Cruz", course: "BS Computer Science 3", rating: 4.8, deals: 12 },
      meetup: f.meetup,
      postedAt: new Date().toISOString(),
      tone: tones[f.category as CategorySlug],
      photo,
      reviews: [],
    };
    try {
      addListing(listing);
    } catch {
      toast.error("Couldn't save — try a smaller photo.");
      return;
    }
    toast.success("Naipost na! Your item is now on the marketplace.");
    navigate({ to: "/item/$id", params: { id: listing.id } });
  };

  const preview = {
    title: f.title || "Your item title",
    price: Number(f.price || 0),
    trade: f.trade,
  };

  return (
    <>
      <PageMasthead kicker="Ipasa Mo Na" title="Post an Item" subtitle="Fill out your flyer. It goes straight to the Marketplace board." />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} noValidate className="flyer space-y-6 bg-paper p-6 sm:p-8" aria-label="Post an item">
          <Field id="p-title" label="Item title" error={errors.title}>
            <input id="p-title" className="field" value={f.title} onChange={upd("title")} placeholder="e.g. Casio fx-991EX Calculator" aria-invalid={!!errors.title} aria-describedby={errors.title ? "p-title-err" : undefined} />
          </Field>

          <Field id="p-description" label="Description" error={errors.description}>
            <textarea id="p-description" className="field min-h-32" value={f.description} onChange={upd("description")} placeholder="Condition details, inclusions, reason for selling…" aria-invalid={!!errors.description} aria-describedby={errors.description ? "p-description-err" : undefined} />
          </Field>

          {/* Photo upload with preview */}
          <div>
            <span className="kicker mb-1 block">Photo</span>
            <div className="flex flex-wrap items-center gap-4">
              <label htmlFor="p-photo" className="flex h-36 w-36 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-ink bg-newsprint text-center text-xs font-bold hover:bg-mustard/30 focus-within:outline focus-within:outline-3 focus-within:outline-sari">
                {photo ? (
                  <img src={photo} alt="Preview of your uploaded item" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8" aria-hidden /> Upload photo
                  </>
                )}
                <input id="p-photo" type="file" accept="image/*" className="sr-only" onChange={onPhoto} />
              </label>
              {photo && (
                <Button type="button" variant="outline" size="sm" onClick={() => setPhoto(undefined)}>
                  <Trash2 /> Remove photo
                </Button>
              )}
              <p className="max-w-xs text-xs text-muted-foreground">Clear, well-lit photos get 3x more inquiries. No photo? We'll make a flyer graphic for you.</p>
            </div>
            {errors.photo && <p role="alert" className="mt-1 text-sm font-semibold text-destructive">{errors.photo}</p>}
          </div>

          <fieldset>
            <legend className="kicker mb-2">Trade preference</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(TRADE_LABELS) as TradePref[]).map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2 rounded-sm border-2 border-ink p-2 text-sm font-semibold has-[:checked]:bg-ink has-[:checked]:text-ink-foreground">
                  <input type="radio" name="trade" value={t} checked={f.trade === t} onChange={upd("trade")} className="accent-sari" />
                  {TRADE_LABELS[t]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="p-price" label={priceNeeded ? "Price (₱)" : "Price (₱) — optional"} error={errors.price}>
              <input id="p-price" type="number" min={0} inputMode="numeric" className="field" value={f.trade === "free" ? "" : f.price} disabled={f.trade === "free"} onChange={upd("price")} placeholder={f.trade === "free" ? "Libre!" : "0"} aria-invalid={!!errors.price} aria-describedby={errors.price ? "p-price-err" : undefined} />
            </Field>
            <Field id="p-condition" label="Condition" error={errors.condition}>
              <select id="p-condition" className="field" value={f.condition} onChange={upd("condition")} aria-invalid={!!errors.condition} aria-describedby={errors.condition ? "p-condition-err" : undefined}>
                <option value="">Select condition</option>
                {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field id="p-category" label="Category" error={errors.category}>
              <select id="p-category" className="field" value={f.category} onChange={upd("category")} aria-invalid={!!errors.category} aria-describedby={errors.category ? "p-category-err" : undefined}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field id="p-course" label="Course">
              <select id="p-course" className="field" value={f.course} onChange={upd("course")}>
                {COURSES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field id="p-year" label="Year level">
              <select id="p-year" className="field" value={f.yearLevel} onChange={upd("yearLevel")}>
                {YEAR_LEVELS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field id="p-meetup" label="Preferred meetup spot">
              <select id="p-meetup" className="field" value={f.meetup} onChange={upd("meetup")}>
                {["Main Library lobby", "Gym entrance", "Main gate guardhouse", "Student Center", "Science Bldg lobby"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap gap-3 border-t-2 border-ink pt-6">
            <Button type="submit" size="lg">Post to Marketplace</Button>
            <Button type="button" variant="outline" size="lg" onClick={() => { setF(INITIAL); setPhoto(undefined); setErrors({}); }}>Clear form</Button>
          </div>
        </form>

        <div className="space-y-8">
          <div>
            <p className="marker mb-3 text-sari">Live preview</p>
            <div className="flyer pin relative rotate-1 bg-paper">
              <div className="relative aspect-[4/3] border-b-2 border-ink">
                <ItemArt category={(f.category || "textbooks") as CategorySlug} tone="mustard" photo={photo} alt="Preview" />
                <span className="price-tag absolute -bottom-4 left-3 text-lg">{formatPrice(preview)}</span>
              </div>
              <div className="p-4 pt-6">
                <p className="font-display text-lg font-bold">{preview.title}</p>
                <p className="text-xs text-muted-foreground">{f.course} · {f.yearLevel}</p>
              </div>
            </div>
          </div>
          <SafetyTips />
        </div>
      </div>
    </>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="kicker mb-1 block">{label}</label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm font-semibold text-destructive">{error}</p>}
    </div>
  );
}
