import { createFileRoute } from "@tanstack/react-router";
import { Clock, LifeBuoy, Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageMasthead } from "@/components/site/PageMasthead";
import { validateInquiry, type InquiryErrors as Errors } from "@/lib/validation";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — PasaGamit" },
      { name: "description", content: "Get help with listings, reports, or your account. Send the PasaGamit student team an inquiry." },
      { property: "og:title", content: "Contact PasaGamit" },
      { property: "og:description", content: "Questions, reports, or partnerships — message the PasaGamit team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const FAQ = [
  ["How do I verify my student account?", "Register using your school email (@university.edu.ph) or student ID number."],
  ["Is PasaGamit free?", "Yes — posting and browsing are 100% free. Walang patong."],
  ["Someone didn't show up to our meetup.", "Report the listing with the flag button. Repeat no-shows get suspended."],
];

function Contact() {
  const [v, setV] = useState({ name: "", email: "", topic: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateInquiry(v);
    setErrors(err);
    const first = Object.keys(err)[0];
    if (first) return document.getElementById(`c-${first}`)?.focus();
    setSent(true);
    toast.success("Inquiry sent! We'll reply within 1–2 school days.");
    setV({ name: "", email: "", topic: "", message: "" });
  };

  const input = (k: keyof typeof v) => ({
    id: `c-${k}`,
    value: v[k],
    onChange: (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value })),
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `c-${k}-err` : undefined,
    className: "field",
  });

  return (
    <>
      <PageMasthead kicker="Sulat sa Patnugot" title="Contact Us" subtitle="May tanong, reklamo, o suggestion? The student team reads every message." />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} noValidate className="flyer space-y-5 bg-paper p-6 sm:p-8" aria-label="Inquiry form">
          {sent && (
            <p role="status" className="border-2 border-forest bg-forest/10 p-3 text-sm font-semibold text-forest">
              Salamat! Your message was received. Expect a reply in your inbox soon.
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="kicker mb-1 block">Full name</label>
              <input {...input("name")} autoComplete="name" />
              {errors.name && <p id="c-name-err" className="mt-1 text-sm font-semibold text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="c-email" className="kicker mb-1 block">Email</label>
              <input {...input("email")} type="email" autoComplete="email" placeholder="you@university.edu.ph" />
              {errors.email && <p id="c-email-err" className="mt-1 text-sm font-semibold text-destructive">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="c-topic" className="kicker mb-1 block">Topic</label>
            <select {...input("topic")}>
              <option value="">Select a topic</option>
              <option>Listing or transaction help</option>
              <option>Report a user or scam</option>
              <option>Account & verification</option>
              <option>Org partnership / events</option>
              <option>Feedback & suggestions</option>
            </select>
            {errors.topic && <p id="c-topic-err" className="mt-1 text-sm font-semibold text-destructive">{errors.topic}</p>}
          </div>
          <div>
            <label htmlFor="c-message" className="kicker mb-1 block">Message</label>
            <textarea {...input("message")} className="field min-h-40" />
            <p className="mt-1 text-xs text-muted-foreground">{v.message.trim().length}/20 characters minimum</p>
            {errors.message && <p id="c-message-err" className="mt-1 text-sm font-semibold text-destructive">{errors.message}</p>}
          </div>
          <Button type="submit" size="lg">Send inquiry</Button>
        </form>

        <aside className="space-y-6">
          <div className="flyer pin bg-mustard p-6">
            <h2 className="text-2xl">Contact details</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0" aria-hidden /> hello@pasagamit.ph</li>
              <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0" aria-hidden /> (02) 8123-4567 · 0917-123-4567</li>
              <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0" aria-hidden /> Student Center, Room 112, Main Campus</li>
              <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0" aria-hidden /> Mon–Fri, 8:00 AM – 5:00 PM</li>
            </ul>
          </div>
          <div className="flyer bg-paper p-6">
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-6 w-6 text-sari" aria-hidden />
              <h2 className="text-2xl">Support FAQ</h2>
            </div>
            <dl className="mt-3 divide-y divide-dashed divide-ink/30">
              {FAQ.map(([q, a]) => (
                <div key={q} className="py-3">
                  <dt className="font-bold">{q}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </>
  );
}
