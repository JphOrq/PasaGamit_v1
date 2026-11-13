/**
 * PasaGamit mock data. Everything here is sample content — no backend.
 * Newly posted listings live in localStorage (see store.ts) and are merged in.
 */

export type CategorySlug = "textbooks" | "uniforms" | "gadgets" | "supplies" | "lab" | "personal";
export type Condition = "Brand New" | "Like New" | "Good" | "Fair";
export type TradePref = "sell" | "trade" | "sell-or-trade" | "free";
export type Tone = "sari" | "mustard" | "forest" | "cork" | "ink";

export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  trade: TradePref;
  condition: Condition;
  category: CategorySlug;
  course: string;
  yearLevel: string;
  seller: { name: string; course: string; rating: number; deals: number };
  meetup: string;
  postedAt: string;
  featured?: boolean;
  trending?: boolean;
  tone: Tone;
  photo?: string;
  reviews: Review[];
}

export const CATEGORIES: {
  slug: CategorySlug;
  name: string;
  tagalog: string;
  blurb: string;
  tone: Tone;
}[] = [
  { slug: "textbooks", name: "Textbooks", tagalog: "Mga Libro", blurb: "Reviewers, references, and pre-loved required readings.", tone: "sari" },
  { slug: "uniforms", name: "Uniforms", tagalog: "Uniporme", blurb: "PE shirts, lab gowns, org shirts, and department uniforms.", tone: "forest" },
  { slug: "gadgets", name: "Gadgets", tagalog: "Gadyet", blurb: "Calculators, tablets, earphones, and laptop gear.", tone: "ink" },
  { slug: "supplies", name: "School Supplies", tagalog: "Gamit Pang-eskwela", blurb: "Drafting tools, art kits, notebooks, and bond paper.", tone: "mustard" },
  { slug: "lab", name: "Laboratory Equipment", tagalog: "Gamit sa Lab", blurb: "Goggles, dissecting kits, stethoscopes, and lab coats.", tone: "cork" },
  { slug: "personal", name: "Personal Items", tagalog: "Personal na Gamit", blurb: "Bags, umbrellas, tumblers, and dorm essentials.", tone: "sari" },
];

export const COURSES = [
  "Any course",
  "BS Nursing",
  "BS Civil Engineering",
  "BS Computer Science",
  "BS Accountancy",
  "BS Biology",
  "BA Communication",
  "BS Education",
  "BS Architecture",
];

export const YEAR_LEVELS = ["Any year", "1st Year", "2nd Year", "3rd Year", "4th Year"];
export const CONDITIONS: Condition[] = ["Brand New", "Like New", "Good", "Fair"];
export const TRADE_LABELS: Record<TradePref, string> = {
  sell: "For Sale",
  trade: "For Trade",
  "sell-or-trade": "Sell or Trade",
  free: "Libre / Free",
};

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Fundamentals of Nursing (Kozier, 10th ed.)",
    description: "Complete, with highlights only on Units 1–4. No torn pages. Perfect for NCM 100. Comes with my handwritten reviewer notes as a bonus.",
    price: 850,
    trade: "sell",
    condition: "Good",
    category: "textbooks",
    course: "BS Nursing",
    yearLevel: "1st Year",
    seller: { name: "Bea Santos", course: "BS Nursing 3", rating: 4.9, deals: 18 },
    meetup: "Main Library lobby",
    postedAt: "2026-11-13T08:10:00Z",
    featured: true,
    trending: true,
    tone: "sari",
    reviews: [
      { author: "Mika R.", rating: 5, text: "Exactly as described. Ate Bea even threw in extra notes!", date: "2026-10-02" },
      { author: "Joel D.", rating: 5, text: "Fast reply, on time sa meetup.", date: "2026-09-14" },
    ],
  },
  {
    id: "l2",
    title: "Casio fx-991EX ClassWiz Calculator",
    description: "Engineering-approved. Used for one sem only, still with case and manual. Solar + battery working perfectly.",
    price: 950,
    trade: "sell-or-trade",
    condition: "Like New",
    category: "gadgets",
    course: "BS Civil Engineering",
    yearLevel: "Any year",
    seller: { name: "Carlo Reyes", course: "BS CE 4", rating: 4.8, deals: 25 },
    meetup: "Engineering Bldg, 2nd floor",
    postedAt: "2026-11-13T05:30:00Z",
    featured: true,
    trending: true,
    tone: "ink",
    reviews: [{ author: "Anne P.", rating: 5, text: "Legit and super linis. Salamat kuya!", date: "2026-10-20" }],
  },
  {
    id: "l3",
    title: "PE Uniform Set (Medium) – Shirt & Jogging Pants",
    description: "Official university PE set. Washed and ironed. Lumiit na sa akin kaya ipapasa ko na.",
    price: 350,
    trade: "sell",
    condition: "Good",
    category: "uniforms",
    course: "Any course",
    yearLevel: "1st Year",
    seller: { name: "Janelle Cruz", course: "BA Comm 2", rating: 4.7, deals: 6 },
    meetup: "Gym entrance",
    postedAt: "2026-11-12T13:00:00Z",
    trending: true,
    tone: "forest",
    reviews: [],
  },
  {
    id: "l4",
    title: "Complete Drafting Kit + T-Square",
    description: "Includes T-square, triangles, French curves, compass set, and mechanical pencils. For Engineering Drawing 1 and Archi plates.",
    price: 0,
    trade: "free",
    condition: "Fair",
    category: "supplies",
    course: "BS Architecture",
    yearLevel: "1st Year",
    seller: { name: "Miguel Tan", course: "BS Archi 5", rating: 5, deals: 11 },
    meetup: "Archi studio, Room 304",
    postedAt: "2026-11-12T09:45:00Z",
    featured: true,
    tone: "mustard",
    reviews: [{ author: "Kat L.", rating: 5, text: "Libre talaga! Sobrang bait ni kuya Miguel.", date: "2026-08-30" }],
  },
  {
    id: "l5",
    title: "Littmann Classic III Stethoscope",
    description: "Black edition, original with box. Diaphragm in excellent condition. Upgrading to Cardiology IV.",
    price: 4200,
    trade: "sell",
    condition: "Like New",
    category: "lab",
    course: "BS Nursing",
    yearLevel: "2nd Year",
    seller: { name: "Patricia Lim", course: "BS Nursing 4", rating: 4.9, deals: 9 },
    meetup: "CHS Building lobby",
    postedAt: "2026-11-11T16:20:00Z",
    trending: true,
    tone: "cork",
    reviews: [],
  },
  {
    id: "l6",
    title: "Financial Accounting Vol. 1 & 2 (Valix)",
    description: "Both volumes, 2024 edition. Some pencil answers on the problems — erasable. Great for FAR review.",
    price: 600,
    trade: "sell-or-trade",
    condition: "Good",
    category: "textbooks",
    course: "BS Accountancy",
    yearLevel: "2nd Year",
    seller: { name: "Rafael Gomez", course: "BSA 3", rating: 4.6, deals: 14 },
    meetup: "CBA canteen",
    postedAt: "2026-11-11T10:00:00Z",
    tone: "sari",
    reviews: [{ author: "Lea M.", rating: 4, text: "Medyo may sulat pero okay naman. Fair price.", date: "2026-07-21" }],
  },
  {
    id: "l7",
    title: "Lab Gown (Small) + Safety Goggles",
    description: "Long-sleeved white lab gown with the university patch, plus anti-fog goggles. For Chem and Bio labs.",
    price: 280,
    trade: "sell",
    condition: "Good",
    category: "lab",
    course: "BS Biology",
    yearLevel: "1st Year",
    seller: { name: "Sofia Navarro", course: "BS Bio 3", rating: 4.8, deals: 7 },
    meetup: "Science Bldg, ground floor",
    postedAt: "2026-11-10T14:15:00Z",
    tone: "forest",
    reviews: [],
  },
  {
    id: "l8",
    title: "Logitech Wireless Mouse & Keyboard Combo",
    description: "MK270 combo. Works perfectly, comes with the USB receiver. Ideal for coding sa dorm.",
    price: 650,
    trade: "trade",
    condition: "Good",
    category: "gadgets",
    course: "BS Computer Science",
    yearLevel: "Any year",
    seller: { name: "Andrei Villanueva", course: "BSCS 3", rating: 4.5, deals: 4 },
    meetup: "CCS lounge",
    postedAt: "2026-11-10T08:00:00Z",
    trending: true,
    tone: "ink",
    reviews: [],
  },
  {
    id: "l9",
    title: "Student Teaching Uniform (Female, Size 8)",
    description: "Blouse and skirt set for practice teaching. Worn only during demo weeks. Dry-cleaned.",
    price: 500,
    trade: "sell",
    condition: "Like New",
    category: "uniforms",
    course: "BS Education",
    yearLevel: "4th Year",
    seller: { name: "Grace Mendoza", course: "BSEd Graduate", rating: 5, deals: 3 },
    meetup: "CoEd building",
    postedAt: "2026-11-09T11:30:00Z",
    tone: "forest",
    reviews: [],
  },
  {
    id: "l10",
    title: "Waterproof Laptop Backpack (15.6\")",
    description: "Navy blue, with USB charging port. Strong pa ang zipper. Selling because I got a new one for my birthday.",
    price: 750,
    trade: "sell-or-trade",
    condition: "Good",
    category: "personal",
    course: "Any course",
    yearLevel: "Any year",
    seller: { name: "Kevin Bautista", course: "BSIT 2", rating: 4.4, deals: 5 },
    meetup: "Main gate guardhouse",
    postedAt: "2026-11-09T07:10:00Z",
    tone: "sari",
    reviews: [],
  },
  {
    id: "l11",
    title: "Highlighters, Sticky Tabs & Bond Paper Bundle",
    description: "Leftover supplies from last sem: 6 highlighters, 4 packs sticky tabs, 1 ream A4 bond paper. Kunin mo na lahat!",
    price: 150,
    trade: "sell",
    condition: "Brand New",
    category: "supplies",
    course: "Any course",
    yearLevel: "Any year",
    seller: { name: "Nicole Ramos", course: "BA Comm 4", rating: 4.9, deals: 21 },
    meetup: "Student Center",
    postedAt: "2026-11-08T15:00:00Z",
    featured: true,
    tone: "mustard",
    reviews: [{ author: "Paolo G.", rating: 5, text: "Sulit na sulit! Brand new pa talaga.", date: "2026-10-11" }],
  },
  {
    id: "l12",
    title: "Dissecting Kit (12-piece, stainless)",
    description: "Complete set with scalpel holder, forceps, probes, and scissors in a zip case. Sanitized.",
    price: 0,
    trade: "trade",
    condition: "Good",
    category: "lab",
    course: "BS Biology",
    yearLevel: "2nd Year",
    seller: { name: "Luis Fernandez", course: "BS Bio 4", rating: 4.7, deals: 8 },
    meetup: "Science Bldg, Room 210",
    postedAt: "2026-11-07T12:00:00Z",
    tone: "cork",
    reviews: [],
  },
  {
    id: "l13",
    title: "Intro to Programming with Python (Reviewer + Book)",
    description: "Book plus printed reviewer with solved exercises for CS 101. Pang-trade ko sa Data Structures book.",
    price: 400,
    trade: "sell-or-trade",
    condition: "Good",
    category: "textbooks",
    course: "BS Computer Science",
    yearLevel: "1st Year",
    seller: { name: "Andrei Villanueva", course: "BSCS 3", rating: 4.5, deals: 4 },
    meetup: "CCS lounge",
    postedAt: "2026-11-06T09:00:00Z",
    tone: "sari",
    reviews: [],
  },
  {
    id: "l14",
    title: "Stainless Tumbler + Foldable Umbrella",
    description: "Hindi na kailangan bumili ng bote ng tubig araw-araw. Umbrella is auto-open, fits in any bag.",
    price: 0,
    trade: "free",
    condition: "Good",
    category: "personal",
    course: "Any course",
    yearLevel: "Any year",
    seller: { name: "Bea Santos", course: "BS Nursing 3", rating: 4.9, deals: 18 },
    meetup: "Main Library lobby",
    postedAt: "2026-11-05T10:20:00Z",
    tone: "forest",
    reviews: [],
  },
];

export const ANNOUNCEMENTS = [
  { date: "Nov 15", title: "Pasa-Libro Day sa Quadrangle", body: "Bring your old textbooks this Saturday, 9AM–3PM. Swap one, take one — walang bayad." },
  { date: "Nov 20", title: "Uniform Drive for Freshies", body: "Donate outgrown PE and dept uniforms at the Student Council office. Forest-green tag = free." },
  { date: "Dec 01", title: "New Safe Meetup Spots", body: "Security added three CCTV-covered Pasa Points: Library lobby, Gym entrance, and Main gate." },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "Carlo replied to your inquiry about the fx-991EX.", time: "5 min ago", unread: true },
  { id: "n2", text: "Price drop! Valix Financial Accounting is now ₱600.", time: "1 hr ago", unread: true },
  { id: "n3", text: "New listing in Textbooks matching \"Nursing\".", time: "3 hrs ago", unread: true },
  { id: "n4", text: "Pasa-Libro Day is this Saturday at the Quadrangle.", time: "Yesterday", unread: false },
];

export const SAFETY_TIPS = [
  "Meet only at CCTV-covered Pasa Points inside campus, during daytime.",
  "Inspect the item before paying. Test calculators and gadgets on the spot.",
  "Prefer cash or GCash upon meetup — never send a downpayment to strangers.",
  "Bring a friend or blockmate if you can.",
  "Report suspicious listings with the flag button. Admins review within 24 hours.",
];

export const HUB_BOARDS = [
  { name: "Book Swap Corner", posts: 312, desc: "Find who's trading the readings you need." },
  { name: "Freshie Survival Tips", posts: 198, desc: "Ate and Kuya advice for 1st years." },
  { name: "Thesis & Research Help", posts: 156, desc: "Looking for respondents, lab partners, or mentors." },
  { name: "Lost & Found", posts: 87, desc: "Naiwan mo ba? Check here first." },
];

export const HUB_GROUPS = [
  { name: "Nursing Pasa Circle", members: 482, tone: "sari" as Tone },
  { name: "Engineering Tool Library", members: 356, tone: "ink" as Tone },
  { name: "Zero-Waste Campus", members: 271, tone: "forest" as Tone },
  { name: "Archi Plates Exchange", members: 140, tone: "mustard" as Tone },
];

export const HUB_POSTS = [
  { author: "Mika R.", course: "BS Nursing 1", board: "Book Swap Corner", time: "2h", text: "May nag-iipon ba ng Anatomy & Physiology (Marieb)? Trade ko for Kozier + reviewer notes.", replies: 12, likes: 34 },
  { author: "Carlo Reyes", course: "BS CE 4", board: "Freshie Survival Tips", time: "5h", text: "PSA: Hindi niyo kailangan bumili ng bagong fx-991. Marami sa PasaGamit na halos bago pa. Save your allowance!", replies: 27, likes: 118 },
  { author: "Sofia Navarro", course: "BS Bio 3", board: "Thesis & Research Help", time: "1d", text: "Looking for 40 respondents for our survey on campus plastic use. 5 minutes lang po! Link in replies.", replies: 9, likes: 21 },
  { author: "Kevin Bautista", course: "BSIT 2", board: "Lost & Found", time: "2d", text: "Found a blue tumbler near CCS lounge. Naka-sticker ng cat. Claim at the guardhouse.", replies: 4, likes: 15 },
];

export const PROFILE = {
  name: "Juan Dela Cruz",
  email: "juan.delacruz@university.edu.ph",
  studentId: "2023-01456",
  course: "BS Computer Science",
  yearLevel: "3rd Year",
  campus: "Main Campus",
  memberSince: "August 2023",
  rating: 4.8,
  deals: 12,
  transactions: [
    { date: "2026-11-02", item: "Discrete Math (Rosen)", with: "Lea M.", type: "Bought", amount: 450 },
    { date: "2026-10-18", item: "Arduino Starter Kit", with: "Andrei V.", type: "Traded", amount: 0 },
    { date: "2026-09-27", item: "Org Shirt (L)", with: "Janelle C.", type: "Sold", amount: 200 },
    { date: "2026-09-05", item: "Graphing Paper Bundle", with: "Nicole R.", type: "Free", amount: 0 },
  ],
};

export const GALLERY_STORIES = [
  { title: "Kozier passed down 3 batches", quote: "Same book, four owners, zero waste.", tone: "sari" as Tone, category: "textbooks" as CategorySlug },
  { title: "Engineering calculators reunited", quote: "Saved ₱1,200 on my fx-991. Sulit!", tone: "ink" as Tone, category: "gadgets" as CategorySlug },
  { title: "Freshie uniform drive", quote: "60 PE sets given away for free.", tone: "forest" as Tone, category: "uniforms" as CategorySlug },
  { title: "Archi kit tradition", quote: "My drafting kit came from a 5th year.", tone: "mustard" as Tone, category: "supplies" as CategorySlug },
  { title: "Lab gown exchange", quote: "Swapped sizes in five minutes.", tone: "cork" as Tone, category: "lab" as CategorySlug },
  { title: "Dorm move-out sale", quote: "Umbrellas, tumblers, and bags found new homes.", tone: "sari" as Tone, category: "personal" as CategorySlug },
];

export function formatPrice(l: Pick<Listing, "price" | "trade">) {
  if (l.trade === "free") return "LIBRE";
  if (l.trade === "trade" && l.price === 0) return "TRADE";
  return `₱${l.price.toLocaleString("en-PH")}`;
}

export function categoryName(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function timeAgo(iso: string, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
}

/** Filters used by the marketplace page. Exported for tests. */
export interface ListingFilters {
  q?: string;
  category?: string;
  course?: string;
  year?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  trade?: string;
}

export function filterListings(list: Listing[], f: ListingFilters) {
  const q = f.q?.trim().toLowerCase();
  return list.filter((l) => {
    if (q && !`${l.title} ${l.description} ${l.course}`.toLowerCase().includes(q)) return false;
    if (f.category && l.category !== f.category) return false;
    if (f.course && f.course !== "Any course" && l.course !== f.course && l.course !== "Any course") return false;
    if (f.year && f.year !== "Any year" && l.yearLevel !== f.year && l.yearLevel !== "Any year") return false;
    if (f.condition && l.condition !== f.condition) return false;
    if (f.trade === "trade" && l.trade !== "trade" && l.trade !== "sell-or-trade") return false;
    if (f.trade === "free" && l.trade !== "free") return false;
    if (f.minPrice != null && l.price < f.minPrice) return false;
    if (f.maxPrice != null && l.price > f.maxPrice) return false;
    return true;
  });
}
