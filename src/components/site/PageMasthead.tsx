import type { ReactNode } from "react";

/** Newspaper-style page header used on every inner page. */
export function PageMasthead({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6">
      <div className="rule-double pt-3">
        <p className="kicker text-sari">{kicker}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
        {children}
      </div>
      <div className="rule-thick mt-6" />
    </header>
  );
}

export function SectionHeading({ kicker, title, action }: { kicker?: string; title: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-2">
      <div>
        {kicker && <p className="marker text-sari text-base">{kicker}</p>}
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
