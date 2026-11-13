/**
 * Tiny localStorage-backed store for saved items, posted listings, reviews,
 * reports, and the mock signed-in student. SSR-safe via useSyncExternalStore.
 */
import { useSyncExternalStore } from "react";
import { LISTINGS, type Listing, type Review } from "./data";

const KEYS = {
  saved: "pg:saved",
  posted: "pg:posted",
  reviews: "pg:reviews",
  reports: "pg:reports",
  user: "pg:user",
} as const;
type Key = keyof typeof KEYS;

export interface StudentUser {
  name: string;
  email: string;
  verification: string;
}

interface Shape {
  saved: string[];
  posted: Listing[];
  reviews: Record<string, Review[]>;
  reports: string[];
  user: StudentUser | null;
}

const DEFAULTS: Shape = { saved: [], posted: [], reviews: {}, reports: [], user: null };
const cache: Partial<Shape> = {};
const listeners = new Set<() => void>();

function read<K extends Key>(key: K): Shape[K] {
  if (typeof window === "undefined") return DEFAULTS[key];
  if (key in cache) return cache[key] as Shape[K];
  let value: Shape[K] = DEFAULTS[key];
  try {
    const raw = window.localStorage.getItem(KEYS[key]);
    if (raw) value = JSON.parse(raw);
  } catch {
    /* corrupted storage — fall back to defaults */
  }
  cache[key] = value;
  return value;
}

function write<K extends Key>(key: K, value: Shape[K]) {
  cache[key] = value;
  try {
    window.localStorage.setItem(KEYS[key], JSON.stringify(value));
  } catch {
    /* storage full or blocked — keep in-memory value */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    const k = (Object.keys(KEYS) as Key[]).find((x) => KEYS[x] === e.key);
    if (k) {
      delete cache[k];
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function useKey<K extends Key>(key: K): Shape[K] {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => DEFAULTS[key],
  );
}

/* ---------- Saved items ---------- */
export function useSaved() {
  return useKey("saved");
}
export function toggleSaved(id: string) {
  const s = read("saved");
  const next = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
  write("saved", next);
  return next.includes(id);
}

/* ---------- Listings (mock + posted) ---------- */
export function usePosted() {
  return useKey("posted");
}
export function useAllListings(): Listing[] {
  const posted = usePosted();
  return posted.length ? [...posted, ...LISTINGS] : LISTINGS;
}
export function addListing(l: Listing) {
  write("posted", [l, ...read("posted")]);
}
export function removeListing(id: string) {
  write(
    "posted",
    read("posted").filter((l) => l.id !== id),
  );
}

/* ---------- Reviews ---------- */
export function useExtraReviews(id: string): Review[] {
  return useKey("reviews")[id] ?? EMPTY;
}
const EMPTY: Review[] = [];
export function addReview(id: string, r: Review) {
  const all = read("reviews");
  write("reviews", { ...all, [id]: [r, ...(all[id] ?? [])] });
}

/* ---------- Reports ---------- */
export function useReports() {
  return useKey("reports");
}
export function reportListing(id: string) {
  const r = read("reports");
  if (!r.includes(id)) write("reports", [...r, id]);
}

/* ---------- Mock auth ---------- */
export function useUser() {
  return useKey("user");
}
export function signIn(u: StudentUser) {
  write("user", u);
}
export function signOut() {
  write("user", null);
}
