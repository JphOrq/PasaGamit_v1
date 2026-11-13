import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-4 border-double border-ink bg-ink text-ink-foreground">
      <div className="stripes h-3" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-4xl font-black">
            Pasa<span className="text-sari">Gamit</span>
          </p>
          <p className="mt-2 max-w-sm text-sm opacity-80">
            Ang palengke ng estudyante. Buy, sell, and trade school stuff within your campus — mas mura, mas malapit, mas sustainable.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-sm border-2 border-forest bg-forest px-3 py-1 text-xs font-bold text-forest-foreground">
            <Leaf className="h-4 w-4" aria-hidden /> Every pasa keeps an item out of the landfill.
          </p>
        </div>
        <nav aria-label="Footer: Shop">
          <p className="kicker text-mustard">Palengke</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/marketplace" className="hover:underline">Marketplace</Link></li>
            <li><Link to="/categories" className="hover:underline">Categories</Link></li>
            <li><Link to="/post" className="hover:underline">Post an Item</Link></li>
            <li><Link to="/gallery" className="hover:underline">Gallery</Link></li>
          </ul>
        </nav>
        <nav aria-label="Footer: Community">
          <p className="kicker text-mustard">Komunidad</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/hub" className="hover:underline">Student Hub</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/profile" className="hover:underline">My Profile</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-ink-foreground/20 py-4 text-center text-xs opacity-70">
        © 2026 PasaGamit · Made by students, para sa estudyante.
      </div>
    </footer>
  );
}
