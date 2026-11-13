import { Backpack, BookOpen, Calculator, FlaskConical, PencilRuler, Shirt, type LucideIcon } from "lucide-react";
import type { CategorySlug, Tone } from "@/lib/data";
import { cn } from "@/lib/utils";

export const CATEGORY_ICONS: Record<CategorySlug, LucideIcon> = {
  textbooks: BookOpen,
  uniforms: Shirt,
  gadgets: Calculator,
  supplies: PencilRuler,
  lab: FlaskConical,
  personal: Backpack,
};

export const TONE_BG: Record<Tone, string> = {
  sari: "bg-sari text-primary-foreground",
  mustard: "bg-mustard text-mustard-foreground",
  forest: "bg-forest text-forest-foreground",
  cork: "bg-cork text-cork-foreground",
  ink: "bg-ink text-ink-foreground",
};

/** Placeholder illustration: tone block + halftone + category icon (no external images). */
export function ItemArt({
  category,
  tone,
  photo,
  alt,
  className,
  label,
}: {
  category: CategorySlug;
  tone: Tone;
  photo?: string;
  alt: string;
  className?: string;
  label?: string;
}) {
  if (photo) {
    return <img src={photo} alt={alt} className={cn("h-full w-full object-cover", className)} />;
  }
  const Icon = CATEGORY_ICONS[category] ?? BookOpen;
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", TONE_BG[tone], className)}
    >
      <div className="halftone absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full border-[10px] border-current opacity-15" aria-hidden />
      <div className="absolute top-3 left-3 h-10 w-10 rotate-12 border-4 border-current opacity-15" aria-hidden />
      <Icon className="relative h-1/3 w-1/3 min-h-12 min-w-12 drop-shadow-[3px_3px_0_rgb(0_0_0_/_0.25)]" strokeWidth={1.6} aria-hidden />
      {label && <span className="marker absolute bottom-2 left-3 text-sm opacity-90">{label}</span>}
    </div>
  );
}
