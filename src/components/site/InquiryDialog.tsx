import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/data";

/** "Inquire / message seller" modal. Mock only — shows a confirmation toast. */
export function InquiryDialog({ listing, trigger }: { listing: Listing; trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(`Hi ${listing.seller.name.split(" ")[0]}! Available pa po ba ang "${listing.title}"?`);
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flyer rounded-none sm:max-w-lg">
        <DialogHeader>
          <p className="marker text-sari">Message the seller</p>
          <DialogTitle className="font-display text-2xl">{listing.title}</DialogTitle>
          <DialogDescription>
            To {listing.seller.name} · Meetup at {listing.meetup}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (msg.trim().length < 5) return setError("Please write a short message (at least 5 characters).");
            if (!contact.trim()) return setError("Add your school email or mobile number so they can reply.");
            setError("");
            setOpen(false);
            toast.success("Inquiry sent!", { description: `${listing.seller.name} will get back to you soon.` });
          }}
          noValidate
        >
          <div>
            <label htmlFor="inq-msg" className="kicker mb-1 block">Message</label>
            <textarea id="inq-msg" className="field min-h-28" value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <div>
            <label htmlFor="inq-contact" className="kicker mb-1 block">Your school email or mobile</label>
            <input id="inq-contact" className="field" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@university.edu.ph" />
          </div>
          {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">Tip: Always meet at a CCTV-covered Pasa Point on campus.</p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Send inquiry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
