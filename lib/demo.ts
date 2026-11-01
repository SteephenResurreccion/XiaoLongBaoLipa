import { NextResponse } from "next/server";

// Portfolio demo mode. With DEMO_MODE=true nothing is saved and no outside service is called:
// no PayMongo or Stripe charge, no Lalamove request, no SMS, no database write, no admin.
// Orders live only in the visitor's own browser tab (sessionStorage) until the tab closes.
export function isDemo(): boolean {
  return process.env.DEMO_MODE === "true";
}

/** The one promo code that works in the demo. */
export const DEMO_PROMO = {
  code: "DEMO10",
  discountType: "percentage",
  discountValue: 10,
  partnerName: "Portfolio demo",
} as const;

/** The flat sample fee the demo shows instead of a Lalamove quote. */
export const DEMO_DELIVERY_FEE = 150;

/** Response for routes that have no purpose in the demo (payments, webhooks, admin). */
export function demoDisabledResponse() {
  return NextResponse.json({ error: "This is turned off in the portfolio demo." }, { status: 403 });
}
