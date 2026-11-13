import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, LogOut } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isValidStudentVerification } from "@/lib/validation";
import { signIn, signOut, useUser } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Register — PasaGamit" },
      { name: "description", content: "Sign in or create your verified student account with your school email or student ID." },
      { property: "og:title", content: "Join PasaGamit" },
      { property: "og:description", content: "Verified students only. Sign up with your school email or student ID." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

const TAB = "flex-1 rounded-none border-2 border-ink py-2 font-bold data-[state=active]:bg-ink data-[state=active]:text-ink-foreground";

function Login() {
  const user = useUser();
  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="flyer pin bg-paper p-8 text-center">
          <BadgeCheck className="mx-auto h-12 w-12 text-forest" aria-hidden />
          <h1 className="mt-2 text-3xl">Hello, {user.name.split(" ")[0]}!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Verified via {user.verification}</p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild><Link to="/profile">Go to My Profile</Link></Button>
            <Button variant="outline" onClick={() => { signOut(); toast("Signed out"); }}><LogOut /> Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
      <div className="hidden lg:block">
        <p className="stamp text-sari">Para sa estudyante lang</p>
        <h1 className="mt-4 text-6xl">Pasok ka, ka-eskwela.</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          PasaGamit is for verified students only — that's how we keep the palengke safe, legit, and scam-free.
        </p>
        <ul className="mt-6 space-y-2">
          {["Verified students only", "Meet at safe on-campus Pasa Points", "Ratings on every seller"].map((t) => (
            <li key={t} className="flex items-center gap-2 font-semibold"><BadgeCheck className="h-5 w-5 text-forest" aria-hidden /> {t}</li>
          ))}
        </ul>
      </div>

      <div className="flyer tape bg-paper p-6 sm:p-8">
        <h1 className="mb-4 text-3xl lg:hidden">Join PasaGamit</h1>
        <Tabs defaultValue="login">
          <TabsList className="flex h-auto w-full gap-0 bg-transparent p-0">
            <TabsTrigger value="login" className={TAB}>Login</TabsTrigger>
            <TabsTrigger value="register" className={TAB}>Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6"><LoginForm /></TabsContent>
          <TabsContent value="register" className="mt-6"><RegisterForm /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={id} role="alert" className="mt-1 text-sm font-semibold text-destructive">{msg}</p> : null;
}

function LoginForm() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<{ id?: string; pw?: string }>({});
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const x: typeof err = {};
    if (!isValidStudentVerification(id)) x.id = "Use your school email (e.g. name@school.edu.ph) or student ID (e.g. 2023-01456).";
    if (pw.length < 6) x.pw = "Password must be at least 6 characters.";
    setErr(x);
    if (Object.keys(x).length) return;
    signIn({ name: "Juan Dela Cruz", email: id.includes("@") ? id : "juan.delacruz@university.edu.ph", verification: id });
    toast.success("Welcome back!");
    navigate({ to: "/profile" });
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="li-id" className="kicker mb-1 block">School email or Student ID</label>
        <input id="li-id" className="field" value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" aria-invalid={!!err.id} aria-describedby={err.id ? "li-id-err" : undefined} />
        <Err id="li-id-err" msg={err.id} />
      </div>
      <div>
        <label htmlFor="li-pw" className="kicker mb-1 block">Password</label>
        <input id="li-pw" type="password" className="field" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" aria-invalid={!!err.pw} aria-describedby={err.pw ? "li-pw-err" : undefined} />
        <Err id="li-pw-err" msg={err.pw} />
      </div>
      <Button type="submit" size="lg" className="w-full">Login</Button>
      <p className="text-center text-xs text-muted-foreground">This is a demo — no real accounts are created.</p>
    </form>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const [v, setV] = useState({ name: "", email: "", verification: "", course: "", pw: "", agree: false });
  const [err, setErr] = useState<Partial<Record<keyof typeof v, string>>>({});
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const x: typeof err = {};
    if (v.name.trim().length < 2) x.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) x.email = "Enter a valid email.";
    if (!isValidStudentVerification(v.verification)) x.verification = "Enter a school email (.edu / .edu.ph) or student ID (e.g. 2023-01456).";
    if (v.pw.length < 6) x.pw = "At least 6 characters.";
    if (!v.agree) x.agree = "Please agree to the community guidelines.";
    setErr(x);
    if (Object.keys(x).length) return;
    signIn({ name: v.name.trim(), email: v.email.trim(), verification: v.verification.trim() });
    toast.success("Account verified! Welcome to PasaGamit.");
    navigate({ to: "/profile" });
  };
  const bind = (k: "name" | "email" | "verification" | "course" | "pw") => ({
    id: `rg-${k}`,
    value: v[k],
    onChange: (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value })),
    "aria-invalid": !!err[k],
    "aria-describedby": err[k] ? `rg-${k}-err` : undefined,
    className: "field",
  });
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div><label htmlFor="rg-name" className="kicker mb-1 block">Full name</label><input {...bind("name")} autoComplete="name" /><Err id="rg-name-err" msg={err.name} /></div>
      <div><label htmlFor="rg-email" className="kicker mb-1 block">Email</label><input {...bind("email")} type="email" autoComplete="email" /><Err id="rg-email-err" msg={err.email} /></div>
      <div className="border-2 border-dashed border-forest bg-forest/5 p-3">
        <label htmlFor="rg-verification" className="kicker mb-1 flex items-center gap-1 text-forest"><BadgeCheck className="h-4 w-4" aria-hidden /> Student verification</label>
        <input {...bind("verification")} placeholder="name@school.edu.ph or 2023-01456" />
        <p className="mt-1 text-xs text-muted-foreground">We use this to confirm you're an enrolled student.</p>
        <Err id="rg-verification-err" msg={err.verification} />
      </div>
      <div><label htmlFor="rg-pw" className="kicker mb-1 block">Password</label><input {...bind("pw")} type="password" autoComplete="new-password" /><Err id="rg-pw-err" msg={err.pw} /></div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={v.agree} onChange={(e) => setV((s) => ({ ...s, agree: e.target.checked }))} className="mt-1 accent-sari" />
        <span>I agree to the PasaGamit community guidelines and safe-transaction rules.</span>
      </label>
      <Err id="rg-agree-err" msg={err.agree} />
      <Button type="submit" size="lg" className="w-full">Create verified account</Button>
    </form>
  );
}
