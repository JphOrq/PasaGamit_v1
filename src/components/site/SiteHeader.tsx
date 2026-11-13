import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Heart, Menu, Plus, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS } from "@/lib/data";
import { useSaved, useUser } from "@/lib/store";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/categories", label: "Categories" },
  { to: "/hub", label: "Student Hub" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/profile", label: "My Profile" },
] as const;

const TICKER = [
  "Pasa-Libro Day ngayong Sabado sa Quadrangle",
  "fx-991EX bumaba sa ₱950",
  "60 PE uniforms naipasa nang libre",
  "Bagong Pasa Points: Library, Gym, Main Gate",
  "Mag-post ng item sa loob ng isang minuto",
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex flex-col leading-none ${className}`} aria-label="PasaGamit home">
      <span className="font-display text-3xl font-black tracking-tight sm:text-4xl">
        Pasa<span className="text-sari">Gamit</span>
      </span>
      <span className="marker text-xs text-cork">ang palengke ng estudyante</span>
    </Link>
  );
}

function Notifications() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const unread = items.filter((n) => n.unread).length;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-paper hover:bg-mustard"
          aria-label={`Notifications, ${unread} unread`}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-sari px-1 text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-none border-2 border-ink bg-paper p-0 shadow-flyer">
        <div className="flex items-center justify-between bg-ink px-3 py-2 text-ink-foreground">
          <DropdownMenuLabel className="p-0 font-display text-base">Balita para sa'yo</DropdownMenuLabel>
          <button
            className="text-xs underline"
            onClick={(e) => {
              e.preventDefault();
              setItems((xs) => xs.map((n) => ({ ...n, unread: false })));
            }}
          >
            Mark all read
          </button>
        </div>
        {items.map((n, i) => (
          <div key={n.id}>
            {i > 0 && <DropdownMenuSeparator className="m-0" />}
            <DropdownMenuItem className="flex items-start gap-2 rounded-none px-3 py-3 focus:bg-mustard/40">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-sari" : "bg-transparent"}`} aria-hidden />
              <span className="flex-1">
                <span className="block text-sm">{n.text}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </span>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const saved = useSaved();
  const user = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-4 border-double border-ink bg-newsprint/95 backdrop-blur">
      {/* News ticker */}
      <div className="overflow-hidden bg-ink py-1.5 text-ink-foreground" aria-label="Campus headlines">
        <div className="animate-ticker flex w-max gap-10 whitespace-nowrap text-xs font-semibold tracking-wide">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-10" aria-hidden={i >= TICKER.length}>
              <span>
                <span className="marker mr-2 text-mustard">BALITA!</span>
                {t}
              </span>
              <span className="text-sari">★</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="rounded-sm px-2.5 py-2 text-sm font-semibold hover:bg-mustard/50 data-[status=active]:bg-ink data-[status=active]:text-ink-foreground"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Notifications />
          <Link
            to="/profile"
            hash="saved"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-paper hover:bg-mustard sm:flex"
            aria-label={`Saved items, ${saved.length}`}
          >
            <Heart className="h-4 w-4" />
            {saved.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-mustard px-1 text-[10px] font-bold">
                {saved.length}
              </span>
            )}
          </Link>
          <Link
            to="/login"
            className="hidden h-10 items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 text-sm font-semibold hover:bg-mustard md:inline-flex"
          >
            <UserRound className="h-4 w-4" aria-hidden />
            {user ? user.name.split(" ")[0] : "Login"}
          </Link>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/post">
              <Plus /> Post an Item
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-l-4 border-ink bg-newsprint">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">
                  Pasa<span className="text-sari">Gamit</span>
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-4 px-4">
                <ul className="space-y-1">
                  {[...NAV, { to: "/gallery", label: "Gallery" } as const, { to: "/login", label: user ? "Account" : "Login / Register" } as const].map((n) => (
                    <li key={n.to}>
                      <Link
                        to={n.to}
                        onClick={() => setOpen(false)}
                        activeOptions={{ exact: n.to === "/" }}
                        className="block border-b border-dashed border-ink/30 px-2 py-3 font-display text-xl font-bold data-[status=active]:text-sari"
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link to="/post" onClick={() => setOpen(false)}>
                    <Plus /> Post an Item
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
