import { DEMO_PROMO, isDemo } from "@/lib/demo";

/** Shown on every public page in demo mode, so nobody mistakes the demo for a working shop. */
export default function DemoBanner() {
  if (!isDemo()) return null;
  return (
    <div role="note" className="bg-[#3D1A00] text-white text-center px-4 py-2.5 text-sm font-semibold">
      Portfolio demo in test mode: nothing is saved, no payment is taken and nothing is delivered.
      Try promo code {DEMO_PROMO.code}.
    </div>
  );
}
