import { ShieldCheck } from "lucide-react";
import { SAFETY_TIPS } from "@/lib/data";

export function SafetyTips() {
  return (
    <aside className="flyer tape bg-paper p-5" aria-labelledby="safety-title">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-forest" aria-hidden />
        <h2 id="safety-title" className="text-2xl">Safe Pasa Guidelines</h2>
      </div>
      <ol className="mt-3 space-y-2 text-sm">
        {SAFETY_TIPS.map((t, i) => (
          <li key={t} className="flex gap-3">
            <span className="marker text-sari text-lg leading-none">{i + 1}.</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
